import React from 'react'
import {
  Input,
} from "antd";
import { isIntegerString } from "util/numbers/validation";

import './index.less';

const IntegerInputField = ({ onChange, value: oldVal, maxValue = 1000, minValue = '', ...props }) => {
  return (
    <Input
      className="integer-input-field"
      value={oldVal}
      onChange={({ target }) => {
        if (!onChange ) {
          return;
        }
        const { value } = target;
      
        if (isIntegerString(value) && Number(value) <= maxValue) {
          return onChange(parseInt(value) || minValue)
        }

        return onChange(oldVal || minValue);
      }}
      onBlur={({ target }) => {
        if (!onChange ) {
          return;
        }
        const { value } = target;

        if (!value) {
          return void (0)
        }
  
        onChange(value)
      }}
      {...props}
    />
  )
}

export default IntegerInputField
