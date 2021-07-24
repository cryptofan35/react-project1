import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import {
  fetchBookingStatus,
  fetchBookingInfo,
  createBookingInfo,
} from "API/ImportBookinData";
import { Redirect } from "react-router-dom";
import { siteValidator } from "../../../util/Validators";
import { Row, Col, Button, Progress } from "antd";
import { updatePropertyName } from "../../../appRedux/actions";
import { useFormatMessage } from "react-intl-hooks";

import "./importData.less";

import PropertyInput from "../../../components/property/Input";
import Modal from "antd/lib/modal/Modal";

import {
  SITE_ERR_MSG_2,
  BOOKING_PROPERTY_NOT_EXIST,
  BOOKING_ERR_IMPORT,
  IMPORT_STATUS_ERROR,
} from "../../../constants/ErrorMessages";

import "./importData.less";



const statusCodes = {
  0: 0,
  1: 50,
  3: 60,
  7: 70,
  15: 75,
  23: 80,
  31: 90,
  63: 100,
};

const TEN_MINUTES = 60*10*1000;

const convertStatusCodeToProgressValue = (code) => statusCodes[code];

const ImportData = (props) => {
  const { property, language, updatePropertyName } = props;

  const t = useFormatMessage();

  const FIELDS = [
    {
      name: "bookingurl",
      label: t({id: 'app.property.import.booking_property_url'}),
      placeholder: "https://www.booking.com/hotel/de/your-hotel-name.html",
      required: true,
      validators: [siteValidator(t({id: SITE_ERR_MSG_2}))],
    },
    //{
    //  name: "bookingobjectId",
    //  label: t({id: 'app.property.import.booking_property_id'}),
    //  required: true,
    //  validators: [],
    //},
  ];

  const [fields, setFields] = useState(FIELDS);
  const [propertyData, setPropertyData] = useState(null);
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({});
  const [importStatus, setImportStatus] = useState({});
  const [errors, setErrors] = useState({});
  const [progressValue, setProgressValue] = useState(0);
  const [isDisabledNext, setDisabledNext] = useState(false);
  const [bookingServerError, setBookingServerError] = useState(false);
  const [importError, setImportError] = useState(false);
  const [isModal, setModal] = useState(false);
  

  function getFieldByName(fieldName) {
    return fields.find((field) => field.name === fieldName) || {};
  }

  function getFieldIndexByName(fieldName) {
    return fields.findIndex((field) => field.name === fieldName);
  }

  useEffect(() => {
    if (property) {
      const values = fields.reduce((values, field) => {
        return {
          ...values,
          [field.name]: field.unserialize
            ? field.unserialize(property[field.name])
            : property[field.name],
        };
      }, {});
      setValues(values);

      fetchBookingInfo({ property, language })
        .then(({ data }) => {
          const { status, date, bookingobjectId, bookingurl, msg } = data;

          if (status == 1) {
            setStep(4);
            setValues({ bookingobjectId, bookingurl });
            setImportStatus({ inProgress: msg, updatedTime: date });
            setPropertyData(null);
          } else if (status == 2) {
            setStep(4);
            setValues({ bookingobjectId, bookingurl });
            setImportStatus({ updatedTime: date });
          }
        })
        .catch(() => {
          setStep(1);
          handleClickConfirmChange();
        });
    }
  }, [property]);

  useEffect(() => {
    let isValid = false;

    fields.forEach((field) => {
      field.validators &&
        field.validators.forEach((validator) => {
          if (validator(values[field.name])) {
            isValid = true;
          }
        });
    });

    const isOneOfInputsEmpty = !(values.bookingurl || values.bookingobjectId);
    setDisabledNext(isOneOfInputsEmpty || isValid);
  }, [values]);

  const trimBookingUrl = (url) => {
    if (typeof url !== 'string') {
      return '';
    }

    return url.split('?')[0];
  }

  function handleChange(fieldName, newValue) {
    const fieldIndex = getFieldIndexByName(fieldName);

    if (fieldIndex === -1) return;
    
    if (fieldName === 'bookingurl') {
      newValue = trimBookingUrl(newValue);
    }

    const newValues = {
      ...values,
      [fieldName]: newValue,
    };

    setValues(newValues);
    setErrors({
      ...errors,
      [fieldName]: false,
    });

    return newValues;
  }

  const handleBlur = (fieldName) => (event, currentValues = values) => {
    const field = getFieldByName(fieldName);
    let validMsg = "";

    field.validators &&
      field.validators.forEach((validator) => {
        if (validMsg) {
          return;
        }

        validMsg = validator(currentValues[field.name]);
      });

    if (validMsg) {
      return setErrors({
        ...errors,
        [fieldName]: validMsg,
      });
    }

    // handleSubmit({
    //   propertyId: property.id,
    //   fieldName,
    //   fieldValue: field.serialize
    //     ? field.serialize(currentValues[field.name])
    //     : currentValues[field.name],
    // });
    // .then((response) => {
    //   if (response && !response.result) {
    //     setErrors({
    //       ...errors,
    //       [fieldName]: response.payload
    //     });
    //     return;
    //   }
    // });
  };

  // const handleSubmit = async (field) => {
  //   return await props.updateProperty(field);
  // };

  function renderFieldInput(fieldName) {
    const field = getFieldByName(fieldName);

    return (
      <PropertyInput
        name={fieldName}
        label={field.label}
        placeholder={field.placeholder}
        value={values[fieldName]}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        onBlur={handleBlur(fieldName)}
        required={field.required}
        errorMessage={errors[fieldName]}
      />
    );
  }

  const handleClickNext = async () => {
    setDisabledNext(true);
    await fetchBookingInfo({ property, language })
      .then((response) => {
        setPropertyData(response);
        setStep(step + 1);
      })
      .catch(() => {
        createBookingInfo({
          property,
          language,
          values,
          importDataFlag: false,
        }).then(({ data }) => {
          const newPropertyData = {
            name: data.hotelname,
            address: `${data.address},<br/>${data.city} ${data.zipcode},<br/>${data.country}`,
          };
          setPropertyData(newPropertyData);
          setStep(step + 1);
        }).catch(()=>{
          setBookingServerError(t({ id: BOOKING_PROPERTY_NOT_EXIST }));
        }).finally(()=>{
          setDisabledNext(false);
        });
      });
  };

  const progressImitation = (progressValue, bookingProgressValue) => {
    const progressImitationTimeout = (progressValue) => {
      if (progressValue >= bookingProgressValue) {
        clearTimeout(timer);
        return;
      }

      setProgressValue(progressValue + 1);
      let timer = setTimeout(
        () => progressImitationTimeout(progressValue + 1),
        100
      );
    };
    progressImitationTimeout(progressValue);
  };
  const progressStatus = (dataStatus) => {
    let intervalTime = TEN_MINUTES;
    let tempStatus = 0;

    const requestStatus = () => {
      if (intervalTime >= 4 * TEN_MINUTES && tempStatus !== 63) {
        setImportError(IMPORT_STATUS_ERROR);    
        clearTimeout(statusTimer);
        return;
      } else if (intervalTime >= 4 * TEN_MINUTES || tempStatus == 63) {
        clearTimeout(statusTimer);      
        setStep(4);
        return;
      }
      fetchBookingStatus(property)
        .then(({ data }) => {
          const { status } = data;

          if (status > tempStatus) {
            progressImitation(
              convertStatusCodeToProgressValue(tempStatus),
              convertStatusCodeToProgressValue(status)
            );
            tempStatus = status;
          }
          
        })
        .catch(() => {
          setImportError(IMPORT_STATUS_ERROR);
        });
      
      intervalTime += TEN_MINUTES;

      let statusTimer = setTimeout(() => requestStatus(), TEN_MINUTES);
    };

    requestStatus();
  };

  const handleClickImport = async () => {
    await createBookingInfo({
      property,
      language,
      values,
      importDataFlag: true,
    })
      .then((response) => {
        const {
          data: { status, date },
        } = response;

        if (status == 0) {
          setImportError(t({ id: BOOKING_ERR_IMPORT }));
          return;
        }

        updatePropertyName(propertyData.name, property.id);

        if (status == 1) {
          fetchBookingStatus(property).then(({ data }) => {
            setStep(step + 1);
            progressStatus();
          });
        } else if (status === 2) {
          setStep(step + 2);
          setPropertyData(null);
          setImportStatus({ updatedTime: date });
        }
      })
  };

  const handleClickConfirmChange = () => {
    setStep(1);
    setPropertyData(null);
    setValues({});
    setModal(false);
    setProgressValue(0);
    setImportError(false);
    setBookingServerError(false);
  };

  if (property && !property.objectId) {
    return <Redirect to="/" />;
  }
  if(progressValue > 100){
    return <Redirect to="/property/import" />;
  }
  return (
    <div className="cb-name-content-wrapper property-import-data">
      <div className="breadcrumb-wrapper">
        <span>{t({ id: "app.property.import.import_data" })}</span>
      </div>
      <div className="property-form-wrapper">
        {step !== 4 && (
          <div className="form-title-wrapper form-title-wrapper-justify">
            {step === 1 && !bookingServerError && (
              <span className="form-title">
                {t({ id: "app.property.import.using_info" })}
              </span>
            )}
            {step === 1 && bookingServerError && (
              <span className="form-warning">{bookingServerError}</span>
            )}
            {step === 2 && !importError && (
              <span className="form-warning">
                {t({ id: "app.property.import.click_info" })}
              </span>
            )}
            {importError && <span className="form-warning">{importError}</span>}
          </div>
        )}
        <div className="import__fields">
          <Row gutter={[44, 0]}>
            {step !== 4 && step !== 3 && (
              <Col span={12}>
                {renderFieldInput("bookingurl")}
              </Col>
            )}
            {(step === 4 || step === 3) && (
              <Col span={12}>
                <div className="import__url">
                  <div className="import__url-title">
                    {t({ id: "app.property.import.booking_property_url" })}:
                  </div>
                  <div className="import__url-value">
                    {values["bookingurl"] || ""}
                  </div>
                </div>
                {importStatus.updatedTime ? (
                  <div className="import__date">
                    <div className="import__date-title">
                      {importStatus.inProgress ||
                        t({ id: "app.property.import.imported_successfully" })}
                    </div>
                    <div className="import__date-value">
                      {t({ id: "app.property.import.last_update" })}:{" "}
                      {importStatus.updatedTime}
                    </div>
                  </div>
                ) : null}
              </Col>
            )}
            {propertyData && (
              <Col span={12} className="import__data">
                <h3 className="import__data-title">
                  {t({ id: "app.property.import.property_data" })}:
                </h3>
                <div className="import__data-content">
                  <h4 className="import__data-content-title">
                    {propertyData.name}
                  </h4>
                  <div
                    className="import__data-content-address"
                    dangerouslySetInnerHTML={{ __html: propertyData.address }}
                  />
                </div>
              </Col>
            )}
          </Row>
        </div>
        {step === 3 && (
          <div className="import__progress">
            <span className="import__progress-value">{progressValue}%</span>
            <Progress
              percent={progressValue}
              showInfo={false}
              className="import__progress-line"
              strokeColor="#005C81"
              trailColor="#EEF0F5"
              strokeWidth={20}
            />
            <p className="import__progress-text">
              {t({ id: "app.property.import.booking_com_info" })}
            </p>
          </div>
        )}
        <Row
          gutter={[20, 0]}
          className={classNames("navigation", { ["small-mt"]: step === 3 })}
        >
          <Col span={12}>
            {step === 2 && (
              <Button onClick={handleClickConfirmChange} type="link">
                {t({ id: "app.common.back" })}
              </Button>
            )}
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {step === 1 && (
              <Button
                type="primary"
                disabled={isDisabledNext}
                onClick={handleClickNext}
              >
                {t({ id: "app.common.next" })}
              </Button>
            )}
            {step === 2 && (
              <Button type="primary" onClick={handleClickImport}>
                {t({ id: "app.property.import.import_data" })}
              </Button>
            )}
            {/* {step === 4 && (
              <Button type="primary" onClick={() => setModal(true)}>
                {t({id: 'app.property.import.change'})}
              </Button>
            )} */}
          </Col>
        </Row>
      </div>
      <Modal
        visible={isModal}
        footer={null}
        onCancel={() => setModal(false)}
        className="modal__delete"
      >
        <div className="modal__delete-title">
          {t({ id: "app.property.import.click_info" })}
        </div>
        <div className="modal__delete-buttons">
          <Button type="primary" onClick={() => setModal(false)}>
            {t({ id: "app.common.cancel" })}
          </Button>
          <Button type="primary" ghost onClick={handleClickConfirmChange}>
            {t({ id: "app.common.ok" })}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = ({ property: propertyState, settings }) => {
  const { property } = propertyState;
  const {
    locale: { locale },
  } = settings;

  return { property, language: locale };
};

export default connect(mapStateToProps, { updatePropertyName })(ImportData);
