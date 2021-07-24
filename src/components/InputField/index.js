import React from "react";
import { Input, Select } from "antd";
import cn from 'classnames';
import Label from "../Label";

import "./input-field.less";

const InputField = ({ onChange, value, placeholder, label, required, error, maxLength }) => (
  <div className="input-field">
    {label && <Label label={label} required={required} />}
    <Input value={value} className={cn('input-field__input', error && 'input-field__input-error')} onChange={onChange} placeholder={placeholder} maxLength={maxLength} />
    {error && <span className={'input-field__error'}>{error}</span>}
  </div>
);

export default InputField;
