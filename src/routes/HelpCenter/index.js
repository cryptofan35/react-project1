import HelpCenterPage from "pages/HelpCenter/index";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const HelpCenterRoute = ({ match }) => {
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path={`${match.url}/`} component={HelpCenterPage} />
      </Switch>
    </div>
  );
};

export default HelpCenterRoute;
