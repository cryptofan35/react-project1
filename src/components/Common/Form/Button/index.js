import React from 'react';

const SecondaryButton = ({ isShow = true, onClick }) => {
  if (!isShow) {
    return null;
  }
  
  return (
    <button
      onClick={onClick}
      className={'formik-footer-secondary'}
    >
      Cancel
    </button>
  )
};

export default SecondaryButton;
