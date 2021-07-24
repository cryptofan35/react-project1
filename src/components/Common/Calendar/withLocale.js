import React from 'react';
import { ConfigProvider } from "antd";
import en_GB from 'antd/lib/locale-provider/en_GB';

const LocaleCalendar = ({ children }) => {
  return (
    <ConfigProvider locale={en_GB}>
      {children}
    </ConfigProvider>
  )
};

export default LocaleCalendar;