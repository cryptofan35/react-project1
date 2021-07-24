import React from "react";
import { Route, Switch } from "react-router-dom";

import Packages from "./Packages";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Property from "./Property";
import Pictures from "./Pictures";
import Profile from "./../pages/Profile";
import Rooms from "./Rooms";
import UserAdministration from "./UserAdministration";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import AuthorizedRoute from "../components/AuthorizedRoute";
import roleNames from "../util/roleNames";
// import asyncComponent from "../util/asyncComponent";
import Calendars from "./Calendars";
import EbayRoutes from "./Ebay";
import VoucherRoutes from "./Voucher";
import ObjectAdministrationRoutes from "./ObjectAdministration";
import UploadTemplateRoute from "./UploadTemplate";
import HelpCenter from "./HelpCenter";
import BillingPlan from "./BillingPlan";

const App = ({ match: { url } }) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <AuthorizedRoute path={`${url}dashboard`} component={Dashboard} />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}property`}
        component={Property}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}rooms`}
        component={() => <Rooms />}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}packages`}
        component={Packages}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}calendars`}
        component={Calendars}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}ebay`}
        component={EbayRoutes}
      />
      <AuthorizedRoute path={`${url}vouchers`} component={VoucherRoutes} />

      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}pictures`}
        component={Pictures}
      />
      <AuthorizedRoute path={`${url}profile`} component={Profile} />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        path={`${url}objects`}
        component={ObjectAdministrationRoutes}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        exact
        path={`${url}users`}
        component={UserAdministration}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        exact
        path={`${url}users/create`}
        component={CreateUser}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN, roleNames.OPERATOR]}
        exact
        path={`${url}users/:id/edit`}
        component={EditUser}
      />
      <AuthorizedRoute
        allowedRoles={[roleNames.ADMIN]}
        path={`${url}billingplan`}
        component={BillingPlan}
      />
      <AuthorizedRoute path={`${url}helpcenter`} component={HelpCenter} />
    </Switch>
  </div>
);

export default App;
