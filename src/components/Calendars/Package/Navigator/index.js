import React from 'react';
import NavigatorButton from "./button";
import './styles.less';

const CalendarNavigator = ({ step, onNavigate }) => {
  return (
    <div className={'CalendarNavigator'}>
      <div className={'CalendarNavigator--side__left'}>
        <NavigatorButton
          isActive={step > 2}
          onclick={() => {
            onNavigate(-3);
          }}
          isDouble
        />
        <NavigatorButton
          isActive={step > 0}
          onclick={() => {
            onNavigate(-1);
          }}
        />
      </div>
      <div className={'CalendarNavigator--side__right'}>
        <NavigatorButton
          onclick={() => {
            onNavigate(1);
          }}
        />
        <NavigatorButton
          isDouble
          onclick={() => {
            onNavigate(3);
          }}
        />
      </div>
    </div>
  )
};

export default CalendarNavigator;