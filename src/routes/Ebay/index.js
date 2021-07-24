import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import EbaySettings from "../../pages/Ebay/Settings";
import FAQPage from "../../pages/Ebay/FAQ";
import EbayMessages from "../../pages/Ebay/Messages";
import EbayArchive from "../../pages/Ebay/Archive";

const EbayRoutes = ({ match }) => {
  
  if (match.isExact) {
    return (<Redirect to={'/ebay/settings'} />)
  }
  
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route path={`${match.url}/settings`} component={EbaySettings} />
        <Route path={`${match.url}/faq`} component={FAQPage} />
        <Route path={`${match.url}/messages`} component={EbayMessages} />
        <Route path={`${match.url}/mailArchive`} component={EbayArchive} />
      </Switch>
    </div>
  )
};


export default EbayRoutes;
