import {isDateInMonth, isPastDateCalendar, isToday} from "../../../../util/dates/getters";

export const getItemType = (date) => {

  if (isToday(date)) {
    return 'today';
  }

  if (isPastDateCalendar(date)) {
    return 'past';
  }

  return 'next';
};

export const getReservedDatesByMonth = (dates, month) => dates.filter(({date}) => isDateInMonth(date, month));

export const DEFAULT_DATE = {
  isClosed: false,
  cta: false,
  ctd: false,
  quantity: 0,
  price: 0
};
