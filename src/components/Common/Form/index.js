import React, {useState} from 'react';
import { Formik } from "formik";
import { Input, Select, Tag, DatePicker, Checkbox } from "antd";
import { MULTISELECT, DATEPICKER, CHECKBOX, DECIMAL, INTEGER, SELECT, CUSTOM, TEXTAREA, DATEPERIOD } from "../../../constants/FormFieldTypes";
import { isPastDatePicker, isLaterThan, getDateOfFormat } from '../../../util/dates/getters';
import { isDecimal, isIntegerString } from "../../../util/numbers/validation";
import Field from "../FIeld";
import SecondaryButton from "./Button";
import DropdownIcon from "../Icons/DropdownIcon";
import './styles.less';
import { useFormatMessage } from 'react-intl-hooks';
import moment from 'moment';

const DatePeriodPicker = (props) => {
  const { values = [], periodLength = null } = props;
  const [dates, setDates] = useState(values);
  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState();
  const { RangePicker } = DatePicker;
  const disabledDate = current => {
    if (moment().diff(current, 'days') > 0) {
      return true;
    }
    if (!dates || dates.length === 0) {
      return false;
    }

    if (null === periodLength) {
      return false;
    }

    const tooLate = dates[0] && current.diff(dates[0], 'days') > periodLength;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > periodLength;
    return tooEarly || tooLate;
  };
  const onOpenChange = open => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };
  return (
    <RangePicker
      value={hackValue || value}
      disabledDate={disabledDate}
      onCalendarChange={val => setDates(val)}
      onChange={val => setValue(val)}
      onOpenChange={onOpenChange}
      {...props}
    />
  );

}

const Form = ({
                initialValues, onSubmit, rows = [], schema,
                isDisabled = () => false, submitAction = 'submit',
                withReset = true, buttonText = 'Update',
                secondaryButton = { isShow: false },
                additionalClass = '', getIsValidForm =() => false,
                validateOnChange = false, validateOnMount = false, validateOnBlur = false
}) => {

  const t = useFormatMessage();
  const tagRender = ({ label, ...props }) => {
    return (
      <Tag {...props}>
        {label}
      </Tag>
    )
  }
  const getElementByType = ({ type, title = '', setFieldValue, values, maxValue, isError, formProps, ...props }, methods) => {
    const { value } = props;
    const { handleSubmit } = methods;

    switch (type) {
      case MULTISELECT: {
        const removeTag = (val) => {
          setFieldValue(props.name, value.filter((value) => value !== val));
        };

        return (
          <Select
            mode={'multiple'}
            tagRender={tagRender}
            onSelect={(val) => {
              // setting value undefined for empty initival values because
              // setting value null causes an empty selection
              setFieldValue(props.name, value !== undefined ? [...value, val] : [val])
            }}
            onDeselect={removeTag}
            onClose={removeTag}
            {...props}
          />
        )
      }
      case SELECT: {
        const { onSelect = () => {} } = props;

        return (
          <Select
            {...props}
            onSelect={(val) => {
              setFieldValue(props.name, val);
              onSelect(values, handleSubmit);
            }}
            suffixIcon={<DropdownIcon/>}
          />
        )
      }
      case DATEPICKER: {
        const { relatedDate } = props;

        return (
          <DatePicker
            onChange={(moment) => {
              setFieldValue(props.name, moment)
            }}
            disabledDate={(date) => {
              if (isPastDatePicker(date)) {
                return true;
              }

              if (relatedDate) {
                const relatedDateValue = values[relatedDate.name];

                if (relatedDateValue) {
                  const FORMAT = 'DD MM YYYY';

                  if (getDateOfFormat(date, FORMAT) === getDateOfFormat(relatedDateValue, FORMAT)) {
                    return false;
                  }

                  return relatedDate.isEnd
                    ? !isLaterThan(date, relatedDateValue)
                    : isLaterThan(date, relatedDateValue)
                }
              }

              return false;
            }}
            {...props}
          />
        )
      }
      case DATEPERIOD: {
        return (
          <DatePeriodPicker
            onChange={(values) => {
              setFieldValue(props.name, values)
            }}
            {...props}
          />
        )
      }
      case CHECKBOX: {
        return (
          <Checkbox {...props} >
            {title}
          </Checkbox>
        )
      }
      case DECIMAL: {
        return (
          <Input
            onChange={({ target }) => {
              const { value } = target;

              if (isDecimal(value) && Number(value) <= maxValue) {
                setFieldValue(props.name, value);
              }
            }}
            onBlur={({ target }) => {
              const { value } = target;
              const parsedToFloat = value ? parseFloat(value) : 0.00;
              const fixedValue = parsedToFloat.toFixed(2);
              value !== fixedValue && setFieldValue(props.name, fixedValue);
            }}
            {...props}
          />
        )
      }
      case INTEGER: {
        return (
          <Input
            onChange={({ target }) => {
              const { value } = target;

              if (isIntegerString(value) && Number(value) <= maxValue) {
                setFieldValue(props.name, value);
              }
            }}
            onBlur={({ target }) => {
              const { value } = target;

              setFieldValue(props.name, value);
            }}
            {...props}
          />
        )
      }
      case CUSTOM: {
        const { component: Component } = props;

        return Component
      }
      case TEXTAREA: {
        return (
          <textarea
            className={'ant-input'}
            onChange={({ target }) => {
              const { value } = target;
              setFieldValue(props.name, value);
              formProps.setFieldTouched(props.name,true);
            }}
            onBlur={() => {

              if (submitAction === 'blur') {
                handleSubmit({ [props.name]: value })
              }
            }}
            {...props}
          >

          </textarea>
        )
      }
      default: {
        return (
          <Input
            onChange={({ target }) => {
              const { value } = target;
              setFieldValue(props.name, value);
              formProps.setFieldTouched(props.name,true);
            }}
            type={type}
            onBlur={() => {

              if (submitAction === 'blur') {

                handleSubmit({ [props.name]: value });

                getIsValidForm(formProps.isValid)

              }
            }}
            {...props}
          />
        )
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={((values, { resetForm }) => {
        onSubmit(values);
        withReset && resetForm({ values: '' })
      })}
      validationSchema={schema}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
      validateOnMount={validateOnMount}
      enableReinitialize
    >
      {props => {
        const { handleSubmit, errors, touched, setFieldValue, values } = props;

        return (
          <form className={'formik '+additionalClass} onSubmit={handleSubmit}>
            {rows.map((row, index) => {
              return (
                <div className={'row'} key={index}>
                  {row.map(({ label = '', isWide = false, disabled = false , error = '', isRequired = false, ...field }, _index) => {

                    return (
                      <Field
                        key={_index}
                        error={errors[field.name] && touched[field.name] ? t({id: errors[field.name]}, {default:errors[field.name]}) : undefined}
                        isWide={isWide}
                        label={label}
                        isRequired={isRequired}
                      >
                        {getElementByType({
                          ...field,
                          setFieldValue,
                          values,
                          value: values[field.name],
                          formProps: props,
                          disabled: disabled,
                        }, { handleSubmit })}
                      </Field>
                    )
                  })
                }
                </div>
              )
            })}
            {submitAction === 'submit' && (
              <div className={'formik-footer'}>
                <SecondaryButton {...secondaryButton}/>
                <button
                  type='submit'
                  disabled={isDisabled(values)}
                  className={"formik-footer-submit"}
                >
                  {buttonText}
                </button>
              </div>
            )}
          </form>
        )
      }}
    </Formik>
  )
};

export default Form;
