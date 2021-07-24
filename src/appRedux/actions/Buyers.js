import moment from "moment";
import { cultbayReportsApi } from "../../util/Api";

export const GET_BUYERS_TOTAL_REQUEST = "GET_BUYERS_TOTAL_REQUEST";
export const GET_BUYERS_TOTAL_SUCCESS = "GET_BUYERS_TOTAL_SUCCESS";
export const GET_BUYERS_TOTAL_FAILURE = "GET_BUYERS_TOTAL_FAILURE";

export const GET_BUYERS_ORIGIN_REQUEST = "GET_BUYERS_ORIGIN_REQUEST";
export const GET_BUYERS_ORIGIN_SUCCESS = "GET_BUYERS_ORIGIN_SUCCESS";
export const GET_BUYERS_ORIGIN_FAILURE = "GET_BUYERS_ORIGIN_FAILURE";

function getBuyersTotalRequest(payload) {
  return { type: GET_BUYERS_TOTAL_REQUEST, payload };
}

function getBuyersTotalSuccess(payload) {
  return { type: GET_BUYERS_TOTAL_SUCCESS, payload };
}

function getBuyersTotalFailure(payload) {
  return { type: GET_BUYERS_TOTAL_FAILURE, payload };
}

function getBuyersOriginRequest(payload) {
  return { type: GET_BUYERS_ORIGIN_REQUEST, payload };
}

function getBuyersOriginSuccess(payload) {
  return { type: GET_BUYERS_ORIGIN_SUCCESS, payload };
}

function getBuyersOriginFailure(payload) {
  return { type: GET_BUYERS_ORIGIN_FAILURE, payload };
}

const getBuyersTotal = (id) => {
  return dispatch => {
    dispatch(getBuyersTotalRequest());
    const fromDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD')

    return cultbayReportsApi.get(`${id}/buyersoverview/${fromDate}/${toDate}`)
      .then(({data}) => {
        dispatch(getBuyersTotalSuccess(data));
      })
      .catch(error => {
        dispatch(getBuyersTotalFailure(error));
      })
  }
}

const getBuyersOrigin = (id) => {
  return dispatch => {
    dispatch(getBuyersOriginRequest());
    const fromDate = moment().subtract(1, 'year').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD')

    return cultbayReportsApi.get(`${id}/buyersorigin/${fromDate}/${toDate}`)
      .then(({data}) => {
        dispatch(getBuyersOriginSuccess(data));
      })
      .catch(error => {
        dispatch(getBuyersOriginFailure(error));
      })
  }
}

export const getBuyers = (id) => {
  return async dispatch => {
    try {
      await Promise.all([
        dispatch(getBuyersTotal(id)),
        dispatch(getBuyersOrigin(id)),
      ])
    } catch (error) {
      console.log(error);
    }
  }
}
