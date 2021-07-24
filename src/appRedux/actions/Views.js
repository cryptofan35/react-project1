import moment from "moment";
import { cultbayReportsApi } from "../../util/Api";

export const GET_VIEWS_DATA_REQUEST = "GET_VIEWS_DATA_REQUEST";
export const GET_VIEWS_DATA_SUCCESS = "GET_VIEWS_DATA_SUCCESS";
export const GET_VIEWS_DATA_FAILURE = "GET_VIEWS_DATA_FAILURE";

export const GET_LAST_30_DAYS_REQUEST = "GET_LAST_30_DAYS_REQUEST";
export const GET_LAST_30_DAYS_SUCCESS = "GET_LAST_30_DAYS_SUCCESS";
export const GET_LAST_30_DAYS_FAILURE = "GET_LAST_30_DAYS_FAILURE";

function getViewsDataRequest(payload) {
  return { type: GET_VIEWS_DATA_REQUEST, payload };
}

function getViewsDataSuccess(payload) {
  return { type: GET_VIEWS_DATA_SUCCESS, payload };
}

function getViewsDataFailure(payload) {
  return { type: GET_VIEWS_DATA_FAILURE, payload };
}

function getLast30DaysRequest(payload) {
  return { type: GET_LAST_30_DAYS_REQUEST, payload };
}

function getLast30DaysSuccess(payload) {
  return { type: GET_LAST_30_DAYS_SUCCESS, payload };
}

function getLast30DaysFailure(payload) {
  return { type: GET_LAST_30_DAYS_FAILURE, payload };
}

const getViewsData = (id) => {
  return dispatch => {
    dispatch(getViewsDataRequest());

    return cultbayReportsApi.get(`${id}/views`)
      .then(({data}) => {
        dispatch(getViewsDataSuccess(data));
      })
      .catch(error => {
        dispatch(getViewsDataFailure(error));
      })
  }
}

const getLast30Days = (id) => {
  return dispatch => {
    dispatch(getLast30DaysRequest());
    const fromDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');

    return cultbayReportsApi.get(`${id}/views/${fromDate}/${toDate}`)
      .then(({data}) => {
        dispatch(getLast30DaysSuccess(data));
      })
      .catch(error => {
        dispatch(getLast30DaysFailure(error));
      })
  }
}

export const getViews = (id) => {
  return async dispatch => {
    try {
      await Promise.all([
        dispatch(getViewsData(id)),
        dispatch(getLast30Days(id)),
      ])
    } catch (error) {
      console.log(error);
    }
  }
}
