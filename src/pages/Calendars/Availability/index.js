import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Page from "../../../components/Common/Page";
import CustomSelect from "../../../components/CustomSelect";
import { getCalendarPackages, changePackageDate } from "../../../appRedux/actions/Calendars";
import { getDatesQuery, isDateInMonth } from "../../../util/dates/getters";
import moment from "moment";
import AvailabilityCalendar from "../../../components/Calendars/Availability";
import './styles.less';
import Hint from '../../../components/Calendars/Package/Hint';
import { useFormatMessage } from 'react-intl-hooks';

import {
  getProperty as getPropertyAction,
} from "appRedux/actions";

const DATE_FORMAT = 'MMMM YYYY';
const HINTS_OPTIONS = [
  {
    color: '#679436',
    title: 'app.calendars.availability.available'
  },
  {
    color: '#E55812',
    title: 'app.calendars.availability.not_available'
  },
  {
    label: 'app.calendars.availability.close',
    title: 'app.calendars.availability.closed'
  },
  {
    label: 'app.calendars.availability.cta',
    title: 'app.calendars.availability.close_to_arrival'
  },
  {
    label: 'app.calendars.availability.ctd',
    title: 'app.calendars.availability.close_to_department'
  }
];

const AvailabilityCalendarPage = ({ getCalendarPackages, packages, changePackageDate, getProperty, property, history }) => {
  const MONTHS = getDatesQuery(37, DATE_FORMAT, 'month');
  const [selectedPackageID, setSelectedPackageID] = useState(undefined);
  const [selectedRoomID, setSelectedRoomID] = useState(undefined);

  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const [sortedPackages, setSortedPackages] = useState([]);
  const t = useFormatMessage();

  const formEl = useRef(null);

  useEffect(() => {
    getProperty();
  }, []);

  useEffect(() => {

    if (property && property.objectId == null) {
      history.push('/property/add');
      return;
    }

    if (property && property.objectId) {
      getCalendarPackages(property.objectId);
    }
  }, [property]);

  useEffect(() => {
    if (packages.length > 0) {
      const sorted = packages.sort((a,b) => +b.id - +a.id);

      setSortedPackages(sorted);

      setSelectedPackageID(String(sorted[0].id));
      setSelectedRoomID(String(sorted[0].roomID));
    } else {

      setSortedPackages([]);

      setSelectedPackageID(undefined);
      setSelectedRoomID(undefined);

    }

  }, [packages]);

  const momentMonth = moment(`15 ${selectedMonth}`, `DD ${DATE_FORMAT}`);
  const selectedPackage = packages.find(({ id }) => String(id) === selectedPackageID);


  const getReservedDates = (pack, month) => {
    if (!pack.hasOwnProperty('reservedDates')) {
      return [];
    }

    return pack.reservedDates.filter(({ date }) => isDateInMonth(date, month));
  }

  return (
    <Page
      className={'Availability'}
      title={t({id: 'app.calendars.availability.availability_calendar'})}
      styles={{
        marginBottom: '46px'
      }}
    >
      <div ref={formEl} style={{position: 'relative'}}/>
      <div className={'Availability--control'}>
        {sortedPackages && (
          <CustomSelect
            label={t({id: 'app.calendars.availability.name'})}
            required
            options={sortedPackages.map(({ id, name }) => ({
              key: id,
              value: name,
              defaultValue: String(id) === selectedPackageID,
            }))}
            onChange={(val, { key }) => {
              setSelectedPackageID(key);

              const { roomID } = sortedPackages.find(({ id }) => String(id) === key);
              setSelectedRoomID(roomID);
            }}
            getPopupContainer={() => formEl.current}
          />
        )}
        {MONTHS.length && (
          <CustomSelect
            label={t({id: 'app.calendars.availability.month_and_year'})}
            required
            options={MONTHS.map((date, index) => {
              return ({
                key: index,
                value: date,
                defaultValue: date === selectedMonth
              });
            })}
            onChange={setSelectedMonth}
            getPopupContainer={() => formEl.current}
          />
        )}
      </div>
      {selectedPackage && property && property.objectId && property.currency && (
        <AvailabilityCalendar
          month={momentMonth}
          reservedDates={getReservedDates(selectedPackage, momentMonth)}
          onChange={(data) => {
            changePackageDate(selectedPackageID, data, selectedRoomID, property.objectId, property.currency);
          }}
        />
      )}

      {property && !property.objectId && <p>ObjectId is null. Please add a ObjectId to the property.</p>}
      {property && !property.currency && <p>Currency is null. Please add a currency to the property.</p>}

      <div className={'Availability--hints'}>
        {HINTS_OPTIONS.map(({ title, color = '', label = '' }, index) => (
          <Hint
            key={index}
            title={title ? t({id: title}) : ''}
            color={color}
            label={label ? t({id: label}) : ''}
            className={'Availability'}
          />
        ))}
      </div>
    </Page>
  );
}

const mapStateToProps = ({ calendars, property: propertyState }) => {
  const { packages } = calendars;
  const { property } = propertyState;

  return {
    packages,
    property
  };
};

const mapDispatchToProps = {
  getProperty: getPropertyAction,
  getCalendarPackages,
  changePackageDate
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailabilityCalendarPage);
