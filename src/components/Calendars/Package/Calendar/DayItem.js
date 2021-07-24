import React from 'react';
import { useFormatMessage } from 'react-intl-hooks';

const CalendarDayItem = ({ title, quantity, type, isAvailable, toggleReserving }) => {
  const t = useFormatMessage();
  const getClassName = (type) => {
    const CLASSNAME = 'CalendarPackage--calendar--item--day';
    
    if (type === 'past') {
      return `${CLASSNAME}__past`;
    }
    
    if (type === 'today') {
      return `${CLASSNAME} ${CLASSNAME}__today`;
    }
    
    return CLASSNAME;
  }
  
  const getColor = (type, isAvailable) => {
    if (type === 'past') {
      return 'inherit';
    }
    
    return isAvailable ? '#679436' : '#E55812';
  }

  const getQuantityTitle = () => {
    if (! quantity) {
      return '';
    }
    if ( quantity == 1) {
      return t({id: 'app.calendars.packages.available_room'}, {quantity})
    }
    return t({id: 'app.calendars.packages.available_rooms'}, {quantity})
  }

  const quantityTitle = getQuantityTitle();
  
  return (
    <div
      className={getClassName(type)}
      style={{
        backgroundColor: getColor(type, isAvailable)
      }}
      onClick={type !== 'past' ? toggleReserving : () => {}}
      title={quantityTitle}
    >
      <span>{title}</span>
    </div>
  )
};

export default CalendarDayItem;
