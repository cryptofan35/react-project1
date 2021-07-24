import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { userSignOut, resendEmail } from "../../appRedux/actions/Auth";
import AuthLayout from "../../containers/Auth/AuthLayout"
import { useFormatMessage } from 'react-intl-hooks';

import email_img from '../../assets/images/email.png'

const VerifyEmail = (props) => {
  const [email, setEmail] = useState('john.smith@gmail.com');
  const t = useFormatMessage();

  useEffect(() => {
    if (props.token === null) {
      props.history.push('/signin');
    } else {
      if (props.user.email_verified_at)
        props.history.push('/property/add')
        // props.history.push('/dashboard')
      else
        setEmail(props.user.email)
    }
  }, [])

  const handleBack = async () => {
    await props.userSignOut()
    props.history.push('/signin')
  }

  const handleResend = async () => {
    await props.resendEmail(props.user)
  }

  return (
    <AuthLayout {...props}>
      <div className="cb-verify-email-container">
        <div className="cb-verify-email-title">{t({id: 'app.verify.verify_email_address'})}</div>
        <div className="cb-verify-email-subtitle" dangerouslySetInnerHTML={{__html: t({id: 'app.verify.verify_info'})}} />
        <div className="cb-verify-email-iamge-container">
          <img src={email_img} alt="email" />
        </div>
        <div className="cb-verify-email-content">{t({id: 'app.verify.email_sent'}, {email: <span className="email">{email}</span>})}</div>
        <div className="cb-verify-email-button-container">
          <Button type="primary" ghost onClick={handleBack}>{t({id: 'app.common.back'})}</Button>
          <Button type="primary" onClick={handleResend} >{t({id: 'app.verify.resend_email'})}</Button>
        </div>

      </div>
    </AuthLayout>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token, user } = auth;
  return { token, user }
};

export default connect(mapStateToProps, { userSignOut, resendEmail })(VerifyEmail);
