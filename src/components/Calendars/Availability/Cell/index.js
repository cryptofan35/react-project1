import React, { useState, useEffect } from 'react';
import { getDay } from "../../../../util/dates/getters";
import DayItem from '../../Package/Calendar/DayItem';
import { getItemType } from "../../Package/Calendar/helpers";
import { Input, Checkbox } from "antd";
import { DEFAULT_DATE } from "../../Package/Calendar/helpers";
import { isDecimal, isIntegerString } from "../../../../util/numbers/validation";
import { useFormatMessage } from 'react-intl-hooks';

const AvailabilityCalendarCell = ({ date, isReserved, isExtra, data = DEFAULT_DATE, onChange }) => {
  const type = getItemType(date);
  const { price, quantity, isClosed, cta, ctd } = data;
  const [_price, setPrice] = useState(price.toFixed(2));
  const [_quantity, setQuantity] = useState(quantity);
  const t = useFormatMessage();
  
  useEffect(() => {
    setPrice(price.toFixed(2));
  }, [price]);
  
  useEffect(() => {
    setQuantity(quantity);
  }, [quantity]);
  
  const getPastStyles = (type) => {
    const isPast = type === 'past';
    
    return {
      opacity: isPast ? '0.5' : '1',
      pointerEvents: isPast ? 'none' : 'auto'
    }
  }
  
  if (isExtra) {
    return <div/>;
  }
  
  return (
    <div
      className={'Availability--calendar--cell'}
      style={getPastStyles(type)}
    >
      <div className={'Availability--calendar--cell--date'}>
        <DayItem
          type={type}
          title={getDay(date)}
          isReserved={isReserved && quantity > 0 && !isClosed}
          isAvailable={isReserved && quantity > 0 && !isClosed}
        />
      </div>
      <div className={'Availability--calendar--cell--form'}>
        <div className={'Availability--calendar--cell--form--row'}>
          <p>{t({id: 'app.calendars.availability.quantity'})}:</p>
          <Input
            type={'text'}
            value={_quantity}
            onChange={({ target }) => {
              const { value } = target;
              
              if (isIntegerString(value) && Number(value) <= 1000) {
                setQuantity(value);
              }
            }}
            onBlur={({ target }) => {
              const { value } = target;
              const parsed = Number(value);
              
              if (parsed !== quantity) {
                onChange('quantity', Number(value));
                setQuantity(Number(value));
              }
            }}
            onKeyDown={e => {
              if (e.keyCode === 37 || e.keyCode === 39) {
                e.stopPropagation();
              }
            }}
          />
        </div>
        <div className={'Availability--calendar--cell--form--row'}>
          <p>{t({id: 'app.calendars.availability.price'})}:</p>
          <Input
            type={'text'}
            value={_price}
            onBlur={({ target }) => {
              const { value } = target;
              const parsedToFloat = value ? parseFloat(value) : 0.00;

              if (price !== parsedToFloat) {
                onChange('price', parsedToFloat);
                setPrice(parsedToFloat.toFixed(2));
              }
            }}
            onChange={({ target }) => {
              const { value } = target;
              
              if (isDecimal(value) && Number(value) <= 100000) {
                setPrice(value);
              }
            }}
            onKeyDown={e => {
              if (e.keyCode === 37 || e.keyCode === 39) {
                e.stopPropagation();
              }
            }}
          />
        </div>
        <Checkbox
          checked={isClosed}
          onChange={({ target }) => {
            const { checked } = target;
            onChange('isClosed', checked);
          }}
        >
          {t({id: 'app.calendars.availability.close'})}
        </Checkbox>
        <div className={'Availability--calendar--cell--form--row'}>
          <Checkbox
            checked={cta}
            onChange={({ target }) => {
              const { checked } = target;
              onChange('cta', checked);
            }}
          >
            {t({id: 'app.calendars.availability.cta'})}
          </Checkbox>
          <Checkbox
            checked={ctd}
            onChange={({ target }) => {
              const { checked } = target;
              onChange('ctd', checked);
            }}
          >
            {t({id: 'app.calendars.availability.ctd'})}
          </Checkbox>
        </div>
      </div>
    </div>
  )
};

export default AvailabilityCalendarCell;