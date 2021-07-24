import React from 'react';

const Breadcrumb = ({ title }) => {
  return (
    <div className="breadcrumb-wrapper">
      <span>{title}</span>
    </div>
  )
};

export default Breadcrumb;