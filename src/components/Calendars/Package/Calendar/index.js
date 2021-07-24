import React from 'react';
import { Calendar } from "antd";
import './styles.less';
import { getDay, getMonth, getDateOfFormat } from "../../../../util/dates/getters";
import CalendarDayItem from "./DayItem";
import { getItemType } from "./helpers";
import LocaleCalendar from "../../../Common/Calendar/withLocale";

const PackageMonthCalendar = ({ title, date, reservedDates, toggleReserving }) => {
  const month = getMonth(date);

  return (
    <div className={'CalendarPackage--calendar'}>
      <p className={'CalendarPackage--calendar--date'}>{title}</p>
      <LocaleCalendar>
        <Calendar
          fullscreen={false}
          className={'CalendarPackage--calendar--item'}
          value={date}
          headerRender={() => <></>}
          dateFullCellRender={(date) => {
            const dayNumber = getDay(date);
            const monthNumber = getMonth(date);
            const stringDate = getDateOfFormat(date, 'MM-DD-YYYY');
          
            const getReservedDate = () => reservedDates.find(reservedDate => reservedDate.date == stringDate);
            const reservedDate = getReservedDate();
            const quantity = reservedDate ? reservedDate.quantity : null;

            if (month !== monthNumber) {
              return <div style={{ pointerEvents: 'none' }}/>;
            }

            return (
              <CalendarDayItem
                title={dayNumber}
                quantity={quantity}
                type={getItemType(date)}
                isAvailable={reservedDate}
                toggleReserving={() => {
                  toggleReserving && toggleReserving(stringDate, getReservedDate())
                }}
              />
            )
          }}
        />
      </LocaleCalendar>
    </div>
  )
};

export default PackageMonthCalendar;
