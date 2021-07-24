import React from 'react';
import FieldLabel from "../FieldLabel";
import './styles.less';

const Field = ({ children, label = '', isWide = false, error = '', isRequired = false, className = '' }) => {
  return (
    <div
      className={`field ${error ? 'field-error' : ''} ${className}`}
      style={{
        width: isWide ? '100%' : 'auto'
      }}
    >
      {label && (
        <FieldLabel
          text={label}
          isRequired={isRequired}
        />
      )}
      {children}
      {error && <span className={'field-error-label'}>{error}</span>}
    </div>
  )
};

export default Field;
