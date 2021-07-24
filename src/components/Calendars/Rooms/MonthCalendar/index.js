import React from "react";
import LocaleCalendar from "../../../Common/Calendar/withLocale";
import { Calendar } from "antd";
import { getDateOfFormat, getDay } from "util/dates/getters";
import './styles.less';
import moment from 'moment'
import Cell from './Cell';
const DATE_FORMAT = 'MMMM YYYY';


const MonthCalendar = ({
  date, 
  availabilityCalendar, 
  hasChannelManager, 
  onReload, 
  onQuantityChange,
  onAvailabilityChange
}) => {
  const now = moment();
  if (! date) {
    return (<></>);
  }
  return (
    <div style={{}}>
      <LocaleCalendar>
        <Calendar 
          fullscreen={false}
          value={date}
          headerRender={() => <h2>{getDateOfFormat(date, DATE_FORMAT)}</h2>}
          disabledDate={day => {
            return now.diff(day, 'days') > 0 || day.format('MM') !== date.format('MM')
          }}
          dateFullCellRender={day => (
            day.format('MM') === date.format('MM') &&
            <Cell 
              monthDate={date}
              date={day} 
              availabilityCalendar={availabilityCalendar} 
              hasChannelManager={hasChannelManager} 
              onReload={() => onReload(day)} 
              onQuantityChange={(quantity) => onQuantityChange({date: day, quantity})}
              onAvailabilityChange={(isAvailable) => onAvailabilityChange({date: day, isAvailable})}
              />
          )}
        />
      </LocaleCalendar>
    </div>
  );
}

export default MonthCalendar;