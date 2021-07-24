import React from "react";
import classNames from 'classnames';
import { Input } from "antd"

const PropertyInput = (props) => {

  const {
    label,
    placeholder = '',
    required,
    value = '',
    onChange,
    onBlur,
    errorMessage,
    disabled = false
  } = props;

  return (
    <div className={classNames('input-wraper', { ['ant-form-item-has-error']: errorMessage})}>
      {label &&
        <label>{label}
          {required &&
            <span>*</span>
          }
        :</label>
      }
      <Input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      {errorMessage && <span className="ant-form-item-explain form-validate-text">{errorMessage}</span>}
    </div>
  )
};

export default PropertyInput;
