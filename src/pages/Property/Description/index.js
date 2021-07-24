import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Tooltip } from "antd";
import { updateProperty, updatePropertyState } from "../../../appRedux/actions";
import { showNotification } from "util/notifications";
import { useFormatMessage } from 'react-intl-hooks';

import "./description.less";

import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Editor from "../../../components/Editor/Editor";
import PropertySelect from "../../../components/property/Select";
import { updatePropertyXML } from "../../../API/Property";
import { DESCRIPTION } from "../../../constants/xmlTypes";

const FIELDS = [
  {
    name: 'description_content'
  },
  {
    name: 'description_language',
    options: [
      { id: 'de', value: 'app.property.description.german' },
      { id: 'en', value: 'app.property.description.english' }
    ],
    showSearch: false
  },
];
const EN_LANGUAGE_ID = 'en';

const Description = (props) => {
  const { property } = props;

  const [fields, setFields] = useState(FIELDS);
  const [values, setValues] = useState({});
  const [isSaved, setSaved] = useState(null);
  const [currentLang, setCurrentLang] = useState(EN_LANGUAGE_ID);

  const t = useFormatMessage();

  function getFieldByName(fieldName) {
    return fields.find(field => field.name === fieldName) || {};
  }

  function getFieldIndexByName(fieldName) {
    return fields.findIndex(field => field.name === fieldName);
  }

  useEffect(() => {
    if (property) {

      if (property.objectId == null) {
        props.history.push('/property/name');
        return;
      }

      const currentLanguage = values['description_language'] || 'en';
      const currentValue = (property['descriptions'] && property['descriptions'][currentLanguage]) || '';

      const fieldValues = {
        description_language: currentLanguage,
        description_content: currentValue,
      }

      setValues(fieldValues);
    }
  }, [property]);


  useEffect(() => {
    if (property && currentLang) {
      const selectedDescription = (property['descriptions'] && property['descriptions'][currentLang]) || ''

      const newValues = {
        description_language: currentLang,
        description_content: selectedDescription,
      }

      setValues(newValues);
    }

  }, [currentLang]);

  function handleChangeSelect(fieldName, newValue) {
    setCurrentLang(newValue);
  }

  function handleChange(fieldName, newValue) {
    const fieldIndex = getFieldIndexByName(fieldName);

    if (fieldIndex === -1) return;

    const newValues = {
      ...values,
      [fieldName]: newValue
    };

    setValues(newValues);

    return newValues;
  }

  const handleBlur = fieldName => (event, currentValues = values) => {
    const field = getFieldByName(fieldName);

    handleSubmit({ propertyId: property.id, fieldName, fieldValue: field.serialize ? field.serialize(currentValues[field.name]) : currentValues[field.name] });
  };

  const handleSubmit = async (field, isTipShowed = true) => {
    if (!property.objectId) return;

    const valuesToUpdate = {
      ...values,
      objectId: property.objectId
    }

    updatePropertyXML(valuesToUpdate, DESCRIPTION)
    .then( res => {

      if (res.status && res.status === 'Success' && isTipShowed) {
        const {description_language, description_content} = res.result;

        props.updatePropertyState({
          ...property,
          descriptions: {
            ...property.descriptions,
            [description_language]: description_content,
          }
        });

        showNotification({message:'Saved'});
      }
    });

  };

  function handleClickNext() {
    props.history.push('/property/pictures');
  }

  function renderFieldSelect (fieldName) {
    const field = getFieldByName(fieldName);

    return <PropertySelect
      name={fieldName}
      label={field.label ? t({id: field.label}) : ''}
      placeholder={field.placeholder
        ? field.placeholder.indexOf('app.') === 0
          ? t({id:field.placeholder})
          : field.placeholder
        : ''}
      options={field.options.map(option => ({...option, value: t({id: option.value})}))}
      value={values[fieldName]}
      onChange={(value) => handleChangeSelect(fieldName, value)}
      required={field.required}
      showArrow={field.showArrow}
      defaultValue={EN_LANGUAGE_ID}
      showSearch={field.showSearch}
    />
  }

  return (
    <div className="cb-name-content-wrapper property-description">
      <div className="breadcrumb-wrapper">
        <span>{t({id: 'app.property.description.description'})}</span>
      </div>

      <div className="property-form-wrapper">

        <div className="form-title-wrapper form-title-wrapper-justify">
          <span className={classNames('form-tip', { 'form-tip-visible': isSaved })}>{t({id: 'app.common.saved'})}</span>
          <div className='description__tools'>
            <div className='select-small'>
              {renderFieldSelect('description_language')}
            </div>
            <Tooltip
              title={t({id: 'app.property.description.tooltip'})}
              placement="bottomRight"
              trigger='click'
              color='#FFFFFF'
              overlayClassName='description__tools-tooltip'
            >
              <span className='description__tools-tooltip-help'/>
            </Tooltip>
          </div>
        </div>
        <Row gutter={[20, 0]}>
          <Col span={24}>
            <Editor
              toolbar={[
                'heading',
                'bold',
                'italic',
                'underline',
                'numberedList',
                'bulletedList'
              ]}
              value={values['description_content']}
              onChange={({ target: { value }}) => (currentLang === values['description_language']) && handleChange('description_content', value)}
              onBlur={handleBlur('description_content')}
            />
          </Col>
        </Row>
        <Row gutter={[20, 0]} className='navigation'>
          <Col span={12}>
            <Link to="/property/legal">
              <Button  type='link'>{t({id: 'app.common.back'})}</Button>
            </Link>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type='primary' onClick={handleClickNext}>{t({id: 'app.common.next'})}</Button>
          </Col>
        </Row>
      </div>
    </div >
  )
};

const mapStateToProps = ({ data, property: propertyState }) => {
  const { languages } = data;
  const { property } = propertyState;

  return { languages, property }
};

export default connect(mapStateToProps, { updateProperty, updatePropertyState })(Description);
