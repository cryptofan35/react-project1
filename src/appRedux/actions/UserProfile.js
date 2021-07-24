import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  UPDATE_USER_DATA,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_DEFAULT_LANGUAGE,
  SWITCH_LANGUAGE
} from "../../constants/ActionTypes";
import axios from "util/Api";

export const updateUserInDB = userData => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("profile/user", {
        ...userData
      })
      .then(({ data }) => {
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: UPDATE_USER_DATA, payload: data });
      })
      .catch(error => dispatch({ type: FETCH_ERROR, payload: error.message }));
  };
};

export function updateUserPassword(userData) {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("profile/password", {
        ...userData
      })
      .then(({ data }) => {
        dispatch({ type: FETCH_SUCCESS });
      })
      .catch(error => dispatch({ type: FETCH_ERROR, payload: error.message }));
  };
}

export const updateUserLng = lngData => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("profile/language", {
        ...lngData
      })
      .then(({ data }) => {
        dispatch({ type: FETCH_SUCCESS });
        dispatch({ type: UPDATE_USER_DEFAULT_LANGUAGE, payload: data });
        dispatch({ type: SWITCH_LANGUAGE, payload: data.language_id });
      })
      .catch(error => dispatch({ type: FETCH_ERROR, payload: error.message }));
  };
};
