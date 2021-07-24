import {
  GET_BUYERS_ORIGIN_FAILURE,
  GET_BUYERS_ORIGIN_REQUEST,
  GET_BUYERS_ORIGIN_SUCCESS,
  GET_BUYERS_TOTAL_FAILURE,
  GET_BUYERS_TOTAL_REQUEST,
  GET_BUYERS_TOTAL_SUCCESS
} from "../actions/Buyers";

const INITIAL_STATE = {
  buyersTotal: {
    data: null,
    loading: false,
    error: null,
  },
  buyersOrigin: {
    data: null,
    loading: false,
    error: null,
  },
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_BUYERS_TOTAL_REQUEST:
      return {
        ...state,
        buyersTotal: {
          ...state.buyersTotal,
          loading: true,
        },
      };
    case GET_BUYERS_TOTAL_SUCCESS:
      return {
        ...state,
        buyersTotal: {
          ...state.buyersTotal,
          loading: false,
          data: payload,
        },
      };
    case GET_BUYERS_TOTAL_FAILURE:
      return {
        ...state,
        buyersTotal: {
          ...state.buyersTotal,
          loading: false,
          error: payload,
        },
      };
    case GET_BUYERS_ORIGIN_REQUEST:
      return {
        ...state,
        buyersOrigin: {
          ...state.buyersOrigin,
          loading: true,
        },
      };
    case GET_BUYERS_ORIGIN_SUCCESS:
      return {
        ...state,
        buyersOrigin: {
          ...state.buyersOrigin,
          loading: false,
          data: payload,
        },
      };
    case GET_BUYERS_ORIGIN_FAILURE:
      return {
        ...state,
        buyersOrigin: {
          ...state.buyersOrigin,
          loading: false,
          error: payload,
        },
      };
    default:
      return state;
  }
}
