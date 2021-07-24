import React from 'react';
import './styles.less';

const PackagesCalendarHint = ({ color = '', title = '', label = '', className = '', icon = '' }) => {
  return (
    <div className={`${className}--hints--item Hint`}>
      {color && (
        <div
          className={`${className}--hints--item--circle Hint--circle`}
          style={{
            backgroundColor: color
          }}
        />
      )}
      {label && (
        <p>{label}</p>
      )}
      {icon && (
        <div className={'Hint-icon'}>
          <img src={icon} alt={label}/>
        </div>
      )}
      <span>- {title}</span>
    </div>
  )
}

export default PackagesCalendarHint;