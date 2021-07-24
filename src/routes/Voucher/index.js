
import React, { useRef, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Vouchers from "../../pages/Voucher/index";
import Redemption from "../../pages/Voucher/Redemption";

import { connect } from "react-redux";

const VoucherRoutes = ({ match, property = {} }) => {
  const prevPropertyId = useRef();

  useEffect(() => {
    if (property && property.id) {
      prevPropertyId.current = property.id;
    }
  }, [property]);

  if (property && property.id && prevPropertyId.current) {
    if (property.id !== prevPropertyId.current) {
      return <Redirect to={`${match.url}`} />;
    }
  }

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path={`${match.url}/`} component={Vouchers} />
        <Route exact path={`${match.url}/:id/redeem`} component={Redemption} />
      </Switch>
    </div>
  );
};
const mapStateToProps = (state) => ({
  property: state.property.property,
});

export default connect(mapStateToProps, null)(VoucherRoutes);

