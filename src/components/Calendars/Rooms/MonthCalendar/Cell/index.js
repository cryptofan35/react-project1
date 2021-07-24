import React, {useState, useEffect} from 'react';
import moment from 'moment';
import './styles.less';
import { getDateOfFormat, getDay } from "util/dates/getters";
import ReloadIcon from "@2fd/ant-design-icons/lib/Reload";
import Triangle from "@2fd/ant-design-icons/lib/Triangle";

const DATE_FORMAT = 'MM-DD-YYYY';

const DayNumber = ({date, available, disabled, onClick}) => {
  const getClassName = () => {
    let className = "day-number";

    if (disabled) {
      className += ' disabled';
      return className;
    }

    if (! available) {
      return className + ' not-available';
    }
    return className + ' available';
  }
  const className = getClassName();

  const handleClick = () => {
    if (disabled) {
      return;
    }
    return onClick();
  }
  
  return (
    <div className={className} onClick={handleClick}>
      {getDay(date)}
    </div>
  )
}

const Reload = ({onReload}) => {
  return (
    <div className="reload" onClick={onReload}>
      <ReloadIcon style={{fontSize:'20px', color: '#005C81', transform: 'rotate(270deg)'}} />
    </div>
  );
}

const QuantityBox = ({quantity, onQuantityChange}) => {
  const [inputValue, setInputValue] = useState(quantity);
  const onInputChange = (event) => {
    let newQuantity = parseInt(event.currentTarget.value.replace(/[^0-9]/g, ''));
    if (isNaN(newQuantity)) {
      return;
    }
    if (newQuantity < 0) {
      return;
    }
    setInputValue(newQuantity);
  }
  const onInputBlur = () => {
    if (inputValue != quantity) {
      onQuantityChange(inputValue);
    }
  }
  useEffect(() => {
    setInputValue(quantity);
  }, [quantity])
  const increaseQuantity = () => {
    onQuantityChange(quantity + 1);
  }
  const decreaseQuantity = () => {
    if (quantity == 0) {
      return;
    }
    onQuantityChange(quantity - 1);
  }
  return (
    <div className="quantity-box">
      <input 
        type="number" 
        onChange={onInputChange} 
        onBlur={onInputBlur}
        className="quantity-input-text" 
        value={inputValue} 
        onKeyDown={(event) => {
          event.stopPropagation();  // to prevent changing selected date with keyboard
        }}
        />
      <div className="up-down">
        <div className="up" onClick={increaseQuantity}>
          <Triangle />
        </div>
        <div className="down" onClick={decreaseQuantity}>
          <Triangle />
        </div>
      </div>
    </div>
  );
}

const Cell = ({
  monthDate,
  date, 
  availabilityCalendar, 
  hasChannelManager, 
  onReload, 
  onQuantityChange,
  onAvailabilityChange
}) => {
  const [disabled, setDisabled] = useState(false);
  const [available, setAvailable] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [hasUserSetting, setHasUserSetting] = useState(false);
  useEffect(() => {
    if (! date || ! availabilityCalendar) {
      return;
    }
    if (moment().diff(date, 'days') > 0 || monthDate.format('MM') !== date.format('MM')) {
      setDisabled(true);
      setAvailable(false);
      setQuantity(0);
      setHasUserSetting(false);
      return;
    }
    setDisabled(false);
    const day = getDateOfFormat(date, DATE_FORMAT);
    if (! availabilityCalendar[day]) {
      setAvailable(false);
      setQuantity(0);
      setHasUserSetting(false);
      return;
    }
    setQuantity(availabilityCalendar[day]['quantity']);
    setAvailable(!availabilityCalendar[day]['isClosed'] && availabilityCalendar[day]['quantity'] > 0);
    setHasUserSetting(availabilityCalendar[day]['hasUserSetting']);
  }, [date, availabilityCalendar]);

  return (
    <div className={`cell ${disabled ? 'disabled' : ''}`}>
      <div className="top">
        <DayNumber 
          date={date} 
          available={available} 
          disabled={disabled}
          onClick={() => onAvailabilityChange(!available)}
        />
        {hasChannelManager && !disabled && hasUserSetting && (
          <Reload onReload={onReload} />
        )}
      </div>
      <div className="bottom">
        {!disabled && <QuantityBox 
          quantity={quantity} 
          onQuantityChange={onQuantityChange}
          />}
      </div>
    </div>
  )
}

export default Cell;