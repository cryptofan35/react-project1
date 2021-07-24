import {
  GET_DASHBOARD_VOUCHERS_DATA_FAILURE,
  GET_DASHBOARD_VOUCHERS_DATA_REQUEST, GET_DASHBOARD_VOUCHERS_DATA_SUCCESS,
  GET_DASHBOARD_VOUCHERS_OVERVIEW_FAILURE,
  GET_DASHBOARD_VOUCHERS_OVERVIEW_REQUEST,
  GET_DASHBOARD_VOUCHERS_OVERVIEW_SUCCESS,
  GET_DASHBOARD_VOUCHERS_TOTAL_FAILURE,
  GET_DASHBOARD_VOUCHERS_TOTAL_REQUEST,
  GET_DASHBOARD_VOUCHERS_TOTAL_SUCCESS,
  GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_FAILURE,
  GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_REQUEST,
  GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_SUCCESS,
} from "../actions/DashboardVouchers";

const INITIAL_STATE = {
  vouchersOverview: {
    data: null,
    loading: false,
    error: null,
  },
  totalVouchers: {
    data: null,
    loading: false,
    error: null,
  },
  yetToRedeemVouchers: {
    data: null,
    loading: false,
    error: null,
  },
  totalData: {
    data: null,
    loading: false,
    error: null,
  },
}

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_DASHBOARD_VOUCHERS_OVERVIEW_REQUEST:
      return {
        ...state,
        vouchersOverview: {
          ...state.vouchersOverview,
          loading: true,
        },
      };
    case GET_DASHBOARD_VOUCHERS_OVERVIEW_SUCCESS:
      return {
        ...state,
        vouchersOverview: {
          ...state.vouchersOverview,
          data: payload,
          loading: false,
        },
      };
    case GET_DASHBOARD_VOUCHERS_OVERVIEW_FAILURE:
      return {
        ...state,
        vouchersOverview: {
          ...state.vouchersOverview,
          loading: false,
          error: payload,
        },
      };
    case GET_DASHBOARD_VOUCHERS_TOTAL_REQUEST:
      return {
        ...state,
        totalVouchers: {
          ...state.totalVouchers,
          loading: true,
        },
      };
    case GET_DASHBOARD_VOUCHERS_TOTAL_SUCCESS:
      return {
        ...state,
        totalVouchers: {
          ...state.totalVouchers,
          loading: false,
          data: payload,
        },
      };
    case GET_DASHBOARD_VOUCHERS_TOTAL_FAILURE:
      return {
        ...state,
        totalVouchers: {
          ...state.totalVouchers,
          loading: false,
          error: payload,
        },
      };
    case GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_REQUEST:
      return {
        ...state,
        yetToRedeemVouchers: {
          ...state.yetToRedeemVouchers,
          loading: true,
        },
      };
    case GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_SUCCESS:
      return {
        ...state,
        yetToRedeemVouchers: {
          ...state.yetToRedeemVouchers,
          loading: false,
          data: payload,
        },
      };
    case GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_FAILURE:
      return {
        ...state,
        yetToRedeemVouchers: {
          ...state.yetToRedeemVouchers,
          loading: false,
          error: payload,
        },
      };
    case GET_DASHBOARD_VOUCHERS_DATA_REQUEST:
      return {
        ...state,
        totalData: {
          ...state.totalData,
          loading: true,
        },
      };
    case GET_DASHBOARD_VOUCHERS_DATA_SUCCESS:
      return {
        ...state,
        totalData: {
          ...state.totalData,
          loading: false,
          data: payload,
        },
      };
    case GET_DASHBOARD_VOUCHERS_DATA_FAILURE:
      return {
        ...state,
        totalData: {
          ...state.totalData,
          loading: false,
          error: payload,
        },
      };
    default:
      return state;
  }
}
