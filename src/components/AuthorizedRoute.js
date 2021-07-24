import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import hasAccess from "../util/hasAccess";

function AuthorizedRoute({
  redirectTo,
  allowedRoles,
  roleName,
  component: Component,
  token,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={props =>
        hasAccess(allowedRoles, roleName) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: redirectTo || "/dashboard",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

const mapStateToProps = ({ auth }) => ({
  roleName: auth.user.role.name
});

export default connect(mapStateToProps)(AuthorizedRoute);
