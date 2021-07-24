import React  from 'react';
import LocaleCalendar from "../../Common/Calendar/withLocale";
import { Calendar } from "antd";
import { getDateOfFormat, getMonth } from "../../../util/dates/getters";
import Cell from './Cell';
const DATE_FORMAT = 'MMMM YYYY';

const AvailabilityCalendar = ({ month, reservedDates, onChange }) => {
  const monthNumber = getMonth(month);
  const lastWeekNumber = month.endOf('month').week();

  return (
    <div className={'Availability--calendar'}>
      <LocaleCalendar>
        <Calendar
          value={month}
          headerRender={() => <h2>{getDateOfFormat(month, DATE_FORMAT)}</h2>}
          disabledDate={date => {
            const weekNumber = date.week();

            if (monthNumber === 11) {
              return weekNumber === 1;
            }

            if (monthNumber === 0) {
              return weekNumber === 5 && lastWeekNumber === 4;
            }

            return weekNumber > lastWeekNumber;
          }}
          dateFullCellRender={(date) => {
            const stringDate = getDateOfFormat(date, 'MM-DD-YYYY');
            const reservedDate = reservedDates.find(({ date: _date }) => _date === stringDate);

            return (
              <Cell
                date={date}
                isReserved={reservedDate}
                isExtra={getMonth(date) !== monthNumber}
                data={reservedDate}
                onChange={(key, value) => {
                  onChange({
                    date: stringDate,
                    key,
                    value
                  });
                }}
              />
            );
          }}
        />
      </LocaleCalendar>
    </div>
  )
};

export default AvailabilityCalendar;
