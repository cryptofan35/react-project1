import {
  GET_INITIAL_APP_DATA_FAILED,
  GET_INITIAL_APP_DATA_REQUEST,
  GET_INITIAL_APP_DATA_SUCCESS,
  SET_APP_LOADING
} from "../actions/Global";

const initialState = {
  appLoading: false,
  error: null,
  initialDataLoaded: false
};

export default function GlobalReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_APP_LOADING:
      return {
        ...state,
        appLoading: payload
      };
    case GET_INITIAL_APP_DATA_REQUEST:
      return {
        ...state,
        appLoading: true
      };
    case GET_INITIAL_APP_DATA_SUCCESS:
      return {
        ...state,
        appLoading: false,
        initialDataLoaded: true
      };
    case GET_INITIAL_APP_DATA_FAILED:
      return {
        ...state,
        appLoading: false,
        error: payload,
        initialDataLoaded: false
      };
    default:
      return { ...state };
  }
}
