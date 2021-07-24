import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userSignUp } from "../../appRedux/actions/Auth";
import AuthLayout from "../../containers/Auth/AuthLayout";
import { useFormatMessage } from 'react-intl-hooks';
import { switchLanguage } from "appRedux/actions/Settings";
import queryString from 'query-string';


const Signup = (props) => {

  const [nameDanger, setNameDanger] = useState(0)
  const [passDanger, setPassDanger] = useState(0)
  const [emailDanger, setEmailDanger] = useState(0)
  const [checkDanger, setCheckDanger] = useState(0)
  const [nameValidationMessage, setNameValidation] = useState('')
  const [emailValidationMessage, setEmailValidation] = useState('')
  const [passValidationMessage, setPassValidation] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passValue, setPassValue] = useState('')
  const [isCheck, setCheck] = useState(false)
  const t = useFormatMessage();

  useEffect(() => {
    if (props.token !== null) {
      props.history.push('/verify-email');
    }
  }, [props.token]);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    if (query.lang) {
      props.switchLanguage(query.lang);
    }
  }, [])

  const handleSubmit = async () => {
    const isValid = validate()

    if (isValid) {
      let status = await props.userSignUp({ name: nameValue.trim(), email: emailValue.trim(), password: passValue })
      if (status == 1) {
        setEmailDanger(true)
        setEmailValidation(t({id: 'app.signup.email_already_used'}))
      }
    }
  }

  const validate = () => {
    let flag = true
    if (!nameValue) {
      setNameDanger(true)
      setNameValidation(t({id: 'app.common.field_is_required'}))
      flag = false
    } else {
      if (!nameValue.trim()) {
        setNameDanger(true)
        setNameValidation(t({id: 'app.common.field_is_required'}))
        setNameValue('')
        flag = false
      }
    }

    if (!emailValue) {
      setEmailDanger(true)
      setEmailValidation(t({id: 'app.common.field_is_required'}))
      flag = false
    } else {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(emailValue).toLowerCase())) {
        setEmailDanger(true)
        setEmailValidation(t({id: 'app.common.wrong_email_format'}))
        flag = false
      }
    }

    if (!passValue) {
      setPassDanger(true)
      setPassValidation(t({id: 'app.common.field_is_required'}))
      flag = false
    } else {
      const re = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (!re.test(String(passValue))) {
        setPassDanger(true)
        setPassValidation(t({id: 'app.signup.password_rule'}))
        flag = false
      }
    }

    if (!isCheck) {
      setCheckDanger(true)
      flag = false
    }
    if (flag)
      return true
    else
      return false
  }

  return (
    <AuthLayout {...props}>
      <div className="cb-login-content">
        <div className="cb-login-header">
            <span>{t({id: 'app.signup.signup'})}</span>
            <div className="cb-login-header-require-text">{t({id: 'app.signup.try_cultbay'})}</div>
        </div>
        <div name="cb-signup" className="cb-login-form-container">
          <div className={"cb-login-form-input " + (nameDanger ? 'is-danger' : '')}>
            <Input placeholder={t({id: 'app.signup.name'})} onChange={(e) => { setNameValue(e.target.value); setNameDanger(false) }} onPressEnter={handleSubmit} value={nameValue} />
            {nameDanger === true && <span className="cb-require">{nameValidationMessage}</span>}
          </div>
          <div className={"cb-login-form-input " + (emailDanger ? 'is-danger' : '')}>
            <Input placeholder={t({id: 'app.signup.email'})} onChange={(e) => { setEmailValue(e.target.value); setEmailDanger(false) }} onPressEnter={handleSubmit} />
            {emailDanger === true && <span className="cb-require">{emailValidationMessage}</span>}
          </div>
          <div className={"cb-login-form-input " + (passDanger ? 'is-danger' : '')}>
            <Input type="password" placeholder={t({id: 'app.signup.password'})} onChange={(e) => { setPassValue(e.target.value); setPassDanger(false) }} onPressEnter={handleSubmit} />
            {passDanger === true && <span className="cb-require">{passValidationMessage}</span>}
          </div>
          <div className={"cb-login-form-remember-forgot " + (checkDanger ? 'is-danger' : '')}>
            <Checkbox onChange={(e) => { setCheck(e.target.checked); setCheckDanger(false) }}>{t({id: 'app.signup.accept_privacy_policy'}, {link: <a href={`https://cultbay.com/legal-notice/?lang=${props.locale.locale}`} target="_blank" rel="noopener noreferrer">{t({id: 'app.signup.privacy_policy'})}</a>})}</Checkbox>
          </div>

          <div className="cb-login-form-button-container">
            <Button type="primary" className="cb-signup-button" onClick={handleSubmit}>{t({id: 'app.signup.create_account'})}</Button>
          </div>
          <div className="cb-login-form-bottom-container">{t({id: 'app.signup.already_have_an_account'}, {signin_link: <Link to="/signin">{t({id: 'app.signup.signin'})}</Link>})}</div>
        </div>
      </div>
    </AuthLayout>
  );
};

const mapStateToProps = ({ auth, settings }) => {
  const { token } = auth;
  const { locale } = settings;
  return { token, locale }
};

const mapDispatchToProps = {
  userSignUp,
  switchLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
