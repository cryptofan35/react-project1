import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "antd";
import { useFormatMessage } from 'react-intl-hooks';


import CustomInput from "./../../components/CustomInput";
import CustomSelect from "./../../components/CustomSelect";

import { INFORMING_SAVED_CHANGE } from "../../constants/TimeConstants";
import {
  REQUIRED_ERR_MSG,
  PASSWORD_ERR_MSG,
  EMAIL_ERR_MSG,
  LANGUAGE_ERR_MSG,
  WRONG_PASSWORD,
} from "./../../constants/ErrorMessages";

import axios from 'util/Api';
import {
  requiredValidator,
  emailValidator,
  correctPwdValidator,
  newPwdValidator,
} from "./../../util/Validators";
import {
  updateUserInDB,
  updateUserPassword,
  updateUserLng,
} from "./../../appRedux/actions/UserProfile";
import { UPDATE_USER_DATA, UPDATE_USER_PASSWORD, UPDATE_USER_DEFAULT_LANGUAGE } from './../../constants/ActionTypes';
const dataLabel = 'data-label';

const getCurProp = obj => key => obj[key] || null;
const checkObj = obj => {
  for (let value of Object.values(obj)) {
    if (!value) return null;
  }

  return obj;
}
const dispatchHelper = dispatchers => getter => vldt => arg => marker => {
  const dispatcher = getter(dispatchers)(marker);
  const data = getter(arg)(marker);
  if (!(vldt({ dispatcher }))) return null;
  return dispatcher(data);
}
const checkForErrors = (obj, fieldName) => {
  const fieldsWithError = [];

  for (let [key, val] of Object.entries(obj)) {
    if (val['errMsg'] && !!val['errMsg']) fieldsWithError.push(key);
  }

  if (fieldName && fieldsWithError.join() === fieldName) return false;

  if (!!fieldsWithError.length) {
    return true;
  }

  return false;
};

let marker = '';

