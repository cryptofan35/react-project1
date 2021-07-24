"use strict";

export const requiredValidator = errMsg => value => {
  if (!value) {
    return errMsg;
  }

  if (typeof value === 'string' && !value.trim()) {
    return errMsg;
  }
  return '';
};

export const emailValidator = (emailMsg) => value => {
  if (!value) {
    return '';
  }
  const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex, no-useless-escape, max-len

  return pattern.test(value) ? "" : emailMsg;
};


export const correctPwdValidator = (reqMsg, pwdMsg) => value => {

  if (value === 'Request failed with status code 400') {
    return pwdMsg;
  }

  if (!value) {
    return reqMsg;
  }

  return '';
};

export const newPwdValidator = (reqMsg, pwdMsg) => value => {
  if (!value) {
    return reqMsg;
  }

  const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[-_!@#\$%\^&\*])(?=.{8,})/;
  return pattern.test(value) ? "" : pwdMsg;
};

export const latLngValidator = errMsg => value => {
  if (!value) {
    return '';
  }
  const numberValue = +value;

  return typeof numberValue === 'number' && !isNaN(numberValue) && numberValue >= -90 && numberValue <= 90 ? '' : errMsg;
};

export const phoneValidator = errMsg => value => {
  if (!value) {
    return '';
  }
  value = typeof value === 'string' ? value.trim() : value;
  const pattern = /^[0-9]{5,15}$/im;

  return pattern.test(value) ? '' : errMsg;
};

export const siteValidator = errMsg => value => {
  if (!value) {
    return '';
  }
  value = typeof value === 'string' ? value.trim() : value;
  const pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

  return pattern.test(value) ? '' : errMsg;
};

export const starsValidator = errMsg => value => {
  if (!value) {
    return '';
  }
  const numberValue = +value;

  return typeof numberValue === 'number' && !isNaN(numberValue) && numberValue >= 1 && numberValue <= 7 ? '' : errMsg;
};

export const zoomValidator = errMsg => value => {
  if (!value || value == '0') {
    return '';
  }
  const numberValue = +value;

  return typeof numberValue === 'number' && !isNaN(numberValue) && numberValue >= 1 && value <= 20 ? '' : errMsg;
};

export const minNumberValidator = min => ({ message }, value) => {
  const intVal = parseInt(value) || 0;

  if(intVal > min) {
    return Promise.resolve();
  }

  return Promise.reject(message);
}

export const charLimitValidator = (errMsg, charLimit) => value => {
  if (!value) {
    return '';
  }

  const composedErrorMessage = errMsg.split('%%%').join(charLimit);

  return value.length <= charLimit ? '' : composedErrorMessage;
};
