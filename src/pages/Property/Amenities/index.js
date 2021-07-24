import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Checkbox } from "antd";
import { updateProperty, getProperty, updatePropertyState } from "../../../appRedux/actions";
import { updatePropertyXML } from "../../../API/Property";
import { AMENITIES } from "../../../constants/xmlTypes";
import CATEGORIES from '../../../constants/AmenityCategories';
import { useFormatMessage } from 'react-intl-hooks';

import "./amenities.less";

import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { fetchAllAmenities } from '../../../appRedux/actions/Amenities';

import { showNotification } from "util/notifications";

const Checkboxes = ({ fields, onChange, values}) => {
  return <div className="checkboxes">
    <div className="checkboxes__content">
      {fields.map((field, index) => <div className="checkboxes__item" key={index}>
        <Checkbox checked={values[field.name]} onChange={(e) => onChange(field.name, e.target.checked)}>{field.label}</Checkbox>
      </div>)}
    </div>
  </div>
};

let savedTimeoutId = null;

const Amenities = (props) => {
  const { countries, property, selectedAmenities, getProperty, amenities, fetchAllAmenities, userLanguageId } = props;

  const [fields, setFields] = useState([]);
  const [values, setValues] = useState({});
  const [isSaved, setSaved] = useState(null);
  const t = useFormatMessage();

  function getFieldByName(fieldName) {
    return fields.find(field => field.name === fieldName) || {};
  }

  function getFieldIndexByName(fieldName) {
    return fields.findIndex(field => field.name === fieldName);
  }

  useEffect(() => {
    getProperty();
    fetchAllAmenities({userLanguageId});
  }, []);

  useEffect(() => {
    if (amenities) {
      const parsedFieldsData = amenities.map(amenity => ({
          name: amenity.code,
          value: amenity.code,
          label: amenity.name,
          category_id: amenity.categoryId,
          visible: amenity.visible
      }));

      const sortedFields = parsedFieldsData.sort((a,b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0));

      setFields(sortedFields);
    }
  }, [amenities]);

  useEffect(() => {
    if (property && fields) {

      if (property.objectId == null) {
        props.history.push('/property/name');
        return;
      }

      const values = fields.reduce((values, field) => {
        return {
          ...values,
          [field.name]: field.unserialize ?  field.unserialize(selectedAmenities[field.name]) : selectedAmenities[field.name]
        }
      }, {});

      setValues(values);
    }
  }, [property, fields]);


  function handleChangeSelect(fieldName, newValue) {
    const values = handleChange(fieldName, newValue);

    values.objectId = property.objectId;
    values.hotelName = property.name;

    const codes = [];
    Object.entries(values).forEach(([key, value]) => value === true && codes.push(key))

    if(codes.length) {
      values.codes = codes;

      updatePropertyXML(values, AMENITIES).then(res => {

        if (res.status && res.status === 'Success') {
          const validValues = {};
          Object.entries(res.result).forEach(([key, value]) => !isNaN(key) && value !== undefined && (validValues[key] = value));

          props.updatePropertyState({...property, amenities: validValues});

          showNotification({message:'Saved'});

          setSaved(true);
          setTimeout(() => {
            setSaved(null);
          }, 1500);
        };
      });
    }
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


  return (
    <div className="cb-name-content-wrapper property-amenities">
      <div className="breadcrumb-wrapper">
        <span>{t({id: 'app.property.amenities.amenities'})}</span>
      </div>

      <div className="property-form-wrapper">
        {/* <div className="form-title-wrapper form-title-wrapper-no-margin form-title-wrapper-height-10 form-title-wrapper-flex-end">
          <span className={classNames('form-tip', { 'form-tip-visible': isSaved })}>{t({id: 'app.common.saved'})}</span>
        </div> */}
        {CATEGORIES.map((category, index) => <div className="category" key={index}>
            <h3 className="category__title">{t({id: category.name})}</h3>
            <Checkboxes
              fields={fields.filter(field => field.visible && field.category_id === category.id)}
              onChange={handleChangeSelect}
              values={values}
            />
          </div>)}
        <Row gutter={[20, 0]} className='navigation'>
          <Col span={12}>
            <Link to="/property/pictures">
              <Button  type='link'>{t({id: 'app.common.back'})}</Button>
            </Link>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
          </Col>
        </Row>
      </div>
    </div >
  )
};

const mapStateToProps = ({ property: propertyState, amenities: amenitiesState, settings }) => {
  const { property } = propertyState;
  const { amenities } = amenitiesState;
  const { locale } = settings;

  return {
    property,
    amenities,
    selectedAmenities: (property && property.amenities || []),
    userLanguageId: locale && locale.userLanguageId || 2
  }
};

export default connect(mapStateToProps, { updateProperty, getProperty, fetchAllAmenities, updatePropertyState })(Amenities);
