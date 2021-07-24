import React from 'react';
import Breadcrumb from "../Breadcrumb";
import './styles.less';

const Page = ({ children, className = '', title = '', styles = {} }) => {
  return (
    <div className={`cb-name-content-wrapper Page ${className}`} style={styles}>
      <Breadcrumb title={title}/>
      <div
        className="property-form-wrapper"
        style={{
          padding: '30px 25px 23px'
        }}
      >
        {children}
      </div>
    </div>
  )
};

export default Page