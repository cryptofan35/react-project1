import React from "react";
import logo from "../../assets/images/cultbat-logo.png"

const AuthLayout = props => {
  return (
    <div className="cb-auth-container">
      <div className="cb-app-logo-container">
        <img src={logo} alt="logo" />
      </div>
      {props.children}
    </div>
  )
}

export default AuthLayout;

