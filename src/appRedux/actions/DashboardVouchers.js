import moment from "moment";
import { cultbayReportsApi } from "../../util/Api";

export const GET_DASHBOARD_VOUCHERS_OVERVIEW_REQUEST =
  "GET_DASHBOARD_VOUCHERS_OVERVIEW_REQUEST";
export const GET_DASHBOARD_VOUCHERS_OVERVIEW_SUCCESS =
  "GET_DASHBOARD_VOUCHERS_OVERVIEW_SUCCESS";
export const GET_DASHBOARD_VOUCHERS_OVERVIEW_FAILURE =
  "GET_DASHBOARD_VOUCHERS_OVERVIEW_FAILURE";

export const GET_DASHBOARD_VOUCHERS_TOTAL_REQUEST =
  "GET_DASHBOARD_VOUCHERS_TOTAL_REQUEST";
export const GET_DASHBOARD_VOUCHERS_TOTAL_SUCCESS =
  "GET_DASHBOARD_VOUCHERS_TOTAL_SUCCESS";
export const GET_DASHBOARD_VOUCHERS_TOTAL_FAILURE =
  "GET_DASHBOARD_VOUCHERS_TOTAL_FAILURE";

export const GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_REQUEST =
  "GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_REQUEST";
export const GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_SUCCESS =
  "GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_SUCCESS";
export const GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_FAILURE =
  "GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_FAILURE";

export const GET_DASHBOARD_VOUCHERS_DATA_REQUEST =
  "GET_DASHBOARD_VOUCHERS_DATA_REQUEST";
export const GET_DASHBOARD_VOUCHERS_DATA_SUCCESS =
  "GET_DASHBOARD_VOUCHERS_DATA_SUCCESS";
export const GET_DASHBOARD_VOUCHERS_DATA_FAILURE =
  "GET_DASHBOARD_VOUCHERS_DATA_FAILURE";

const urls = [
  "/fixed/last365days/",
  "/auction/last365days/",
  "/fixed/last30days/",
  "/auction/last30days/",
  "/fixed/last24hours/",
  "/auction/last24hours/",
];
const destructureResponse = (data) => ({
  last365Days: { fixed: data[0].value.fixed, auction: data[1].value.auction },
  last30Days: { fixed: data[2].value.fixed, auction: data[3].value.auction },
  last24Hours: { fixed: data[4].value.fixed, auction: data[5].value.auction },
});

function getDashboardVouchersOverviewRequest(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_OVERVIEW_REQUEST, payload };
}

function getDashboardVouchersOverviewSuccess(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_OVERVIEW_SUCCESS, payload };
}

function getDashboardVouchersOverviewFailure(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_OVERVIEW_FAILURE, payload };
}

function getDashboardVouchersTotalRequest(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_TOTAL_REQUEST, payload };
}

function getDashboardVouchersTotalSuccess(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_TOTAL_SUCCESS, payload };
}

function getDashboardVouchersTotalFailure(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_TOTAL_FAILURE, payload };
}

function getDashboardVouchersYetToRedeemRequest(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_REQUEST, payload };
}

function getDashboardVouchersYetToRedeemSuccess(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_SUCCESS, payload };
}

function getDashboardVouchersYetToRedeemFailure(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_YET_TO_REDEEM_FAILURE, payload };
}

function getDashboardVouchersDataRequest(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_DATA_REQUEST, payload };
}

function getDashboardVouchersDataSuccess(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_DATA_SUCCESS, payload };
}

function getDashboardVouchersDataFailure(payload) {
  return { type: GET_DASHBOARD_VOUCHERS_DATA_FAILURE, payload };
}

const getDashboardVouchersOverview = (id) => {
  return (dispatch) => {
    dispatch(getDashboardVouchersOverviewRequest());

    const fromDate = moment().subtract(1, "year").format("YYYY-MM-DD");
    const toDate = moment().format("YYYY-MM-DD");

    return cultbayReportsApi
      .get(`${id}/vouchers/overview/${fromDate}/${toDate}`)
      .then(({ data }) => {
        dispatch(getDashboardVouchersOverviewSuccess(data));
      })
      .catch((error) => {
        dispatch(getDashboardVouchersOverviewFailure(error));
      });
  };
};

const getDashboardVouchersTotal = (id) => {
  return (dispatch) => {
    dispatch(getDashboardVouchersTotalRequest());

    const fromDate = moment().startOf("year").format("YYYY-MM-DD");
    const toDate = moment().format("YYYY-MM-DD");

    return cultbayReportsApi
      .get(`${id}/vouchers/distribution/${fromDate}/${toDate}`)
      .then(({ data }) => {
        dispatch(getDashboardVouchersTotalSuccess(data));
      })
      .catch((error) => {
        dispatch(getDashboardVouchersTotalFailure(error));
      });
  };
};

const getDashboardVouchersYetToRedeem = (id) => {
  return (dispatch) => {
    dispatch(getDashboardVouchersYetToRedeemRequest());

    const fromDate = moment().startOf("year").format("YYYY-MM-DD");
    const toDate = moment().format("YYYY-MM-DD");

    return cultbayReportsApi
      .get(`${id}/vouchers/yettoberedeemed/${fromDate}/${toDate}`)
      .then(({ data }) => {
        dispatch(getDashboardVouchersYetToRedeemSuccess(data));
      })
      .catch((error) => {
        dispatch(getDashboardVouchersYetToRedeemFailure(error));
      });
  };
};

const getDashboardVouchersData = (id) => (dispatch) => {
  dispatch(getDashboardVouchersDataRequest());
  return fetchAllVouchers(id)
    .then((data) => {
      const serializeData = destructureResponse(data);
      dispatch(getDashboardVouchersDataSuccess(serializeData));
    })
    .catch((error) => {
      dispatch(getDashboardVouchersDataFailure(error));
    });
};
const fetchAllVouchers = (id) => {
  return Promise.allSettled(
    urls.map((url) =>
      cultbayReportsApi.get(`/vouchers${url}${id}`).then((r) => r.data)
    )
  );
};
export const getDashboardVouchers = (id) => {
  return async (dispatch) => {
    try {
      await Promise.all([
        dispatch(getDashboardVouchersOverview(id)),
        dispatch(getDashboardVouchersTotal(id)),
        dispatch(getDashboardVouchersYetToRedeem(id)),
      ]);
      await dispatch(getDashboardVouchersData(id));
    } catch (error) {
      console.log(error);
    }
  };
};
