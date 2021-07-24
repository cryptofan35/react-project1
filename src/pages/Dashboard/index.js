import React from "react";
import { connect } from "react-redux";
import RunningPackages from './RunningPackages';
import Views from './Views';
import Vouchers from './Vouchers';
import Buyers from './Buyers';
import { useFormatMessage } from 'react-intl-hooks';

import "./dashboard.less";

function Dashboard({property = {}}) {
  const t = useFormatMessage();
  return (
    <>
      <div className="dashboard">
        <div className="dashboard__header">
          <span className="dashboard__title">{t({id: 'sidebar.dashboard'})}</span>
        </div>
        <div className="dashboard__content">
          <RunningPackages id={property&&property.objectId}/>
          <Views id={property&&property.objectId}/>
          <Vouchers id={property&&property.objectId}/>
          <Buyers id={property&&property.objectId}/>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = ({ property }) => ({
  property: property.property ,
});

export default connect(mapStateToProps)(Dashboard);
