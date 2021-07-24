import AppLocale from 'lngProvider';
import {store} from '../appRedux/store';

const translate = (message) => {
  const {
    settings: {
      locale: {
        locale
      }
    }
  } = store.getState();
  const {messages} = AppLocale[locale] || {messages:[]}
  message = messages[message] || message;
  return message;
}

export default translate;