import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Checkbox, Button, Spin } from "antd";
import GoogleMapReact from "google-map-react";
import PropertyInput from "../../../components/property/Input";
import PropertySelect from "../../../components/property/Select";
import { updateProperty, updatePropertyState } from "../../../appRedux/actions";
import { useFormatMessage } from 'react-intl-hooks';

import unserializerPhone from "../../../util/unserializers/phone";
import unserializerToNumber from "../../../util/unserializers/toNumber";
import { profileCreate } from "../../../API/Property";

import showErrorMessage from "util/showErrorMessage";
import { showNotification } from "util/notifications";
import { UPDATE_NAMEADDRESS, BILLING_ADDRESS, LEGAL_ADDRESS } from "../../../constants/xmlTypes";
import { updatePropertyXML } from "../../../API/Property";

import {
  requiredValidator,
  latLngValidator,
  emailValidator,
  starsValidator,
  zoomValidator,
  phoneValidator,
  siteValidator,
  charLimitValidator
} from "../../../util/Validators";

import {
  REQUIRED_ERR_MSG,
  EMAIL_ERR_MSG,
  LATLNG_ERR_MSG,
  ZOOM_ERR_MSG,
  RATING_ERR_MSG,
  PHONE_ERR_MSG,
  SITE_ERR_MSG,
  TOO_LONG_ERR_MSG
} from "../../../constants/ErrorMessages";

import serializerToNumber from "../../../util/serializers/toNumber";
import serializerPhone from "../../../util/serializers/phone";
import serializerUrl from "../../../util/serializers/url";

import classNames from "classnames";

import marker from "./icons/marker.png";

const location = {
  lat: 0,
  lng: 0
};
const EN_LANGUAGE_ID = 2;

const ADDRESS_FIELDS = [
  'street',
  'street_number',
  'street2',
  'country',
  'region',
  'city',
  'postcode',
  'email'
];


let isCountriesSpecified = false;

const Marker = () => {
  return <img className={"cb-map-marker"} src={marker} />;
};

