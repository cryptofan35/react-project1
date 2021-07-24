import {
  SWITCH_LANGUAGE,
} from "constants/ActionTypes";

export function switchLanguage(locale) {
  return {
    type: SWITCH_LANGUAGE,
    payload: locale
  };
}