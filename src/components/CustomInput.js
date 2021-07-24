import React from "react";
import classNames from "classnames";
import { Input } from "antd";

const CustomInput = ({ label, required, errMsg, validators, ...args }) => {
  return args ? (
    <div
      className={classNames("input-wraper", {
        ["ant-form-item-has-error"]: errMsg
      })}
    >
      {label && (
        <label>
          {label}
          {required && <span>*</span>}:
        </label>
      )}
      <Input {...args} />
      {errMsg && (
        <span className="ant-form-item-explain form-validate-text">
          {errMsg}
        </span>
      )}
    </div>
  ) : null;
};

export default CustomInput;
