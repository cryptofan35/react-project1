import React from 'react';
import './styles.less';

const FieldLabel = ({ text = '', isRequired = false }) => {
  return (
    <div className={'label'}>
      <p>{text}</p>
      {isRequired && <p className={'label_required'}>*</p>}
      <p>:</p>
    </div>
  )
};

export default FieldLabel;