const NameScreen = props => {
  const {
    currencies,
    types,
    countries,
    regions,
    property,
    chanelManagers,
    languages,
    loadingSetUserProperty
  } = props;

  const t = useFormatMessage();

  const FIELDS = [
    {
      name: "name",
      label: "app.property.name.property_name",
      required: true,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    },
    {
      name: "street",
      label: "app.property.name.street",
      required: true,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 120),
      ]
    },
    {
      name: "street_number",
      label: "app.property.name.street_number",
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 120),
      ]
    },
    {
      name: "street2",
      label: "app.property.name.second_street",
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 120),
      ]
    },
    {
      name: "country",
      label: "app.property.name.country",
      placeholder: "app.common.select",
      required: true,
      validators: [requiredValidator(t({id: REQUIRED_ERR_MSG}))]
    },
    {
      name: "region",
      label: "app.property.name.region",
      placeholder: "app.common.select",
      required: true,
      validators: [requiredValidator(t({id: REQUIRED_ERR_MSG}))]
    },
    {
      name: "city",
      label: "app.property.name.city",
      required: true,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    },
    {
      name: "postcode",
      label: "app.property.name.post_code",
      required: true,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 30),
      ]
    },
    {
      name: "website",
      label: "app.property.name.property_website",
      placeholder: "https://...",
      required: true,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        siteValidator(t({id: SITE_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ],
      serialize: serializerUrl
    },
    {
      name: "phone",
      label: "app.property.name.phone_number",
      placeholder: "12345678910",
      required: true,
      unserialize: unserializerPhone,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        phoneValidator(t({id: PHONE_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 20),
      ],
      serialize: serializerPhone
    },
    {
      name: "fax",
      label: "app.property.name.fax_number",
      placeholder: "12345678911",
      unserialize: unserializerPhone,
      validators: [
        phoneValidator(t({id: PHONE_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 20),
      ],
      serialize: serializerPhone
    },
    {
      name: "email",
      label: "app.property.name.email",
      placeholder: "example@mail.com",
      required: true,
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})),
        emailValidator(t({id: EMAIL_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    },
    {
      name: "email2",
      label: "app.property.name.alternative_email_address",
      placeholder: "example@mail.com",
      validators: [
        emailValidator(t({id: EMAIL_ERR_MSG})),
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 100),
      ]
    },
    {
      name: "lat",
      label: "app.property.name.latitude",
      placeholder: "±00.0000000",
      unserialize: unserializerToNumber,
      validators: [latLngValidator(t({id: LATLNG_ERR_MSG}))],
      serialize: serializerToNumber
    },
    {
      name: "lng",
      label: "app.property.name.longitude",
      placeholder: "±00.0000000",
      unserialize: unserializerToNumber,
      validators: [latLngValidator(t({id: LATLNG_ERR_MSG}))],
      serialize: serializerToNumber
    },
    {
      name: "zoom",
      label: "app.property.name.zoom_level",
      placeholder: "app.common.select",
      options: Array.from({ length: 17 }, (v, i) => ++i).map(value => ({id: value, value})), //value 1 to 17
      validators: [zoomValidator(t({id: ZOOM_ERR_MSG}))],
      serialize: serializerToNumber,
      default: 14,
    },
    {
      name: "manager",
      label: "app.property.name.channel_manager",
      placeholder: "app.property.name.no_channel_manager",
      required: false,
      validators: [],
      default: 'no'
    },
    {
      name: "type",
      label: "app.property.name.type",
      placeholder: "app.common.select",
      validators: []
    },
    {
      name: "stars",
      label: "app.property.name.star_rating",
      placeholder: "app.common.select",
      options: Array.from({ length: 7 }, (v, i) => ++i).map(value => ({id: value, value})), //value 1 to 7
      validators: [starsValidator(t({id: RATING_ERR_MSG}))],
      serialize: serializerToNumber
    },
    {
      name: "chain_name",
      label: "app.property.name.chain_name",
      validators: [
        charLimitValidator(t({id: TOO_LONG_ERR_MSG}), 64),
      ]
    },
    {
      name: "language",
      label: "app.property.name.language",
      placeholder: "app.property.name.default",
      validators: []
    },
    {
      name: "currency",
      label: "app.property.name.currency",
      placeholder: "app.common.select",
      required: true,
      validators: [requiredValidator(t({id: REQUIRED_ERR_MSG}))]
    },
    {
      name: "billing_address",
      label: "app.property.name.use_as_billing"
    },
    {
      name: "legal_address",
      label: "app.property.name.use_as_legal"
    },
    {
      name: "show_map",
      label: "app.property.name.show_on_google_maps"
    }
  ];

  const [fields, setFields] = useState(FIELDS);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaved, setSaved] = useState(null);
  const [isDisabledNext, setDisabledNext] = useState(false);
  const [userLocation, setUserLocation] = useState(location);

  const [propertyId, setPropertyId] = useState();

  function getFieldByName(fieldName) {
    return fields.find(field => field.name === fieldName) || {};
  }

  function getFieldIndexByName(fieldName) {
    return fields.findIndex(field => field.name === fieldName);
  }

  const onPropertyChangedEffect = () => {
    if (property) {
      const values = FIELDS.reduce((values, field) => {
        return {
          ...values,
          [field.name]: field.unserialize
            ? field.unserialize(property[field.name])
            : property[field.name]
        };
      }, {});
      setValues(values);
    }

    if (property && property.id && property.id !== propertyId) {
      isCountriesSpecified = false;
      setPropertyId(property.id);
    }
  };

  const onValuesChangeEffect = () => {
    let isValid = true;

    fields.forEach(field => {
      field.validators &&
      field.validators.forEach(validator => {
        if (validator(values[field.name])) {
          isValid = false;
        }
      });
    });



    setDisabledNext(!isValid);
  };

  const onCurrenciesOrPropertyChangeEffect = () => {
    if (!fields.length) {
      return;
    }
    const currencyFieldIndex = getFieldIndexByName("currency");
    const newFields = [...fields];

    newFields[currencyFieldIndex].options = currencies.map(
      ({ name, code }) => ({
        id: code,
        value: name
      })
    );

    newFields[currencyFieldIndex].disabled = property && property.objectId != null;

    setFields(newFields);
  };

  const onTypesChangeEffect = () => {
    if (!fields.length) {
      return;
    }
    const typeFieldIndex = getFieldIndexByName("type");
    const newFields = [...fields];

    newFields[typeFieldIndex].options = types.map(({ id, name }) => ({
      id: String(id),
      value: name
    }));

    setFields(newFields);
  };

  const onChannelManagersChangeEffect = () => {
    if (!fields.length) {
      return;
    }
    const typeFieldIndex = getFieldIndexByName("manager");
    const newFields = [...fields];

    newFields[typeFieldIndex].options = [
      { id: "no", value: t({id:'app.property.name.no_channel_manager'}) },
      ...chanelManagers.map(({ value, name }) => ({
        id: value,
        value: name
      }))
    ];

    setFields(newFields);
  };

  const onLanguagesAndPropertyChangeEffect = () => {
    if (!fields.length) {
      return;
    }
    const typeFieldIndex = getFieldIndexByName("language");
    const newFields = [...fields];

    newFields[typeFieldIndex].options = languages.map(({ code, name }) => ({
      id: code,
      value: name
    }));

    newFields[typeFieldIndex].disabled = property && property.objectId != null;

    setFields(newFields);
  };

  const onRegionsChangeEffect = () => {
    if (isCountriesSpecified) {
      return;
    }

    if ((!Object.keys(values).length && !countries.length) || !regions.length) {
      return;
    }

    isCountriesSpecified = true;
    const countryFieldIndex = getFieldIndexByName("country");
    const regionFieldIndex = getFieldIndexByName("region");
    const newFields = [...fields];

    newFields[countryFieldIndex].options = countries
      .filter(country => country.language_id == EN_LANGUAGE_ID)
      .map(({ country_id, iso_3166, text }) => ({
        id: iso_3166,
        value: text
      }))
      .sort((prev, next) => (prev.value < next.value ? -1 : 1));

    const currentCountryCode = property['country'];
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
  }

  useEffect(() => {
    onPropertyChangedEffect();
  }, [property]);

  useEffect(() => {
    onValuesChangeEffect();
  }, [values]);

  useEffect(() => {
    onCurrenciesOrPropertyChangeEffect();
  }, [currencies, property]);

  useEffect(() => {
    onTypesChangeEffect();
  }, [types]);

  useEffect(() => {
    onChannelManagersChangeEffect();
  }, [chanelManagers]);

  useEffect(() => {
    onLanguagesAndPropertyChangeEffect();
  }, [languages, property]);

  useEffect(() => {
    onRegionsChangeEffect();
  }, [values, countries, regions]);

  function handleChangeSelect(fieldName, newValue) {
    const newValues = handleChange(fieldName, newValue);
    handleBlur(fieldName)({}, newValues);

    if (fieldName === 'billing_address' && newValue === true) {
      handleBillingAddress(newValues);
    }

    if (fieldName === 'legal_address' && newValue === true) {
      handleLegalAddress(newValues);
    }
  }

  function handleBlurSelect(fieldName) {
    const field = getFieldByName(fieldName);
    let validMsg = "";

    field.validators &&
    field.validators.forEach(validator => {
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

    if (["phone", "fax"].includes(fieldName)) {
      if (newValue.length > 0) {
        if (isNaN(newValue) || newValue.indexOf(' ') !== -1 || newValue.indexOf('+') !== -1) {
          return;
        }

        const matchNumber = newValue.match(/\d/g);
        newValue = matchNumber && matchNumber.length > 0 ? matchNumber.join('') : null;
      }
    }

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

  const handleBlur = fieldName => async (event, currentValues = values) => {
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

    if (fieldName === "country") {
      const regionFieldIndex = getFieldIndexByName("region");
      const newFields = [...fields];

      const currentCountryCode = currentValues["country"];

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
        region: ""
      };

      setValues(newValues);
    }

    if (! property.objectId && fieldName !== 'name') {
      return;
    }

    const response = await handleSubmit({
      objectId: property.objectId,
      propertyId: propertyId,
      fieldName,
      fieldValue: field.serialize
        ? field.serialize(currentValues[field.name])
        : currentValues[field.name]
    });

    if (property.objectId === null) {
      return response;
    }

    let consolidatedResponse = { ...currentValues, ...response };

    if (fieldName === "country") {
      await handleSubmit(
        { propertyId: propertyId,
          fieldName: "region",
          fieldValue: null,
          objectId: property.objectId
        },
        false

      ).then(responseSubmit => {
        consolidatedResponse = {...consolidatedResponse, ...responseSubmit};
      });
    }

    //if the 'use Billing Address Checkbox is checked', also update the address field on it
    if (currentValues['billing_address'] && [...ADDRESS_FIELDS, 'billing_address'].includes(fieldName)) {
      await handleBillingAddress(currentValues, false)
      .then(billingResponse => {
        consolidatedResponse = {...consolidatedResponse, ...billingResponse }
      });
    }

    //if the 'use Legal Address Checkbox is checked', also update the address field on it
    if (currentValues['legal_address'] && [...ADDRESS_FIELDS, 'legal_address'].includes(fieldName)) {
      await handleLegalAddress(currentValues, false)
      .then(legalResponse => {
        consolidatedResponse = {...consolidatedResponse, ...legalResponse }
      });
    }

    if (fieldName === 'country') {
      consolidatedResponse['region'] = null;
    }

    if (fieldName === 'billing_country') {
      consolidatedResponse['billing_region'] = null;
    }

    if (fieldName === 'legal_country') {
      consolidatedResponse['legal_region'] = null;
    }


    props.updatePropertyState({...property, ...consolidatedResponse});
  }

  const handleBillingAddress = async (currentValues, updateState = true) => {
    const objectId = property['objectId'] || (currentValues['billing_address'] && currentValues['objectId']);
    if (objectId) {
      const addressFields = {
        id: propertyId,
        objectId: objectId,
        billing_invoice_recipient: property['billing_invoice_recipient'] || '',
        billing_street: currentValues['street'],
        billing_street_number: currentValues['street_number'],
        billing_street2: currentValues['street2'],
        billing_country: currentValues['country'],
        billing_region: currentValues['region'],
        billing_city: currentValues['city'],
        billing_postcode: currentValues['postcode'],
        billing_email: currentValues['email'],
      };

      const res = await updatePropertyXML(addressFields, BILLING_ADDRESS);
      if (res.status === 'Success' && updateState) {
        props.updatePropertyState({...property, ...currentValues, ...res.result});
      }

      return {...currentValues, ...res.result};
    }

    return currentValues;

  }

  const handleLegalAddress = async (currentValues, updateState = true) => {
    const objectId = property['objectId'] || (currentValues['legal_address'] && currentValues['objectId']);

    if (objectId) {
      const addressFields = {
        id: propertyId,
        objectId: objectId,
        legal_street: currentValues['street'],
        legal_street_number: currentValues['street_number'],
        legal_street2: currentValues['street2'],
        legal_country: currentValues['country'],
        legal_region: currentValues['region'],
        legal_city: currentValues['city'],
        legal_postcode: currentValues['postcode'],
        legal_email: currentValues['email'],
      };

      const res = await updatePropertyXML(addressFields, LEGAL_ADDRESS);
      if (res.status === 'Success' && updateState) {
        props.updatePropertyState({...property, ...currentValues, ...res.result});
      }

      return {...currentValues, ...res.result};
    }

    return currentValues;
  }

  const handleSubmit = async (field, isTipShowed = true) => {
    const res = await props.updateProperty(field);
    if (res == 'Success' && isTipShowed) {
      showNotification({message:t({id:'app.common.saved'})});
      setSaved(true);
      setTimeout(() => {
        setSaved(null);
      }, 1500);
    }
    return res;
  };

  function handleClickNext() {
    if (property.objectId) {
      props.history.push("/property/billing");
      return;
    }


    profileCreate(values) //1. create the property on the external API (OTA_ProfileCreateRQ)
    .then(fieldValue => { //2. then get the returned objectId and update the property on the internal API
      return props.updateProperty({propertyId: propertyId, fieldName: "objectId", fieldValue}, false);
    })
    .then(res => {

      const valuesToUpdate = {
        ...values,
        objectId: res.objectId,
        manager: values.manager === null ? 'no' : values.manager,
        zoom: values.zoom == 0 ? 14 : values.zoom,
      };
      //3. take the remaining values to update using the OTA_HotelDescriptiveContentNotifRQ external API endpoint...
      return updatePropertyXML(valuesToUpdate, UPDATE_NAMEADDRESS)

      .then(async res =>{
        const secondaryFields = ['billing_address', 'legal_address', 'show_map', 'language'];

        const objectId = res.result.objectId;

        const secondaryFieldsPromises = secondaryFields.reduce((acc, fieldName) => {
          //4. and do the same for the other "secondary fields" related to the internal API
          if (values[fieldName]) {
            return [...acc, props.updateProperty({propertyId: propertyId, fieldName, fieldValue: values[fieldName], objectId}, false)];
          }

          return [...acc];
        }, []);

        const secondaryResultsPromises = await Promise.all(secondaryFieldsPromises);

        const reducedSecondaryFieldsResult = secondaryResultsPromises.reduce((acc, singleResult) => {
          if (singleResult) {
            //consider only the values returned from the internal API that are not null
            const validResult = Object.fromEntries(Object.entries(singleResult).filter(([key, value]) => value !== null));
            return { ...acc, ...validResult}
          }

          return acc;
        }, {});

        return {...res, result: {...res.result, ...reducedSecondaryFieldsResult}};

      })
      .then(async res => {

        //STORE BILLING ADDRESS IF THE CHECKBOX IS MARKED
        const billingRes = await handleBillingAddress(res.result);

        const consolidatedRes = {
          ...res,
          result: {
            ...res.result,
            ...billingRes
          }
        }

        if (consolidatedRes.status && consolidatedRes.status === 'Success') {
          return consolidatedRes;
        }

        return res;

      })
      .then(async res => {

        //STORE LEGAL ADDRESS IF THE CHECKBOX IS MARKED
        const legalRes = await handleLegalAddress(res.result);

        const consolidatedRes = {
          ...res,
          result: {
            ...res.result,
            ...legalRes
          }
        }

        if (consolidatedRes.status && consolidatedRes.status === 'Success') {
          return consolidatedRes;
        }

        return res;

      })
      .then(res => {

        if (res.status === "Success") {
          props.updatePropertyState({...property, ...res.result});

          showNotification({message:"Saved"});

          setSaved(true);
          setTimeout(() => {
            props.history.push("/property/billing");
            setSaved(null);
          }, 1500);

          return res.result;
        }
      });

    })
    .catch((error) => {
      console.log(error);
      showErrorMessage("Could not create profile. Please try again later.");
    });
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }

  const latValue = values["lat"];
  const lngValue = values["lng"];
  const zoomValue = values["zoom"];
  const isLngLatValid =
    latValue &&
    lngValue &&
    !latLngValidator("notValid")(latValue) &&
    !latLngValidator("notValid")(lngValue);
  const isZoomValid = zoomValue && !latLngValidator("zoom")(zoomValue);

  if (!isLngLatValid) {
    getUserLocation();
  }

  function renderFieldInput(fieldName) {
    const field = getFieldByName(fieldName);

    return (
      <PropertyInput
        name={fieldName}
        label={t({id:field.label})}
        placeholder={field.placeholder
          ? field.placeholder.indexOf('app.') === 0
            ? t({id:field.placeholder})
            : field.placeholder
          : ''}
        value={values[fieldName]}
        onChange={e => handleChange(fieldName, e.target.value)}
        onBlur={handleBlur(fieldName)}
        required={field.required}
        errorMessage={errors[fieldName]}
      />
    );
  }

  function renderFieldSelect(fieldName) {
    const field = getFieldByName(fieldName);

    return (
      <PropertySelect
        name={fieldName}
        label={t({id: field.label})}
        placeholder={field.placeholder ? t({id:field.placeholder}) : ''}
        options={field.options}
        value={values[fieldName] ? values[fieldName] : field.default || null}
        onChange={value => handleChangeSelect(fieldName, value)}
        onBlur={() => handleBlurSelect(fieldName)}
        required={field.required}
        errorMessage={errors[fieldName]}
        showArrow={field.showArrow}
        disabled={field.disabled}
      />
    );
  }

  function renderFieldCheckbox(fieldName) {
    const field = getFieldByName(fieldName);

    return (
      <Checkbox
        checked={values[fieldName]}
        onChange={e => handleChangeSelect(fieldName, e.target.checked)}
      >
        {t({id: field.label})}
      </Checkbox>
    );
  }

  return (
    <div className="cb-name-content-wrapper">
      <div className="breadcrumb-wrapper">
        <span>{t({id: 'app.property.name.name_address'})}</span>
      </div>

      <Spin spinning={loadingSetUserProperty}>
        <div className="property-form-wrapper">
          <div className="form-title-wrapper form-title-wrapper-justify">
            <span className="form-title">{t({id: 'app.property.name.address'})}</span>
            <span
              className={classNames("form-tip", {
                "form-tip-visible": isSaved
              })}
            >
              {t({id: 'app.common.saved'})}
            </span>
          </div>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("name")}</Col>
            <Col span={12}>{renderFieldInput("street")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("street_number")}</Col>
            <Col span={12}>{renderFieldInput("street2")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldSelect("country")}</Col>
            <Col span={12}>{renderFieldSelect("region")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("city")}</Col>
            <Col span={12}>{renderFieldInput("postcode")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("website")}</Col>
            <Col span={6} style={{ display: "flex", alignItems: "center" }}>
              {renderFieldCheckbox("billing_address")}
            </Col>
            <Col span={6} style={{ display: "flex", alignItems: "center" }}>
              {renderFieldCheckbox("legal_address")}
            </Col>
          </Row>
          <div className="form-title-wrapper">
            <span className="form-title">{t({id: 'app.property.name.communication'})}</span>
          </div>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("phone")}</Col>
            <Col span={12}>{renderFieldInput("fax")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("email")}</Col>
            <Col span={12}>{renderFieldInput("email2")}</Col>
          </Row>
          <div className="form-title-wrapper">
            <span className="form-title">{t({id:'app.property.name.geodata'})}</span>
          </div>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldInput("lat")}</Col>
            <Col span={12}>{renderFieldInput("lng")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldSelect("zoom")}</Col>
            <Col span={12} style={{ display: "flex", alignItems: "center" }}>
              {renderFieldCheckbox("show_map")}
            </Col>
          </Row>
          {values["show_map"] && (
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <div className="google-map" style={{ height: 200 }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyC-5iZkbbvGun93ACJAXPnn6fLFqq-agd4" }}
                    defaultCenter={location}
                    defaultZoom={14}
                    {...(isZoomValid ? { zoom: +zoomValue } : {})}
                    center={
                      isLngLatValid
                        ? { lat: +latValue, lng: +lngValue }
                        : userLocation
                    }
                  >
                    {(isLngLatValid ||
                      (userLocation.lat && userLocation.lng)) && (
                      <Marker
                        lat={isLngLatValid ? latValue : userLocation.lat}
                        lng={isLngLatValid ? lngValue : userLocation.lng}
                      />
                    )}
                  </GoogleMapReact>
                </div>
              </Col>
            </Row>
          )}
          <div className="form-title-wrapper">
            <span className="form-title">{t({id: 'app.property.name.details'})}</span>
          </div>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldSelect("manager")}</Col>
            <Col span={12}>{renderFieldSelect("type")}</Col>
          </Row>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldSelect("stars")}</Col>
            <Col span={12}>{renderFieldInput("chain_name")}</Col>
          </Row>
          <div className="form-title-wrapper">
            <span className="form-title">{t({id: 'app.property.name.default'})}</span>
          </div>
          <Row gutter={[30, 0]}>
            <Col span={12}>{renderFieldSelect("language")}</Col>
            <Col span={12}>{renderFieldSelect("currency")}</Col>
          </Row>
          <Row gutter={[20, 16]}>
            <Col span={12}></Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                disabled={isDisabledNext}
                onClick={handleClickNext}
              >
                {t({id:'app.property.name.next'})}
              </Button>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

const mapStateToProps = ({ data, property: propertyState }) => {
  const {
    currencies,
    types,
    countries,
    regions,
    chanelManagers,
    languages
  } = data;
  const { property } = propertyState;

  return {
    currencies,
    types,
    countries,
    regions,
    property,
    chanelManagers,
    languages,
    loadingSetUserProperty: propertyState.loadingSetUserProperty
  };
};

export default connect(mapStateToProps, { updateProperty, updatePropertyState })(NameScreen);
