import React from "react";
import { Select } from "antd";
import ChevronDownIcon from "@2fd/ant-design-icons/lib/ChevronDown";
import cn from 'classnames';
import Label from '../Label';

import './select-field.less';

const SelectField = ({
  options = [],
  onChange,
  value,
  placeholder,
  label,
  required,
  error
}) => (
    <div className="select-field">
      {label && <Label label={label} required={required}/>}
    <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        suffixIcon={
          <ChevronDownIcon style={{ color: "#495057", fontSize: 18 }} />
        }
        className={cn("select-field__select", error && 'select-field__select-error')}
    >
      {options.map(({ id, value }) => (
        <Select.Option key={id} value={id}>
          {value}
        </Select.Option>
      ))}
      </Select>
      {error && <span className={'select-field__error'}>{error}</span>}
  </div>
);

export default SelectField;
