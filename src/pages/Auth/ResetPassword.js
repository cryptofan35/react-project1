import React, { useState, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { connect } from "react-redux";
import { requestForResetPassword, changePassword } from "../../appRedux/actions/Auth";
import AuthLayout from "../../containers/Auth/AuthLayout";
import { useFormatMessage } from 'react-intl-hooks';

const ResetPassword = (props) => {

  const [passDanger, setPassDanger] = useState(0)
  const [passValidationMessage, setPassValidation] = useState('')
  const [passValue, setPassValue] = useState('')
  const t = useFormatMessage();

  useEffect(() => {
    props.requestForResetPassword(props.match.params.token)
    .catch(() => props.history.push('/signin'))
  }, [])

  const validate = () => {
    if (!passValue) {
      setPassDanger(true);
      setPassValidation(t({id: 'app.common.field_is_required'}))
      return false
    } else {
      const re = new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (!re.test(String(passValue))) {
        setPassValidation(t({id: 'app.reset_password.password_rule'}));
        setPassDanger(true);
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    const isValid = validate();
    if (isValid) {
      props.changePassword(passValue, props.match.params.token).then(() => {props.history.push('/signin')})
    }
  };

  return (
    <AuthLayout {...props}>
      <div className="cb-login-content">
        <div className="cb-login-header">
          <span>{t({id: 'app.reset_password.reset_password'})}</span>
          <div className="cb-login-header-require-text">{t({id: 'app.reset_password.type_and_confirm'})}</div>
        </div>
        <div name="cb-signup" className="cb-login-form-container" >
          <div className={"cb-login-form-input " + (passDanger ? 'is-danger' : '')}>
            <Input 
              type="password" 
              placeholder={t({id: 'app.reset_password.password'})} 
              onChange={(e) => { setPassValue(e.target.value); setPassDanger(false) }} 
              onPressEnter={handleSubmit} 
            />
            {passDanger === true && <span className="cb-require">{passValidationMessage}</span>}
          </div>

          <div className="cb-login-form-button-container">
            <Button type="primary" className="cb-login-form-button" onClick={handleSubmit}>{t({id: 'app.reset_password.reset'})}</Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

const mapStateToProps = ({ commonData }) => {
  const { error, message } = commonData;
  return { error, message }
};

export default connect(mapStateToProps, { requestForResetPassword, changePassword })(ResetPassword);
