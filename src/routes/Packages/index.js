

import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import TemplatesPage from 'pages/Packages/Templates';
import NewPackagePage from 'pages/Packages/NewPackage';
import EditPackagePage from 'pages/Packages/EditPackagePage';
import OffersPage from 'pages/Packages/Offers';
import PlaceOfferPage from 'pages/Packages/PlaceOffer';

const PackagesRoutes = ({ match }) => {
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path={`${match.url}/templates`} component={TemplatesPage} />
        <Route exact path={`${match.url}/offers`} component={OffersPage} />
        <Route exact path={`${match.url}/new`} component={NewPackagePage} />
        <Route exact path={`${match.url}/edit`} component={EditPackagePage} />
        <Route exact path={`${match.url}/place-offer`} component={PlaceOfferPage} />
      </Switch>
    </div>
  );
};

export default PackagesRoutes;
