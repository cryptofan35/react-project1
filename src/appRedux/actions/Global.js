import { getUser } from "./Auth";
import {
  getChannelManagers,
  getCountries,
  getCurrencies,
  getLanguages,
  getTypes
} from "./Data";
import { getProperty, getUserProperties } from "./Property";

export const SET_APP_LOADING = "SET_APP_LOADING";

export const GET_INITIAL_APP_DATA_REQUEST = "GET_INITIAL_APP_DATA_REQUEST";
export const GET_INITIAL_APP_DATA_SUCCESS = "GET_INITIAL_APP_DATA_SUCCESS";
export const GET_INITIAL_APP_DATA_FAILED = "GET_INITIAL_APP_DATA_FAILED";

export function setAppLoading(payload) {
  return { type: SET_APP_LOADING, payload };
}

function getInitialAppDataRequest(payload) {
  return { type: GET_INITIAL_APP_DATA_REQUEST, payload };
}

function getInitialAppDataSuccess(payload) {
  return { type: GET_INITIAL_APP_DATA_SUCCESS, payload };
}

function getInitialAppDataFailed(payload) {
  return { type: GET_INITIAL_APP_DATA_FAILED, payload };
}

export function getInitialAppData() {
  return async dispatch => {
    try {
      dispatch(getInitialAppDataRequest());

      const { result } = await dispatch(getUser());
      if (result) {
        await Promise.all([
          dispatch(getProperty()),
          dispatch(getUserProperties()),
          dispatch(getCurrencies()),
          dispatch(getTypes()),
          dispatch(getCountries()),
          dispatch(getChannelManagers()),
          dispatch(getLanguages())
        ]);
      }

      dispatch(getInitialAppDataSuccess());
    } catch (error) {
      dispatch(getInitialAppDataFailed(error));
    }
  };
}
