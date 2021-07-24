import React from 'react';
import { Redirect, Route, Switch } from "react-router-dom";
import PackagesCalendar from "../../pages/Calendars/Packages";
import AvailabilityCalendar from "../../pages/Calendars/Availability";
import RoomsCalendar from "../../pages/Calendars/Rooms";
import QuickUpdate from "../../pages/Calendars/QuickUpdate";

const Calendars = ({ match }) => {
  
  if (match.isExact) {
    return (<Redirect to={'/calendars/packages'} />)
  }
  
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route path={`${match.url}/packages`} component={PackagesCalendar} />
        <Route path={`${match.url}/rooms`} component={RoomsCalendar} />
        <Route path={`${match.url}/availability`} component={AvailabilityCalendar} />
        <Route path={`${match.url}/update`} component={QuickUpdate} />
      </Switch>
    </div>
  )
}

export default Calendars;