import {
  GET_MARKET_PLACES_FAILURE,
  GET_MARKET_PLACES_REQUEST,
  GET_MARKET_PLACES_SUCCESS,
  GET_RUNNING_OFFERS_FAILURE,
  GET_RUNNING_OFFERS_REQUEST,
  GET_RUNNING_OFFERS_SUCCESS,
  GET_TOP_OFFERS_FAILURE,
  GET_TOP_OFFERS_REQUEST,
  GET_TOP_OFFERS_SUCCESS,
} from "../actions/RunningPackages";

const INITIAL_STATE = {
  runningOffers: {
    data: null,
    loading: false,
    error: null,
  },
  topOffers: {
    data: null,
    loading: false,
    error: null,
  },
  marketPlaces: {
    data: null,
    loading: false,
    error: null,
  }
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_RUNNING_OFFERS_REQUEST:
      return {
        ...state,
        runningOffers: {
          ...state.runningOffers,
          loading: true,
        },
      };
    case GET_RUNNING_OFFERS_SUCCESS:
      return {
        ...state,
        runningOffers: {
          ...state.runningOffers,
          data: payload,
          loading: false,
        },
      };
    case GET_RUNNING_OFFERS_FAILURE:
      return {
        ...state,
        runningOffers: {
          ...state.runningOffers,
          loading: false,
          error: payload,
        },
      };
    case GET_TOP_OFFERS_REQUEST:
      return {
        ...state,
        topOffers: {
          ...state.topOffers,
          loading: true,
        },
      };
    case GET_TOP_OFFERS_SUCCESS:
      return {
        ...state,
        topOffers: {
          ...state.topOffers,
          data: payload,
          loading: false,
        },
      };
    case GET_TOP_OFFERS_FAILURE:
      return {
        ...state,
        topOffers: {
          ...state.topOffers,
          error: payload,
        },
      };
    case GET_MARKET_PLACES_REQUEST:
      return {
        ...state,
        marketPlaces: {
          ...state.marketPlaces,
          loading: true,
        },
      };
    case GET_MARKET_PLACES_SUCCESS:
      return {
        ...state,
        marketPlaces: {
          ...state.marketPlaces,
          data: payload,
          loading: false,
        },
      };
    case GET_MARKET_PLACES_FAILURE:
      return {
        ...state,
        marketPlaces: {
          ...state.marketPlaces,
          loading: false,
          error: payload,
        },
      };
    default:
      return state;
  }
}
