import { cultbayReportsApi } from "../../util/Api";

export const GET_RUNNING_OFFERS_REQUEST = "GET_RUNNING_OFFERS_REQUEST";
export const GET_RUNNING_OFFERS_SUCCESS = "GET_RUNNING_OFFERS_SUCCESS";
export const GET_RUNNING_OFFERS_FAILURE = "GET_RUNNING_OFFERS_FAILURE";

export const GET_TOP_OFFERS_REQUEST = "GET_TOP_OFFERS_REQUEST";
export const GET_TOP_OFFERS_SUCCESS = "GET_TOP_OFFERS_SUCCESS";
export const GET_TOP_OFFERS_FAILURE = "GET_TOP_OFFERS_FAILURE";

export const GET_MARKET_PLACES_REQUEST = "GET_MARKET_PLACES_REQUEST";
export const GET_MARKET_PLACES_SUCCESS = "GET_MARKET_PLACES_SUCCESS";
export const GET_MARKET_PLACES_FAILURE = "GET_MARKET_PLACES_FAILURE";

function getRunningOffersRequest(payload) {
  return { type: GET_RUNNING_OFFERS_REQUEST, payload };
}

function getRunningOffersSuccess(payload) {
  return { type: GET_RUNNING_OFFERS_SUCCESS, payload };
}

function getRunningOffersFailure(payload) {
  return { type: GET_RUNNING_OFFERS_FAILURE, payload };
}

function getTopOffersRequest(payload) {
  return { type: GET_TOP_OFFERS_REQUEST, payload };
}

function getTopOffersSuccess(payload) {
  return { type: GET_TOP_OFFERS_SUCCESS, payload };
}

function getTopOffersFailure(payload) {
  return { type: GET_TOP_OFFERS_FAILURE, payload };
}

function getMarketPlacesRequest(payload) {
  return { type: GET_MARKET_PLACES_REQUEST, payload };
}

function getMarketPlacesSuccess(payload) {
  return { type: GET_MARKET_PLACES_SUCCESS, payload };
}

function getMarketPlacesFailure(payload) {
  return { type: GET_MARKET_PLACES_FAILURE, payload };
}

const getRunningOffers = (id) => {
  return dispatch => {
    dispatch(getRunningOffersRequest());

    return cultbayReportsApi.get(`${id}/RunningOffers`)
      .then(({data}) => {
        dispatch(getRunningOffersSuccess(data));
      })
      .catch(error => {
        dispatch(getRunningOffersFailure(error));
      })
  }
}

const getTopOffers = (id) => {
  return dispatch => {
    dispatch(getTopOffersRequest());

    return cultbayReportsApi.get(`${id}/PastOffers/marketplaces/topoffers`)
      .then(({data}) => {
        dispatch(getTopOffersSuccess(data));
      })
      .catch(error => {
        dispatch(getTopOffersFailure(error));
      })
  }
}

export const getMarketPlaces = (id) => {
  return dispatch => {
    dispatch(getMarketPlacesRequest());

    return cultbayReportsApi.get(`${id}/PastOffers/marketplaces`)
      .then(({data}) => {
        dispatch(getMarketPlacesSuccess(data));
      })
      .catch(error => {
        dispatch(getMarketPlacesFailure(error));
      })
  }
}

export const getRunningPackages = (id) => {
  return async dispatch => {
    try {
      await Promise.all([
        dispatch(getRunningOffers(id)),
        dispatch(getTopOffers(id)),
        dispatch(getMarketPlaces(id)),
      ]);
    } catch (error) {
      console.log(error);
    }
  }
}
