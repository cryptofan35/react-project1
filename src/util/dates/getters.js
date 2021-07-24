import moment from "moment";

export const getDate = () => moment();

export const getDay = (date) => moment(date).date();

export const getMonth = (date) => moment(date).month();

export const getDateOfFormat = (date, format) => moment(date).format(format);

export const getDateWithAdditionalTime = (date, offset, type) => moment(date).add(offset, type);

export const isToday = (date) => {
  const FORMAT = 'DD-MM-YYYY';
  const today = moment().format(FORMAT);
  const day = date.format(FORMAT);

  return today === day;
};

export const isPastDatePicker = (date) => !moment().isBefore(getDateWithAdditionalTime(date, 1, 'd'));
export const isPastDateCalendar = (date) => !moment().isBefore(date, 'h');

export const isDateInMonth = (date, monthDate, format = 'MM-DD-YYYY') => moment(date, format).isSame(monthDate, 'month');

export const getDatesQuery = (number, format, type) => {
  return new Array(number)
    .fill(null)
    .map((val, index) => {
      return moment().add(index, type).format(format);
    });
}

export const isLaterThan = (src, target) => src < target.startOf('day');

export const getTimezoneAbbr = () => {
  const today = new Date();
  const strToday = String(today).split("(")[1].split(")")[0];
  const arrToday = strToday.split(' ');
  let abbr = '';

  arrToday.forEach(word => {
    abbr += word[0];
  });

  return abbr;
}

export const convertToString = (date, format) => date.format(format);
