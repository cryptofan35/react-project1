import React, { Component } from "react";
import { connect } from "react-redux";
import hasAccess from "../util/hasAccess";
import roleNames from "../util/roleNames";

export const CanAccess = ({ children, roleName, roleNames }) => {
  if (!hasAccess(roleNames, roleName)) {
    return null;
  }
  return children;
};

const mapStateToProps = ({ auth }) => ({
  roleName: auth.user.role.name
});

export default connect(mapStateToProps)(CanAccess);
