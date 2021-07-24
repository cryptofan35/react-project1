import React from 'react';
import CheckCircleOutline from '@2fd/ant-design-icons/lib/CheckCircleOutline';
import { toastr } from 'react-redux-toastr'
import translate from 'util/translate'

export const showNotification = ({ message = '', type = 'success' }, options = {}) => {
  const defaultOptions = {
    icon: <CheckCircleOutline />,
    showCloseButton: false,
    ...options
  };

  message = translate(message);

  switch (type) {
    case 'success':
      toastr.success(message, defaultOptions);
      break;
    case 'error':
      toastr.error(message, defaultOptions);
      break;
    default:
      break;
  }
}