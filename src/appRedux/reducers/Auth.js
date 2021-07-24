import Axios from "axios";
import {
  INIT_URL,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET,
  UPDATE_USER_DATA,
  UPDATE_USER_PASSWORD,
  REFRESHING_TOKEN,
  DONE_REFRESHING_TOKEN,
  ERROR_REFRESHING_TOKEN
} from "../../constants/ActionTypes";
import axios from "../../util/Api";

function getInitialState() {
  const INIT_STATE = {
    token: JSON.parse(sessionStorage.getItem("token")),
    refreshToken: JSON.parse(sessionStorage.getItem("refreshToken")),
    initURL: "",
    user: JSON.parse(sessionStorage.getItem("user"))
  };
  axios.defaults.headers.common["Authorization"] = "Bearer " + INIT_STATE.token;

  return INIT_STATE;
}

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case INIT_URL: {
      return { ...state, initURL: action.payload };
    }

    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        token: null,
        user: null,
        refreshToken: null,
      };
    }

    case USER_DATA: {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    }

    case USER_TOKEN_SET: {
      return {
        ...state,
        token: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    }

    case REFRESHING_TOKEN: {
      return {
        ...state,
        freshTokenPromise: action.freshTokenPromise
      }
    }

    case DONE_REFRESHING_TOKEN: {
      return {
        ...state,
        freshTokenPromise: null,
      }
    }

    case ERROR_REFRESHING_TOKEN: {
      return {
        ...state,
        freshTokenPromise: null
      }
    }

    case UPDATE_USER_DATA: {
      console.log(action.payload);
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    }
    default:
      return state;
  }
};
