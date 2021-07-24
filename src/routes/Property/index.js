import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Add from "../../pages/Property/Add"
import Name from "../../pages/Property/Name"
import Billing from "../../pages/Property/Billing"
import Legal from "../../pages/Property/Legal"
import Description from "../../pages/Property/Description"
import Pictures from "../../pages/Property/Pictures"
import Amenities from "../../pages/Property/Amenities"
import ImportData from "../../pages/Property/ImportData"

const Property = ({ match }) => {

  if (match.isExact) {
    return (<Redirect to={'/property/name'} />)
  }

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route path={`${match.url}/name`} component={Name} />
        <Route path={`${match.url}/billing`} component={Billing} />
        <Route path={`${match.url}/legal`} component={Legal} />
        <Route path={`${match.url}/description`} component={Description} />
        <Route path={`${match.url}/pictures`} component={Pictures} />
        <Route path={`${match.url}/amenities`} component={Amenities} />
        <Route path={`${match.url}/import`} component={ImportData} />
        <Route path={`${match.url}/add`} component={Add} />
      </Switch>
    </div>
  )
};

export default Property;
