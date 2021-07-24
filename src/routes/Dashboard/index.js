import React from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { userSignOut } from "../../appRedux/actions/Auth";
import Dashboard from "../../pages/Dashboard";

const DashboardRoutes = props => {
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path={`${props.match.url}/`} component={Dashboard} />
      </Switch>
    </div>
  )
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token }
};

export default connect(mapStateToProps, { userSignOut })(DashboardRoutes);
