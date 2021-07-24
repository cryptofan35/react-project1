import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import Plan from "../../pages/BillingPlan/Plan";
import Billing from "../../pages/BillingPlan/Billing";
import Invoices from "../../pages/BillingPlan/Invoices";

const BillingPlan = ({ match }) => {

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route path={`${match.url}/plan`} component={Plan} />
        <Route path={`${match.url}/billing`} component={Billing} />
        <Route path={`${match.url}/invoices`} component={Invoices} />
      </Switch>
    </div>
  )
}

export default BillingPlan;
