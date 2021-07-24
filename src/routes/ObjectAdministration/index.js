import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ObjectAdministration from "../../pages/ObjectAdministration";

const ObjectAdministrationRoutes = ({ match }) => {
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path={`${match.url}/`} component={ObjectAdministration} />
      </Switch>
    </div>
  );
};

export default ObjectAdministrationRoutes;
