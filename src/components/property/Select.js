import React, { useRef } from "react";
import classNames from 'classnames';
import { Select } from "antd"
import ChevronDown from '@2fd/ant-design-icons/lib/ChevronDown'

const { Option } = Select;


const PropertySelect = (props) => {
  const {
    label,
    required,
    placeholder = '',
    options = [],
    value = '',
    onChange,
    onBlur = () => {},
    errorMessage = '',
    showArrow = true,
    defaultValue = undefined,
    showSearch = true,
    disabled = false
  } = props;
  const containerEl = useRef(null);

  return (
    <div className={classNames('select-wraper', { ['ant-form-item-has-error']: errorMessage})} ref={containerEl}>
      {label &&
        <label>{label}
          {required &&
            <span>*</span>
          }
        :</label>
      }
      <Select
        showArrow={showArrow}
        showSearch={showSearch}
        placeholder={placeholder || 'Select'}
        optionFilterProp="children"
        suffixIcon={<ChevronDown style={{ color: '#495057', fontSize: 16 }} />}
        value={(value && options.length) ? value : defaultValue}
        getPopupContainer={() => containerEl.current}
        onChange={onChange}
        onBlur={onBlur}
        filterOption={(input, option) =>
          input ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true
        }
        disabled={disabled}
      >
        {
          options.map((item) => {
            return (
              <Option value={item.id} key={item.id}>{item.value}</Option>
            )
          })
        }
      </Select>
      {errorMessage && <span className="ant-form-item-explain form-validate-text">{errorMessage}</span>}
    </div>
  )
};

export default PropertySelect;
