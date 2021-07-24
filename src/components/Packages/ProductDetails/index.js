import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useFormatMessage } from 'react-intl-hooks';
import CalendarPackage from "components/Calendars/Package";

import "./index.less";

import { fetchPackageCalendar } from "appRedux/actions";

const ProductDetails = ({ packageDetails, property, calendar, fetchPackageCalendar }) => {
  const [reservedDates, setReservedDates] = useState([]);
  const { name, roomName, numberOfNights, numberOfGuests, price, currencyCode } = packageDetails;
  const t = useFormatMessage();

  const parsedToFloat = price ? parseFloat(price) : 0.00;
  const fixedValue = parsedToFloat.toFixed(2);

  const loadCalendar = () => {
    if (! property || ! property.objectId && ! packageDetails.packageId) {
      return;
    }

    fetchPackageCalendar({
      packageId: packageDetails.packageId
    })
  }

  useEffect(() => {
    loadCalendar();
  }, [packageDetails, property])

  useEffect(() => {
    setReservedDates(calendar ? calendar.reservedDates : [])
  }, [calendar])

  return ( 
    <>
      <div className="product-details">
        <div className="product-details-labels">
          <p>{t({id: 'app.packages.information.place_offer'})}:</p>
          <p>{t({id: 'app.packages.information.rooms'})}:</p>
          <p>{t({id: 'app.packages.information.nights'})}:</p>
          <p>{t({id: 'app.packages.information.people'})}:</p>
          <p>{t({id: 'app.packages.information.price'})}:</p>
        </div>
        <div className="product-details-values">
          <p>{name}</p>
          <p>{roomName}</p>
          <p>{numberOfNights}</p>
          <p>{numberOfGuests}</p>
          <p>{`${fixedValue} ${currencyCode}`}</p>
        </div>
      </div>
      <div className="product-calendar">
          <CalendarPackage
            name={`${t({id: 'app.packages.information.package_calendar'})}:`}
            reservedDates={reservedDates.filter(({ quantity = 0, isClosed }) => quantity && !isClosed).map(({ date }) => date)}
          />
      </div>
    </>
  );
}

const mapStateToProps = ({property, packages}) => {
  return {
    property: property.property,
    packageDetails: packages.packageDetails,
    calendar: packages.calendar
  }
};

const mapDispatchToProps = {
  fetchPackageCalendar: fetchPackageCalendar
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
