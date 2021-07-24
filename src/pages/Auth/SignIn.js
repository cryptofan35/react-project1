import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { Button, Checkbox, Input, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AuthLayout from "../../containers/Auth/AuthLayout";
import { userSignIn } from "../../appRedux/actions/Auth";
import { hideMessage } from "../../appRedux/actions/Common";
import { switchLanguage } from "appRedux/actions/Settings";
import queryString from 'query-string';
import { useFormatMessage } from 'react-intl-hooks';

import success_img from "../../assets/images/success-notification.png";
import warn_img from "../../assets/images/warn-notification.png";
import { getInitialAppData } from "../../appRedux/actions/Global";
import axios from "../../util/Api";

const Signin = props => {
  const [passDanger, setPassDanger] = useState(0);
  const [emailDanger, setEmailDanger] = useState(0);
  const [emailValidationMessage, setEmailValidation] = useState("");
  const [passValidationMessage, setPassValidation] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const t = useFormatMessage();

  useEffect(() => {
    if (props.token !== null) {
      props.history.push("/verify-email");
    }
    if (props.error)
      message.error({
        icon: (
          <img
            src={warn_img}
            style={{ width: 17, marginRight: 5 }}
            alt="success"
          />
        ),
        content: props.error,
        style: {
          color: "#7A7F93",
          fontSize: "12px",
          fontFamily: "Poppins",
          fontWeight: 500
        }
      });

    if (props.message)
      message.success({
        icon: (
          <img
            src={success_img}
            style={{ width: 17, marginRight: 5 }}
            alt="success"
          />
        ),
        content: t({id: props.message}),
        style: {
          color: "#1D577B",
          fontSize: "12px",
          fontFamily: "Poppins",
          fontWeight: 500
        }
      });

    props.hideMessage();

    const query = queryString.parse(props.location.search);
    if (query.lang) {
      props.switchLanguage(query.lang);
    }

  }, []);

  useEffect(() => {
    if (props.user) {
      if (props.user.email_verified_at) {
        props.getInitialAppData();
        props.history.push("/dashboard");
      } else {
        props.history.push("/verify-email");
      }
    }
  }, [props.user]);

  const handleSubmit = async () => {
    const isValid = validate();

    if (isValid) {
      let status = await props.userSignIn({
        email: emailValue.trim(),
        password: passValue
      });
      if (status == 1) {
        setEmailDanger(true);
        setEmailValidation(t({id: 'app.signin.email_does_not_exist'}));
      } else if (status == 2) {
        setPassDanger(true);
        setPassValidation(t({id: 'app.signin.wrong_password'}));
      }
    }
  };

  const validate = () => {
    let flag = true;
    if (!emailValue) {
      setEmailDanger(true);
      setEmailValidation(t({id: 'app.common.field_is_required'}));
      flag = false;
    } else {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(emailValue).toLowerCase())) {
        setEmailDanger(true);
        setEmailValidation(t({id: 'app.common.wrong_email_format'}));
        flag = false;
      }
    }

    if (!passValue) {
      setPassDanger(true);
      setPassValidation(t({id: 'app.common.field_is_required'}));
      flag = false;
    }

    if (flag) return true;
    else return false;
  };

  function renderBlockedAccountError() {
    const { error } = props;
    if (error && error.data && error.data.code === "ACCOUNT_BLOCKED") {
      return (
        <div
          style={{
            display: "flex",
            color: "#005C81",
            marginBottom: "3rem",
            fontSize: "14px",
            alignItems: "center"
          }}
        >
          <InfoCircleOutlined style={{ marginBottom: "13px" }} />
          <p style={{ marginLeft: "0.75rem" }}>{t({id: 'app.signin.account_blocked'})}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <AuthLayout {...props}>
      <div className="cb-login-content">
        {renderBlockedAccountError()}
        <div className="cb-login-header">
          <span>{t({id: 'app.signin.signin'})}</span>
        </div>
        <div name="cb-signin" className="cb-login-form-container">
          <div
            className={
              "cb-login-form-input " + (emailDanger ? "is-danger" : "")
            }
          >
            <Input
              placeholder={t({id: 'app.signin.email'})}
              onChange={e => {
                setEmailValue(e.target.value);
                setEmailDanger(false);
              }}
              onPressEnter={handleSubmit}
            />
            {emailDanger === true && (
              <span className="cb-require">{emailValidationMessage}</span>
            )}
          </div>
          <div
            className={"cb-login-form-input " + (passDanger ? "is-danger" : "")}
          >
            <Input
              type="password"
              placeholder={t({id: 'app.signin.password'})}
              onPressEnter={handleSubmit}
              onChange={e => {
                setPassValue(e.target.value);
                setPassDanger(false);
              }}
            />
            {passDanger === true && (
              <span className="cb-require">{passValidationMessage}</span>
            )}
          </div>
          <div className="cb-login-form-remember-forgot">
            {/* <div name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </div> */}
            <span style={{ flexGrow: 1 }}></span>
            <Link
              to="/forgot-password"
              className="cb-login-form-forgot cb-link"
            >
              {" "}
              {t({id: 'app.signin.forgot_password'})}
            </Link>
          </div>

          <div className="cb-login-form-button-container">
            <Button
              type="primary"
              className="cb-login-form-button"
              onClick={handleSubmit}
            >
              {t({id: 'app.signin.signin'})}
            </Button>
          </div>
          <div className="cb-login-form-bottom-container">
            {t({id:'app.signin.do_not_have_account'}, {signup_link: <Link to="/signup">{t({id: 'app.signin.signup'})}</Link>})}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

const mapStateToProps = ({ auth, commonData }) => {
  const { token, user } = auth;
  const { message, error } = commonData;
  return { token, user, message, error };
};

const mapDispatchToProps = {
  userSignIn,
  hideMessage,
  getInitialAppData,
  switchLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signin));
