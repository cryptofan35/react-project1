import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "antd";
import PropertyInput from "../../../components/property/Input"
import PropertySelect from "../../../components/property/Select"
import { updateProperty, updatePropertyState } from "../../../appRedux/actions";
import { showNotification } from "util/notifications";
import { useFormatMessage } from 'react-intl-hooks';

import { emailValidator, charLimitValidator } from "../../../util/Validators";

import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { EMAIL_ERR_MSG, TOO_LONG_ERR_MSG } from "../../../constants/ErrorMessages";
import { updatePropertyXML } from "../../../API/Property";
import { BILLING_ADDRESS } from "../../../constants/xmlTypes";

const EN_LANGUAGE_ID = 2;

let isCountriesSpecified = false;

const BillingAddress = (props) => {
  const { countries, regions, property } = props;

  const t = useFormatMessage();

  const FIELDS = [
    {
      name: 'billing_invoice_recipient',
      label: 'app.property.billing.invoice_recipient',
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    },
    {
      name: 'billing_street',
      label: 'app.property.billing.street',
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 120),
      ]
    },
    {
      name: 'billing_street_number',
      label: 'app.property.billing.street_number',
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 120),
      ]
    },
    {
      name: 'billing_street2',
      label: 'app.property.billing.second_street',
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 120),
      ]
    },
    {
      name: 'billing_country',
      label: 'app.property.billing.country',
      placeholder: 'app.common.select'
    },
    {
      name: 'billing_region',
      label: 'app.property.billing.region',
      placeholder: 'app.common.select'
    },
    {
      name: 'billing_city',
      label: 'app.property.billing.city',
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    },
    {
      name: 'billing_postcode',
      label: 'app.property.billing.post_code',
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 30),
      ]
    },
    {
      name: 'billing_email',
      label: 'app.property.billing.email',
      placeholder: 'example@mail.com',
      validators: [
        emailValidator(t({id:EMAIL_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    }
  ];

  const [fields, setFields] = useState(FIELDS);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaved, setSaved] = useState(null);
  const [isDisabledNext, setDisabledNext] = useState(false);

  function getFieldByName(fieldName) {
    return fields.find(field => field.name === fieldName) || {};
  }

  function getFieldIndexByName(fieldName) {
    return fields.findIndex(field => field.name === fieldName);
  }

  useEffect(() => {

    if (property) {

      if (property.objectId == null) {
        props.history.push('/property/name');
        return;
      }

      const values = FIELDS.reduce((values, field) => {
        return {
          ...values,
          [field.name]: field.unserialize ?  field.unserialize(property[field.name]) : property[field.name]
        }
      }, {});

      isCountriesSpecified = false;

      setValues(values);

    }
  }, [property]);

  useEffect(() => {
    let isValid = true;

    configFieldsStatus(property && property['billing_address'] === true);

    fields.forEach(field => {
      field.validators && field.validators.forEach(validator => {
        if (validator(values[field.name])) isValid = false;
      });
    });

    setDisabledNext(!isValid);
  }, [values]);

  function configFieldsStatus(disabled) {
    const addressFields = [
      'billing_street',
      'billing_street_number',
      'billing_street2',
      'billing_country',
      'billing_region',
      'billing_city',
      'billing_postcode',
      'billing_email'
    ];

    const newFields = fields.map(field => {
      if (addressFields.includes(field.name)) {
        field.disabled = disabled;
      }

      return field;
    });

    setFields(newFields);
  }

  function handleChangeSelect(fieldName, newValue) {
    const values = handleChange(fieldName, newValue);
    handleBlur(fieldName)({}, values);
  }

  function handleBlurSelect(fieldName) {
    const field = getFieldByName(fieldName);
    let validMsg = '';

    field.validators && field.validators.forEach(validator => {
      if (validMsg) {
        return;
      }

      validMsg = validator(values[field.name]);
    });

    if (validMsg) {
      return setErrors({
        ...errors,
        [fieldName]: validMsg
      });
    }
  }

  function handleChange(fieldName, newValue) {
    const fieldIndex = getFieldIndexByName(fieldName);

    if (fieldIndex === -1) return;

    const newValues = {
      ...values,
      [fieldName]: newValue
    };

    setValues(newValues);
    setErrors({
      ...errors,
      [fieldName]: false
    });

    return newValues;
  }


  const handleBlur = fieldName => (event, currentValues = values) => {
    if (currentValues[fieldName] === property[fieldName]) {
    return;
    }

    const field = getFieldByName(fieldName);
    let validMsg = "";

    field.validators &&
    field.validators.forEach(validator => {
      if (validMsg) {
        return;
      }

      validMsg = validator(currentValues[field.name]);
    });

    if (validMsg) {
      return setErrors({
        ...errors,
        [fieldName]: validMsg
      });
    }

    if (fieldName === "billing_country") {
      const regionFieldIndex = getFieldIndexByName("billing_region");
      const newFields = [...fields];

      const currentCountryCode = currentValues["billing_country"];

      const currentCountry = countries.find(
        ({iso_3166,language_id}) => iso_3166 == currentCountryCode && language_id == EN_LANGUAGE_ID);

      if (!currentCountry) return;

      const availableRegions = regions.filter(
        ({ country_id }) => country_id == currentCountry.country_id
      );

      newFields[regionFieldIndex].options = availableRegions.map(
        ({ id, name }) => ({
          id: name,
          value: name
        })
      );

      setFields(newFields);

      const newValues = {
        ...currentValues,
        billing_region: ""
      };

      setValues(newValues);
    }

    if (property.objectId) {
      handleSubmit({
        objectId: property.objectId,
        propertyId: property.id,
        fieldName,
        fieldValue: field.serialize
          ? field.serialize(currentValues[field.name])
          : currentValues[field.name]
      }).then(response => {

        if (property.objectId && fieldName === "billing_country") {
          handleSubmit(
            { propertyId: property.id, fieldName: "billing_region", fieldValue: null, objectId: property.objectId },
            false
          );
        }
      });
    }
  };


  const handleSubmit = async (field, isTipShowed = true) => {
    const valuesToUpdate = {
      ...values,
      [field.fieldName]: field.fieldValue,
      objectId: property.objectId
    }

    return updatePropertyXML(valuesToUpdate, BILLING_ADDRESS)
    .then(res => {
      if (res.status == 'Success' && isTipShowed) {
        if (field.fieldName !== 'billing_country') {
          props.updatePropertyState({...property, ...res.result});
        }
        showNotification({message:'Saved'});
        setSaved(true);
        setTimeout(() => {
          setSaved(null);
        }, 1500);
      }

      return res;
    })
  };

  function handleClickNext() {
    props.history.push('/property/legal');
  }

  function renderFieldInput (fieldName) {
    const field = getFieldByName(fieldName);

    return <PropertyInput
      name={fieldName}
      label={t({id: field.label})}
      placeholder={field.placeholder
        ? field.placeholder.indexOf('app.') === 0
          ? t({id:field.placeholder})
          : field.placeholder
        : ''}
      value={values[fieldName]}
      onChange={(e) => handleChange(fieldName, e.target.value)}
      onBlur={handleBlur(fieldName)}
      required={field.required}
      errorMessage={errors[fieldName] ? t({id: errors[fieldName]}) : ''}
      disabled={field.disabled}
    />
  }

  function renderFieldSelect (fieldName) {
    const field = getFieldByName(fieldName);

    return <PropertySelect
      name={fieldName}
      label={t({id: field.label})}
      placeholder={field.placeholder ? t({id: field.placeholder}) : ''}
      options={field.options}
      value={values[fieldName] ? values[fieldName] : field.default || null}
      onChange={(value) => handleChangeSelect(fieldName, value)}
      onBlur={() => handleBlurSelect(fieldName)}
      required={field.required}
      errorMessage={errors[fieldName] ? t({id: errors[fieldName]}) : ''}
      showArrow={field.showArrow}
      disabled={field.disabled}
    />
  }

  useEffect(() => {

    if (isCountriesSpecified) {
      return;
    }

    if (!Object.keys(values).length && !countries.length || !regions.length) {
      return;
    }

    isCountriesSpecified = true;
    const countryFieldIndex = getFieldIndexByName('billing_country');
    const regionFieldIndex = getFieldIndexByName('billing_region');
    const newFields = [...fields];

    newFields[countryFieldIndex].options = countries
      .filter(country => country.language_id === EN_LANGUAGE_ID)
      .map(({ country_id, iso_3166, text }) => ({
        id: iso_3166,
        value: text
      }))
      .sort((prev, next) => prev.value < next.value ? -1 : 1);

      const currentCountryCode = property['billing_country'];
    const currentCountry = countries.find(
      ({iso_3166,language_id}) => iso_3166 == currentCountryCode && language_id == EN_LANGUAGE_ID);


      if (!currentCountry) return;

      const availableRegions = regions.filter(
        ({ country_id }) => country_id == currentCountry.country_id
      );

      newFields[regionFieldIndex].options = availableRegions.map(
        ({ id, name }) => ({
          id: name,
          value: name
        })
      );

    setFields(newFields);
  }, [values, countries, regions]);

  return (
    <div className="cb-name-content-wrapper">
      <div className="breadcrumb-wrapper">
        <span>{t({id: 'app.property.billing.billing_address'})}</span>
      </div>

      <div className="property-form-wrapper">
        {/* <div className="form-title-wrapper form-title-wrapper-no-margin form-title-wrapper-height-10 form-title-wrapper-flex-end">
          <span className={classNames('form-tip', { 'form-tip-visible': isSaved })}>Saved</span>
        </div> */}
        <Row gutter={[30, 0]}>
          <Col span={24}>
            {renderFieldInput('billing_invoice_recipient')}
          </Col>
        </Row>
        <Row gutter={[30, 0]}>
          <Col span={12}>
            {renderFieldInput('billing_street')}
          </Col>
          <Col span={12}>
            {renderFieldInput('billing_street_number')}
          </Col>
        </Row>
        <Row gutter={[30, 0]}>
          <Col span={12}>
            {renderFieldInput('billing_street2')}
          </Col>
          <Col span={12}>
            {renderFieldSelect('billing_country')}
          </Col>
        </Row>
        <Row gutter={[30, 0]}>
          <Col span={12}>
            {renderFieldSelect('billing_region')}
          </Col>
          <Col span={12}>
            {renderFieldInput('billing_city')}
          </Col>
        </Row>
        <Row gutter={[30, 0]}>
          <Col span={12}>
            {renderFieldInput('billing_postcode')}
          </Col>
          <Col span={12}>
            {renderFieldInput('billing_email')}
          </Col>
        </Row>
        <Row gutter={[20, 16]}>
          <Col span={12}>
            <Link to="/property/name">
              <Button  type='link'>{t({id: 'app.common.back'})}</Button>
            </Link>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type='primary' disabled={isDisabledNext} onClick={handleClickNext}>{t({id:'app.common.next'})}</Button>
          </Col>
        </Row>
      </div>
    </div >
  )
};

const mapStateToProps = ({ data, property: propertyState }) => {
  const { countries, regions } = data;
  const { property } = propertyState;

  return { property, countries, regions }
};

export default connect(mapStateToProps, { updateProperty, updatePropertyState })(BillingAddress);
