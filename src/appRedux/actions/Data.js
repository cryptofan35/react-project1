import { CURRENCIES_DATA, TYPES_DATA, COUNTRIES_DATA, LANGUAGES_DATA, CHANNEL_MANAGERS_DATA, PICTURE_TYPES, PICTURES_DATA, PICTURE_DELETE } from "../../constants/ActionTypes";
import axios from 'util/Api'

export const getCurrencies = () => {
  return (dispatch) => {
    return axios.get('data/currencies')
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: CURRENCIES_DATA, payload: data.currencies });
        }
      }).catch(function (error) {
        dispatch({ type: CURRENCIES_DATA, payload: [] });
        console.log("Error****:", error.message);
      });
  }
};

export const getTypes = () => {
  return (dispatch) => {
    return axios.get('data/types')
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: TYPES_DATA, payload: data.types });
        }
      }).catch(function (error) {
        dispatch({ type: TYPES_DATA, payload: [] });
        console.log("Error****:", error.message);
      });
  }
};

export const getLanguages = () => {
  return (dispatch) => {
    return axios.get('data/languages')
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: LANGUAGES_DATA, payload: data.languages });
        }
      }).catch(function (error) {
        dispatch({ type: LANGUAGES_DATA, payload: [] });
        console.log("Error****:", error.message);
      });
  }
};

export const getChannelManagers = () => {
  return (dispatch) => {
    return axios.get('data/chanel-managers')
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: CHANNEL_MANAGERS_DATA, payload: data.managers });
        }
      }).catch(function (error) {
        dispatch({ type: CHANNEL_MANAGERS_DATA, payload: [] });
        console.log("Error****:", error.message);
      });
  }
};

export const getCountries = () => {
  return (dispatch) => {
    return axios.get('data/countries')
      .then(({ data }) => {
        if (data.result) {
          dispatch({
            type: COUNTRIES_DATA,
            payload: {
              countries: data.countries,
              regions: data.regions
            }
          });
        }
      }).catch(function (error) {
        dispatch({
          type: COUNTRIES_DATA,
          payload: {
            countries: [],
            regions: []
          }
        });
        console.log("Error****:", error.message);
      });
  }
};
