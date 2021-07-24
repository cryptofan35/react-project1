import UploadTemplatePage from "pages/UploadTemplatePage/UploadTemplatePage";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Voucher from "../../pages/Voucher";
import Redemption from "../../pages/Voucher/Redemption";

const UploadTemplateRoute = ({ match }) => {
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path={`${match.url}/`} component={UploadTemplatePage} />
      </Switch>
    </div>
  );
};

export default UploadTemplateRoute;
