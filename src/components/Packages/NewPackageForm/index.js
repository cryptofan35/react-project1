import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  message,
  DatePicker,
  Checkbox
} from "antd";

// import "../../styles/layout/formStyles.less";
import { useForm } from "antd/lib/form/Form";

import PicturesTab from "routes/Pictures/components/PicturesTab/PicturesTab";
import Editor from "components/Editor/Editor";

import Marketplaces from "constants/Packages/Marketplaces";
import arrowDown from "assets/images/arrow-down-black.png";

import { DecimalInputField, IntegerInputField } from '../../Fields'
import { minNumberValidator } from 'util/Validators'
import "./newPackageForm.less";
import { VoucherDurations } from "constants/VoucherDurations";
import { useFormatMessage } from 'react-intl-hooks';

import {
  clearPackageDetails as clearPackageDetailsAction,
  updatePackage as updatePackageAction,
  toggleNewPackage as toggleNewPackageAction,
  getRooms as getRoomsAction,
  getPictures as getPicturesAction,
  createPackage as createPackageAction,
  getPackages as getPackagesAction,
  addUploadedPictureUid,
  removeUploadedPictureUid
} from "appRedux/actions";

import { getConfigDetails } from "appRedux/actions/Ebay";

const { Option } = Select;

const NewPackageForm = ({
  propertyCurrency,
  edit,
  loading,
  packageDetails,
  clearPackageDetails,
  history,
  updatePackage,
  isNewPackage,
  toggleNewPackage,
  property,
  rooms,
  getRooms,
  libraryImages,
  getPictures,
  userLanguageId,
  createPackage,
  getPackages,
  uploadedPictureUids,
  addUploadedPictureUid,
  removeUploadedPictureUid,
  ebaySettings,
  getConfigDetails
 }) => {
  const [form] = useForm();
  const [marketPlace, setMarketPlace] = useState(null);
  const [packageImages, setPackageImages] = useState([]);
  const [currency, setCurrency] = useState(propertyCurrency);
  const [loaded, setLoaded] = useState(false);
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(true);
  const t = useFormatMessage();

  useEffect(() => {
    return () => {
      if (!isNewPackage) {
        clearPackageDetails()
      }
    }
  }, [])

  const loadPictures = async () => {
    if (! property) {
      return;
    }

    if (! property.objectId) {
      return;
    }

    await getPictures({
      objectId: property.objectId,
      errorLang: userLanguageId.substring(0, 2),
      category: 5
    })
  }

  useEffect(() => {
    if (property && property.objectId) {
      loadPictures();
      getConfigDetails(property.objectId);
    }
  }, [property]);

  const handleImageUpload = async (imageUid) => {
    await addUploadedPictureUid(imageUid);
    loadPictures();
  }

  useEffect(() => {
    if (! edit || ! packageDetails || ! packageDetails.imageUrls || ! libraryImages) {
      setPackageImages([]);
      return;
    }

    const packageImageUrls = packageDetails.imageUrls.map(imageUrl => imageUrl.replace(/http[s]?:/, ''));
    setPackageImages(libraryImages.filter((libraryImage) => {
      return packageImageUrls.indexOf(libraryImage.url) >= 0;
    }))
  }, [packageDetails, libraryImages])

  useEffect(() => {
    if (uploadedPictureUids.length > 0) {
      const newPicture = libraryImages.find((libraryImage) => uploadedPictureUids.indexOf(libraryImage.uid) >= 0);
      if (! newPicture) {
        return;
      }
      setPackageImages([...packageImages, newPicture]);
      removeUploadedPictureUid(newPicture.uid);
    }
  }, [libraryImages])

  useEffect(() => {
    if (property && property.objectId) {
      getRooms(property.objectId);

      if (marketPlace !== null) {
        setCurrency(Marketplaces[marketPlace]['currency']);
      }
    }
  }, [property, marketPlace])

  useEffect(() => {
    if (edit && packageDetails && packageDetails.marketPlaceId) {
      setMarketPlace(packageDetails.marketPlaceId);
    }
  }, [edit, packageDetails])

  useEffect(() => {
    setLoaded(rooms && ebaySettings && libraryImages);
  }, [rooms, ebaySettings, libraryImages])

  const handleSuccess = async () => {
    if (isNewPackage) {
      return history.push('/calendars/update');
    }

    await getPackages({
      objectId: property.objectId,
      errorLang: userLanguageId.substring(0, 2),
      offset: 0,
      limit: 10
    });
    return history.push('/packages/templates');
  }

  const handleSubmit = async data => {
    setIsSubmitButtonEnabled(false);
    let payload = {
      objectId: property.objectId,
      marketplaceId: data.marketPlaceId,
      roomId: data.roomId,
      price: data.price,
      numberOfNights: data.numberOfNights,
      numberOfGuests: data.numberOfGuests,
      voucherValidity: data.voucherValidity,
      name: data.name,
      description: data.description,
      voucherDescription: data.voucherDescription,
      imageUrls: libraryImages.filter(({uid}) => data.packagePictures.indexOf(uid) >= 0).map(({url}) => url),
      calendarOffer: data.bookable === t({id: 'app.common.yes'}),
      marketPlaceCurrencyCode: currency,
      propertyCurrencyCode: propertyCurrency,
      availabilityPrice: data.availabilityPrice
    };
    try {
      if (! edit) {
        await createPackage(payload, handleSuccess);
        return;
      }

      payload.packageId = packageDetails.packageId;
      await updatePackage(payload, handleSuccess);

      setIsSubmitButtonEnabled(true);
    } catch (error) {
      console.log(error);
      setIsSubmitButtonEnabled(true);
    }

  }

  const onSaveAndRedirect = (status) => {
    toggleNewPackage(status);
  }

  if (! loaded) {
    return (<div></div>);
  }

  return (
    <Form
      name="packages"
      className="cultbay-form new-package-form"
      form={form}
      onFinish={handleSubmit}
      initialValues={{
        ...packageDetails,
        marketPlaceId: null,
      }}
    >
      <Row gutter={30}>
        <Col span={24}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.package_name'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="name"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              },
              {
                max: 64,
                message: t({id: 'app.common.max_characters_allowed'}, {length: 64})
              },
              {
                pattern: new RegExp("^[-~\\sA-Za-zÀ-ž\\u0370-\\u03FF\\u0400-\\u04FF\\d,\.]*$"),
                message: t({id: 'app.packages.package_form.do_not_use_special_characters'}),
                validateTrigger: "onChange"
              }
            ]}
            // validateTrigger={["onBlur"]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.room'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="roomId"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Select
              // disabled={isEdit}
              placeholder={t({id: 'app.common.select'})}
              getPopupContainer={trigger => trigger.parentNode}
              suffixIcon={<img src={arrowDown} />}
            >
              {rooms && rooms.length > 0 ?
              (rooms.map(({id, name}) => (
                <Option key={id} value={id}>
                    {name}
                  </Option>
              ))) :
              (<Option>{t({id: 'app.packages.package_form.no_rooms_to_select'})}</Option>)}

            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            labelCol={{ span: 24 }}
            name="price"
            shouldUpdate={(prevValues, currentValues) => {
              return currentValues === 0
            }}
            label={
              <span>
                {t({id: 'app.packages.package_form.price'})}<span className="required-star">*</span>:
              </span>
            }
            rules={
              [
                {
                  message: t({id: 'app.common.field_is_required'}),
                  validator: minNumberValidator(0)
                }
              ]
            }
            validateTrigger={["onBlur"]}
          >
            <DecimalInputField addonAfter={propertyCurrency} minValue={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.number_of_nights'})}<span className="required-star">*</span>:
              </span>
            }
            shouldUpdate={(prevValues, currentValues) => {
              return currentValues === 0
            }}
            labelCol={{ span: 24 }}
            name="numberOfNights"
            rules={[
              {
                message: t({id: 'app.common.field_is_required'}),
                validator: minNumberValidator(0)
              }
            ]}
            validateTrigger={["onBlur"]}
          >
            <IntegerInputField />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            labelCol={{ span: 24 }}
            name="numberOfGuests"
            shouldUpdate={(prevValues, currentValues) => {
              return currentValues === 0
            }}
            label={
              <span>
                {t({id: 'app.packages.package_form.number_of_people'})}<span className="required-star">*</span>:
              </span>
            }
            rules={
              [
                {
                  message: t({id: 'app.common.field_is_required'}),
                  validator: minNumberValidator(0)
                }
              ]
            }
            validateTrigger={["onBlur"]}
          >
            <IntegerInputField />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.booking_options'})}:
              </span>
            }
            labelCol={{ span: 24 }}
            name="bookable"
            initialValue={!packageDetails || packageDetails.calendarOffer ? t({id: 'app.common.yes'}) : t({id: 'app.common.no'})}
          >
            <Select
              // disabled={isEdit}
              placeholder={t({id: 'app.common.select'})}
              getPopupContainer={trigger => trigger.parentNode}
              suffixIcon={<img src={arrowDown} />}
            >
              <Option value={t({id: 'app.common.yes'})}>{t({id: 'app.packages.package_form.instant_booking_online'})}</Option>
              <Option value={t({id: 'app.common.no'})}>{t({id: 'app.packages.package_form.booking_by_request_to_hotel'})}</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.marketplace'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="marketPlaceId"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              }
            ]}
          >
            <Select
              // disabled={isEdit}
              placeholder={t({id: 'app.common.select'})}
              getPopupContainer={trigger => trigger.parentNode}
              suffixIcon={<img src={arrowDown} />}
              onChange={(value) => setMarketPlace(value)}
            >
              {Object.values(Marketplaces).map(({id, name}) => (<Option key={id} value={id}>{name}</Option>))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row align="middle" gutter={30}>
        <Col span={12}>
          {t({id: 'app.packages.package_form.arrival'})}
        </Col>
        <Col className="fix" span={12}>
          <Form.Item
            gutter={30}
            labelCol={{ span: 24 }}
            name="availabilityPrice"
            shouldUpdate={(prevValues, currentValues) => {
              return currentValues === 0
            }}
            rules={
              [
                {
                  message: t({id: 'app.common.field_is_required'}),
                  validator: minNumberValidator(-1)
                }
              ]
            }
            validateTrigger={["onBlur"]}
          >
            <DecimalInputField addonAfter={currency} minValue={1} />
          </Form.Item>
        </Col>
      </Row>
      <Row className="new-package-form-description" gutter={30}>
        <Col span={24}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.package_description'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="description"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              },
            ]}
          >
            <Editor
              toolbar={[
                'heading',
                'bold',
                'italic',
                'underline',
                'numberedList',
                'bulletedList'
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={24}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.package_pictures'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="packagePictures"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              },
            ]}
          >
            <PicturesTab category={5} libraryImages={libraryImages} onPictureUploaded={handleImageUpload} preSelectedPictures={packageImages} />
          </Form.Item>
        </Col>
      </Row>
      <Row className="new-package-form-voucher" gutter={30}>
        <Col span={24}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.voucher_text'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="voucherDescription"
            rules={[
              {
                required: true,
                message: t({id: 'app.common.field_is_required'})
              },
              {
                max: 900,
                message: t({id: 'app.common.max_characters_allowed_with_html_tags'})
              },
            ]}
          >
            <Editor
              toolbar={[
                'heading',
                'bold',
                'italic',
                'underline',
                'numberedList',
                'bulletedList'
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item
            gutter={30}
            label={
              <span>
                {t({id: 'app.packages.package_form.voucher_validity'})}<span className="required-star">*</span>:
              </span>
            }
            labelCol={{ span: 24 }}
            name="voucherValidity"
          >
            <Select
              // disabled={isEdit}
              placeholder={t({id: 'app.common.select'})}
              getPopupContainer={trigger => trigger.parentNode}
              suffixIcon={<img src={arrowDown} />}
            >
              {
                VoucherDurations .map(({ value, label, length }) => (
                  <Option key={value} value={value}>
                    {`${length} ${t({id: label})}`}
                  </Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[30]} justify="end" style={{ marginTop: "70px" }}>
        <Col>
          <Button
            className="content-form__button"
            type="link"
            htmlType="submit"
            onClick={() => onSaveAndRedirect(false)}
            disabled={!isSubmitButtonEnabled}
          >
            {t({id: 'app.common.save'})}
          </Button>
        </Col>
        <Col>
          <Button
            className="content-form__button"
            type="primary"
            htmlType="submit"
            loading={loading}
            onClick={() => onSaveAndRedirect(true)}
            disabled={!isSubmitButtonEnabled}
          >
            {t({id: 'app.common.save'})} & {t({id: 'app.common.next'})}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}


const mapStateToProps = ({ packages, rooms, property, picture, auth, ebay }) => {
  const { packageDetails, isNewPackage } = packages;
  const { property: propertyObject } = property;
  const { currency: propertyCurrency } = propertyObject ? propertyObject : { currency: "EUR" };

  return {
    packageDetails,
    isNewPackage,
    rooms: rooms ? rooms.rooms : [],
    property: propertyObject,
    propertyCurrency,
    libraryImages: picture.pictures ? picture.pictures : [],
    uploadedPictureUids: picture.uploadedPictureUids,
    userLanguageId: auth.user ? auth.user.language_id : null,
    ebaySettings: ebay.settings
   };
};

const mapDispatchToProps = {
  updatePackage: updatePackageAction,
  toggleNewPackage: toggleNewPackageAction,
  getRooms: getRoomsAction,
  getPictures: getPicturesAction,
  createPackage: createPackageAction,
  clearPackageDetails: clearPackageDetailsAction,
  getPackages: getPackagesAction,
  addUploadedPictureUid,
  removeUploadedPictureUid,
  getConfigDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPackageForm);
