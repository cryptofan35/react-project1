import React from 'react'
import {
  Input,
} from "antd";
import { isDecimal } from "util/numbers/validation";

import './index.less';

const DecimalInputField = ({ onChange, value: oldVal, minValue = '', maxValue = 100000, onBlur, ...props }) => {
  return (
    <Input
      className="decimal-input-field"
      value={oldVal}
      onChange={ev => {
        ev.stopPropagation();

        if (!onChange ) {
          return;
        }
        
        const { target } = ev;
        const { value } = target;

        if (value === '0' || value === '') {
          return onChange('')
        }

        if (isDecimal(value) && Number(value) <= maxValue) {
          return onChange(value)
        }

        return onChange(oldVal || minValue);
      }}
      onBlur={({ target }) => {
        if (!onChange ) {
          return;
        }

        const { value } = target;
        const parsedToFloat = value ? parseFloat(value) : 0.00;
        const fixedValue = parsedToFloat.toFixed(2);

        if (value !== fixedValue && fixedValue !== '0.00') {
          onChange(fixedValue);
        }

        if(onBlur) {
          onBlur();
        }
      }}
      {...props}
    />
  )
}

export default DecimalInputField
