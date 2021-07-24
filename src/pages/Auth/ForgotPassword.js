import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { userForgot } from "../../appRedux/actions/Auth";
import AuthLayout from "../../containers/Auth/AuthLayout";
import { useFormatMessage } from 'react-intl-hooks';

const ForgotPassword = (props) => {

  const [emailDanger, setEmailDanger] = useState(0)
  const [emailValidationMessage, setEmailValidation] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const t = useFormatMessage();

  const handleSubmit = async () => {
    const isValid = validate()
    if (isValid) {
      let status = await props.userForgot({ email: emailValue.trim() })
      if (status == 1) {
        setEmailDanger(true)
        setEmailValidation(t({id: 'app.forgot_password.email_does_not_exist'}))
      }

      if (status === undefined) {
        props.history.push('/signin');
      }
    }
  };

  const validate = () => {
    if (!emailValue) {
      setEmailDanger(true)
      setEmailValidation(t({id: 'app.common.field_is_required'}))
      return false
    } else {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(emailValue).toLowerCase())) {
        setEmailDanger(true)
        setEmailValidation(t({id: 'app.common.wrong_email_format'}))
        return false
      }
    }
    return true
  }

  return (
    <AuthLayout {...props}>
      <div className="cb-login-content">
        <div className="cb-login-header">
          <span>{t({id: 'app.forgot_password.forgot_password'})}</span>
          <div className="cb-login-header-require-text">{t({id: 'app.forgot_password.enter_your_email'})}</div>
        </div>
        <div name="cb-signup" className="cb-login-form-container" initialValues={{ email: '' }}>
          <div className={"cb-login-form-input " + (emailDanger ? 'is-danger' : '')}>
            <Input placeholder={t({id: 'app.forgot_password.email'})} onChange={(e) => { setEmailValue(e.target.value); setEmailDanger(false) }} onPressEnter={handleSubmit} />
            {emailDanger === true && <span className="cb-require">{emailValidationMessage}</span>}
          </div>

          <div className="cb-login-form-button-container">
            <Button type="primary" className="cb-login-form-button" onClick={handleSubmit}>{t({id: 'app.forgot_password.request'})}</Button>
          </div>
          <div className="cb-login-form-bottom-container">{t({id: 'app.forgot_password.do_not_have_account'}, {signup_link: <Link to="/signup">{t({id: 'app.forgot_password.signup'})}</Link>})}</div>
        </div>
      </div>
    </AuthLayout>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token }
};

export default connect(mapStateToProps, { userForgot })(ForgotPassword);
