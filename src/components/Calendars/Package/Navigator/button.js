import React from 'react';

const NavigatorButton = ({ isDouble = false, isActive = true, onclick }) => {
  return (
    <button
      className={'CalendarNavigator--btn'}
      onClick={onclick}
      disabled={!isActive}
    >
      <div className={'CalendarNavigator--btn--icon'}>
        <i/>
        {isDouble && <i/>}
      </div>
    </button>
  )
};

export default NavigatorButton;