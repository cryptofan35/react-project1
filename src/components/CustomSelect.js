import React, { useRef } from "react";
import classNames from "classnames";
import { Select } from "antd";
import ChevronDown from "@2fd/ant-design-icons/lib/ChevronDown";

const { Option } = Select;

const CustomSelect = ({ label, required, errMsg, validators, options, ...args }) => {

  const containerEl = useRef(null);

  return options ? (
    <div
      className={classNames("select-wraper", {
        ["ant-form-item-has-error"]: errMsg
      })}
      ref={containerEl}
    >
      {label && (
        <label>
          {label}
          {required && <span>*</span>}:
        </label>
      )}
      <Select
        {...args}
        suffixIcon={<ChevronDown style={{ color: "#495057", fontSize: 16 }} />}
        value={options.reduce(
          (acc, el) => (el.defaultValue ? el.value : acc),
          ""
        )}
      >
        {options.map(({ key, value }) => {
          return (
            <Option key={key} value={value}>
              {value}
            </Option>
          );
        })}
      </Select>
      {errMsg && (
        <span className="ant-form-item-explain form-validate-text">
          {errMsg}
        </span>
      )}
    </div>
  ) : null;
};

export default CustomSelect;