const Profile = ({ user, languages, updateUserInDB, updateUserPassword, updateUserLng, language_id }) => {
  const { ...userArgs } = user;
  const t = useFormatMessage();

  const defaultFieldsProperties = {
    last_name: {
      name: "last_name",
      label: "app.profile.last_name",
      required: true,
      tabIndex: 1,
      validators: [requiredValidator(t({id: REQUIRED_ERR_MSG}))],
      [dataLabel]: UPDATE_USER_DATA
    },
    name: {
      name: "name",
      label: "app.profile.first_name",
      required: true,
      tabIndex: 2,
      validators: [requiredValidator(t({id: REQUIRED_ERR_MSG}))],
      [dataLabel]: UPDATE_USER_DATA
    },
    email: {
      name: "email",
      label: "app.profile.email",
      required: true,
      tabIndex: 3,
      placeholder: "example@mail.com",
      validators: [
        requiredValidator(t({id: REQUIRED_ERR_MSG})), emailValidator(t({id: EMAIL_ERR_MSG})),
      ],
      [dataLabel]: UPDATE_USER_DATA
    },
    language: {
      name: "language",
      label: "app.profile.language",
      required: true,
      tabIndex: 4,
      validators: [requiredValidator(t({id: LANGUAGE_ERR_MSG}))],
      [dataLabel]: UPDATE_USER_DEFAULT_LANGUAGE
    },
    "current-password": {
      name: "current-password",
      label: "app.profile.current_password",
      required: true,
      tabIndex: 5,
      validators: [correctPwdValidator(t({id: REQUIRED_ERR_MSG}), t({id: WRONG_PASSWORD}))],
      [dataLabel]: UPDATE_USER_PASSWORD,
      type: 'password'
    },
    "new-password": {
      name: "new-password",
      label: "app.profile.new_password",
      required: true,
      tabIndex: 6,
      validators: [newPwdValidator(t({id: REQUIRED_ERR_MSG}), t({id: PASSWORD_ERR_MSG}))],
      type: 'password'
    },
    saveBtn: {
      name: "saveBtn",
      type: "primary",
      tabIndex: 7,
      [dataLabel]: UPDATE_USER_PASSWORD,
    }
  };

  const [fieldsProperties, setFieldsProperties] = useState(
    defaultFieldsProperties
  );
  const [currentUserData, changeCurrentUserData] = useState({ ...userArgs });

  const [userLng, setUserLng] = useState(language_id);
  const [isPasswordNeedChange, passwordNeedChange] = useState(false);
  const [changedPassword, setChangedPassword] = useState({
    "current-password": "",
    "new-password": ""
  });
  const [changesSaved, setChangesSaved] = useState(false);
  const [initValue, setInitValue] = useState('');

  const dispatchers = {
    [UPDATE_USER_DATA]: updateUserInDB,
    [UPDATE_USER_PASSWORD]: updateUserPassword,
    [UPDATE_USER_DEFAULT_LANGUAGE]: updateUserLng,
  }
  const startDispatch = dispatchHelper(dispatchers)(getCurProp)(checkObj);

  const getFieldProperties = getCurProp(fieldsProperties);
  const getTranslatedFieldProperties = fieldName => {
    const fieldProperties = getFieldProperties(fieldName);
    return {
      ...fieldProperties,
      label: fieldProperties.label ? t({id: fieldProperties.label}) : ''
    }
  }
  
  const dataToDispatch = {
    [UPDATE_USER_DATA]: { ...currentUserData },
    [UPDATE_USER_PASSWORD]: { id: currentUserData.id, ...changedPassword },
    [UPDATE_USER_DEFAULT_LANGUAGE]: { id: currentUserData.id, language_id: userLng }
  };;
  let areHaveErrors = false;

  useEffect(() => {
    const { name, last_name, email } = currentUserData;

    setFieldsProperties(prevState => ({
      ...prevState,
      'last_name': addDefaultFieldProperty("last_name", "value", last_name),
      name: addDefaultFieldProperty("name", "value", name),
      email: addDefaultFieldProperty('email', 'value', email),
    }));
  }, [currentUserData]);

  useEffect(() => {
    setFieldsProperties(prevState => ({
      ...prevState,
      language: setDefaultLngOptions(userLng)
    }));
  }, [userLng, languages])

  useEffect(() => {
    startDispatch(dataToDispatch)(marker);
  }, [userLng]);

  useEffect(() => {

    if (changesSaved) {
      setTimeout(() => setChangesSaved(false), INFORMING_SAVED_CHANGE);
    }
  }, [changedPassword, changesSaved, fieldsProperties]);

  const addDefaultFieldProperty = (fieldName, propertyName, propertyValue) => {
    const field = getFieldProperties(fieldName);
    return { ...field, [propertyName]: propertyValue };
  };

  const setDefaultLngOptions = userLng => {
    const lngField = getFieldProperties("language");

    const options = languages.map(el => {
      const { code: key, name: value } = el;
      return key === userLng ? { key, value, defaultValue: true } : { key, value };
    }
    );

    return { ...lngField, options };
  };

  const componentValidator = (field, name, value) => {
    let errMsg = "";

    field.validators &&
      field.validators.forEach(validator => {
        errMsg = validator(value);
      });

    setFieldsProperties({
      ...fieldsProperties,
      [name]: { ...field, errMsg }
    });

    return errMsg ? false : true;
  }

  const onHandleChangeUserData = e => {
    const { name, value } = e.target;
    changeCurrentUserData({
      ...currentUserData,
      [name]: value
    })
  };

  const onFocus = e => {
    setInitValue(e.target.value)
  }

  const onBlur = e => {
    const { name, value } = e.target;

    const currentField = getFieldProperties(name);
    marker = currentField[dataLabel];
    const vldtResult = componentValidator(currentField, name, value);

    if (value === initValue) return;

    if (vldtResult) {
      startDispatch({
        [marker]: {
          id: currentUserData.id,
          [name]: value,
        }
      })(marker)
      setChangesSaved(true);
    }
  };

  const onBlurPwdField = e => {
    const { name, value } = e.target;
    const currentField = getFieldProperties(name);
    componentValidator(currentField, name, value);

    areHaveErrors = checkForErrors(fieldsProperties, name);
  }

  const onBlurCurrPwd = async e => {
    const { name, value } = e.target;
    const currentField = getFieldProperties(name);
    const data = getCurProp(dataToDispatch)(UPDATE_USER_PASSWORD);
    if (value === '') {
      onBlurPwdField(e);
      return;
    }
    onBlurPwdField(e);
    axios.post("profile/checkPassword", {
      ...data,
    })
      .then((res) => {
        onBlurPwdField(e);
      })
      .catch(({ message }) => {
        componentValidator(currentField, name, message);
        areHaveErrors = checkForErrors(fieldsProperties, name);
      })
  }

  const onChangeLng = (...args) => {
    const [, { key }] = args;
    marker = UPDATE_USER_DEFAULT_LANGUAGE;
    setUserLng(key);
    setChangesSaved(true);
  };

  const handleChangePassword = e => {
    const { name, value } = e.target;
    areHaveErrors = checkForErrors(fieldsProperties, name);
    setChangedPassword(prevPassword => ({
      ...prevPassword,
      [name]: value
    }));
  };

  const onSavePwdClick = async e => {
    let vldtCurrPwdResult;
    const { name } = e.currentTarget;
    const marker = getFieldProperties(name)[dataLabel];
    vldtCurrPwdResult = componentValidator(getFieldProperties('current-password'), 'current-password', changedPassword["current-password"]);

    if (vldtCurrPwdResult) {
      const data = getCurProp(dataToDispatch)(UPDATE_USER_PASSWORD);
      await axios.post("profile/checkPassword", {
        ...data,
      })
        .then((res) => {
          vldtCurrPwdResult = true;
        })
        .catch(({ message }) => {
          vldtCurrPwdResult = componentValidator(getFieldProperties('current-password'), 'current-password', message);
          areHaveErrors = checkForErrors(fieldsProperties, 'current-password');
        })
    }


    if (vldtCurrPwdResult) {
      const vldtNewPwdResult = componentValidator(getFieldProperties('new-password'), 'new-password', changedPassword["new-password"]);
      if (vldtNewPwdResult) {
        passwordNeedChange(false);
        startDispatch(dataToDispatch)(marker);
        setChangesSaved(true);
      }
    }
  }

  return (
    <div className="cb-name-content-wrapper">
      <div className="breadcrumb-wrapper">
        <span>{t({id: 'app.profile.my_profile'})}</span>
      </div>

      <div
        className="property-form-wrapper"
        style={{ minHeight: "562px", paddingBottom: "0px" }}
      >
        <div className="form-title-wrapper" >
          <Row gutter={[30, 0]}>
            <Col span={12}>
              <span className="form-title">{t({id: 'app.profile.user_data'})}</span>
            </Col>
            <Col
              span={12}
              style={{
                textAlign: "right",
                height: "17px",
                width: "40px",
                color: "#A3A3A3",
                fontFamily: "Poppins",
                fontSize: "12px",
                letterSpacing: "0",
                lineHeight: "18px"
              }}
            >
              {changesSaved && <span>{t({id: 'app.common.saved'})}</span>}
            </Col>
          </Row>
        </div>
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <CustomInput
              {...getTranslatedFieldProperties("last_name")}
              onFocus={onFocus}
              onChange={onHandleChangeUserData}
              onBlur={onBlur}
            />
          </Col>
          <Col span={12}>
            <CustomInput
              {...getTranslatedFieldProperties("name")}
              onFocus={onFocus}
              onChange={onHandleChangeUserData}
              onBlur={onBlur}
            />
          </Col>
        </Row>
        <Row gutter={[30, 0]} style={{ marginBottom: "30px" }}>
          <Col span={12}>
            <CustomInput
              {...getTranslatedFieldProperties("email")}
              onFocus={onFocus}
              onChange={onHandleChangeUserData}
              onBlur={onBlur}
              disabled
            />
          </Col>
          <Col span={12}>
            <CustomSelect
              {...getTranslatedFieldProperties("language")}
              onChange={(...args) => onChangeLng(...args)}
            />
          </Col>
        </Row>
        <div className="form-title-wrapper" style={{ marginBottom: "5px" }}>
          {!isPasswordNeedChange ? (
            <Button type="primary" onClick={() => passwordNeedChange(true)}>
              {t({id: 'app.profile.change_password'})}
            </Button>
          ) : (
              <>
                <div className="form-title-wrapper">
                  <span className="form-title">{t({id: 'app.profile.password'})}</span>
                </div>
                <Row gutter={[30, 0]} style={{ marginBottom: "54px" }}>
                  <Col span={12}>
                    <CustomInput
                      {...getTranslatedFieldProperties("current-password")}
                      onChange={handleChangePassword}
                      onBlur={onBlurCurrPwd}
                    />
                  </Col>
                  <Col span={12}>
                    <CustomInput
                      {...getTranslatedFieldProperties("new-password")}
                      onChange={handleChangePassword}
                      onBlur={onBlurPwdField}
                    />
                  </Col>
                </Row>
                <Row gutter={[30, 0]}>
                  <Col span={12}></Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Button
                      {...fieldsProperties['saveBtn']}
                      onClick={onSavePwdClick}
                    >
                      {t({id: 'app.profile.save_password'})}
                    </Button>
                  </Col>
                </Row>
              </>
            )}
        </div>
      </div>
    </div >
  );
};

const mapStateToProps = ({ auth, data, settings }) => {
  const { user } = auth;
  const { languages } = data;
  const { 
    locale: {
      languageId
    } 
  } = settings
  return { user, languages, language_id: languageId };
};

export default connect(mapStateToProps, { updateUserInDB, updateUserPassword, updateUserLng })(Profile);
