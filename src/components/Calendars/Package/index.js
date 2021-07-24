import React, { useState } from 'react';
import PackageMonthCalendar from "./Calendar";
import CalendarNavigator from "./Navigator";
import './styles.less';
import {
  getDateWithAdditionalTime,
  getDate,
  getDateOfFormat
} from "../../../util/dates/getters";
import Hint from './Hint';
import { getReservedDatesByMonth } from "./Calendar/helpers";
import { useFormatMessage } from 'react-intl-hooks';

const DATE_FORMAT = 'MMMM YYYY';

const CalendarPackage = ({ name, reservedDates, toggleReserving }) => {
  const [date, setDate] = useState(getDate);
  const [step, setStep] = useState(0);
  const t = useFormatMessage();
  
  const getMonthsOptions = (date) => {
    return new Array(3)
      .fill(null)
      .map((item, index) => {
        const _date = index ? getDateWithAdditionalTime(date, index, 'M') : date;
        
        return ({
          title: getDateOfFormat(_date, DATE_FORMAT),
          date: _date,
          reservedDates: getReservedDatesByMonth(reservedDates, _date)
        });
      });
  }

  const options = getMonthsOptions(date);
  
  return (
    <div className={'CalendarPackage'}>
      <p className={'CalendarPackage--name'}>{name}</p>
      <div>
        <CalendarNavigator
          step={step}
          onNavigate={(offset) => {
            const nextDate = getDateWithAdditionalTime(date, offset, 'M');
            setDate(nextDate);
            setStep(step + offset);
          }}
        />
        <div className={'CalendarPackage--row'}>
          {options.map(({ title, date, reservedDates }, index) => (
            <PackageMonthCalendar
              title={title}
              key={index}
              date={date}
              reservedDates={reservedDates}
              toggleReserving={toggleReserving}
            />
          ))}
        </div>
        <div className={'CalendarPackage--hints'}>
          <Hint
            color={'#679436'}
            title={t({id: 'app.packages.information.available'})}
            className={'CalendarPackage'}
          />
          <Hint
            color={'#E55812'}
            title={t({id: 'app.packages.information.not_available'})}
            className={'CalendarPackage'}
          />
        </div>
      </div>
    </div>
  )
};

export default CalendarPackage;
