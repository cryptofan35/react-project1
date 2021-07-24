import {
  SWITCH_LANGUAGE,
} from "constants/ActionTypes";
import { GERMAN_LOCALE, ENGLISH_LOCALE } from "../../constants/Locales";
import moment from 'moment';
import momentDE from 'moment/locale/de';
import momentEN from 'moment/locale/en-gb';

const LOCALES = [ENGLISH_LOCALE, GERMAN_LOCALE];

const initialSettings = {
  pathname: "",
  locale: ENGLISH_LOCALE
};

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE":
      return {
        ...state,
        pathname: action.payload.pathname
      };
    case SWITCH_LANGUAGE:
      const locale = LOCALES.find(({ languageId }) => languageId === action.payload);
      moment.locale(locale.locale);
      if (locale.locale === 'en') {
        moment.updateLocale(locale.locale, momentEN);
      } else {
        moment.updateLocale(locale.locale, momentDE);
      }
      return {
        ...state,
        locale
      };
    default:
      return state;
  }
};

export default settings;
