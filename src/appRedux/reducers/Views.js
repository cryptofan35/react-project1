import {
  GET_LAST_30_DAYS_FAILURE,
  GET_LAST_30_DAYS_REQUEST,
  GET_LAST_30_DAYS_SUCCESS,
  GET_VIEWS_DATA_FAILURE,
  GET_VIEWS_DATA_REQUEST,
  GET_VIEWS_DATA_SUCCESS,
} from "../actions/Views";

const INITIAL_STATE = {
  runningOffers: {
    data: null,
    loading: false,
    error: null,
  },
  last30Days: {
    data: null,
    loading: false,
    error: null,
  }
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_VIEWS_DATA_REQUEST:
      return {
        ...state,
        runningOffers: {
          ...state.runningOffers,
          loading: true,
        },
      };
    case GET_VIEWS_DATA_SUCCESS:
      return {
        ...state,
        runningOffers: {
          ...state.runningOffers,
          loading: false,
          data: payload,
        },
      };
    case GET_VIEWS_DATA_FAILURE:
      return {
        ...state,
        runningOffers: {
          ...state.runningOffers,
          loading: false,
          error: payload,
        },
      };
    case GET_LAST_30_DAYS_REQUEST:
      return {
        ...state,
        last30Days: {
          ...state.last30Days,
          loading: true,
        },
      };
    case GET_LAST_30_DAYS_SUCCESS:
      return {
        ...state,
        last30Days: {
          ...state.last30Days,
          loading: false,
          data: payload,
        },
      };
    case GET_LAST_30_DAYS_FAILURE:
      return {
        ...state,
        last30Days: {
          ...state.last30Days,
          loading: false,
          error: payload,
        },
      };
    default:
      return state;
  }
}
