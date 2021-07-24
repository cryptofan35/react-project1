import showErrorMessage from "../../util/showErrorMessage";
import showSuccessMessage from "../../util/showSuccessMessage";
import {cultbayApi, cultbayChannelWebServicesApi} from "../../util/Api";
import { parseString } from 'xml2js';
import {
  redeemVoucherXML, voucherDetailsXML, voucherPreviewXML,
  vouchersXML,
  XMLDataVoucherFormatting,
  XMLDataVouchersFormatting
} from "../../constants/xmlBody";

export const GET_VOUCHERS_REQUEST = "GET_VOUCHERS_REQUEST";
export const GET_VOUCHERS_SUCCESS = "GET_VOUCHERS_SUCCESS";
export const GET_VOUCHERS_FAILED = "GET_VOUCHERS_FAILED";

export const GET_VOUCHER_BY_ID_REQUEST = "GET_VOUCHER_BY_ID_REQUEST";
export const GET_VOUCHER_BY_ID_SUCCESS = "GET_VOUCHER_BY_ID_SUCCESS";
export const GET_VOUCHER_BY_ID_FAILED = "GET_VOUCHER_BY_ID_FAILED";

export const REDEEM_VOUCHER_REQUEST = "REDEEM_VOUCHER_REQUEST";
export const REDEEM_VOUCHER_SUCCESS = "REDEEM_VOUCHER_SUCCESS";
export const REDEEM_VOUCHER_FAILED = "REDEEM_VOUCHER_FAILED";

export const GET_VOUCHER_PREVIEW_REQUEST = "GET_VOUCHER_PREVIEW_REQUEST";
export const GET_VOUCHER_PREVIEW_SUCCESS = "GET_VOUCHER_PREVIEW_SUCCESS";
export const GET_VOUCHER_PREVIEW_FAILED = "GET_VOUCHER_PREVIEW_FAILED";

function getVouchersRequest(payload) {
  return { type: GET_VOUCHERS_REQUEST, payload };
}
function getVouchersSuccess(payload) {
  return { type: GET_VOUCHERS_SUCCESS, payload };
}
function getVouchersFailed(payload) {
  return { type: GET_VOUCHERS_FAILED, payload };
}

function getVoucherByIdRequest(payload) {
  return { type: GET_VOUCHER_BY_ID_REQUEST, payload };
}
function getVoucherByIdSuccess(payload) {
  return { type: GET_VOUCHER_BY_ID_SUCCESS, payload };
}
function getVoucherByIdFailed(payload) {
  return { type: GET_VOUCHER_BY_ID_FAILED, payload };
}

function redeemVoucherRequest(payload) {
  return { type: REDEEM_VOUCHER_REQUEST, payload };
}
function redeemVoucherSuccess(payload) {
  return { type: REDEEM_VOUCHER_SUCCESS, payload };
}
function redeemVoucherFailed(payload) {
  return { type: REDEEM_VOUCHER_FAILED, payload };
}

function getVoucherPreviewRequest(payload) {
  return { type: GET_VOUCHER_PREVIEW_REQUEST, payload };
}

function getVoucherPreviewSuccess(payload) {
  return { type: GET_VOUCHER_PREVIEW_SUCCESS, payload };
}

function getVoucherPreviewFailed(payload) {
  return { type: GET_VOUCHER_PREVIEW_FAILED, payload };
}

export function getVouchers(objectId, page) {
  return async dispatch => {
    dispatch(getVouchersRequest());
    try {
      const { data } = await cultbayChannelWebServicesApi.post(
        "/ListOfVouchers",
        vouchersXML({objectId, page}),
        {headers: {'Content-Type': 'application/xml'} });

      parseString(data, (err, result) => {
        if (err) {
          dispatch(getVouchersFailed(err));
          showErrorMessage("There was an error while getting the vouchers");
        }

        dispatch(getVouchersSuccess(XMLDataVouchersFormatting(result)));
      })
    } catch (error) {
      dispatch(getVouchersFailed(error.response));
      showErrorMessage("There was an error while getting the vouchers");
    }
  };
}

export function getVoucherById(id, itemId, orderId, objectId) {
  return async dispatch => {
    dispatch(getVoucherByIdRequest());
    try {
      const xmlBodyStr = voucherDetailsXML({objectId, id, itemId, orderId});

      const { data } = await cultbayApi.post(
        '/VoucherDetails',
        xmlBodyStr,
        {headers: {'Content-Type': 'application/xml'}});
      parseString(data, (err, result) => {
        if (err) {
          dispatch(getVoucherByIdFailed(err));
        }

        dispatch(getVoucherByIdSuccess(XMLDataVoucherFormatting(result)));
      })
    } catch (error) {
      dispatch(getVoucherByIdFailed(error.response));
    }
  };
}

export function redeemVoucher(voucher, history, objectId) {
  const { id, itemId, orderId, travelPeriod, travellerName } = voucher;
  return async dispatch => {
    dispatch(redeemVoucherRequest());
    try {
      const xmlBodyStr = redeemVoucherXML({
        id,
        itemId,
        orderId,
        objectId,
        travellerName,
        from: travelPeriod.start,
        to: travelPeriod.end,
      });

      await cultbayApi.post(
        '/voucherRedeem',
        xmlBodyStr,
        {headers: {'Content-Type': 'application/xml'}});
      dispatch(redeemVoucherSuccess());
      history.goBack();
      showSuccessMessage("Voucher redeemed successfully");
      dispatch(getVouchersSuccess());
    } catch (error) {
      showErrorMessage("There was an error while redeeming the voucher");
      dispatch(redeemVoucherFailed(error.response));
    }
  };
}

export function getVoucherPreview(voucher) {
  const { itemId, orderId, id, objectId } = voucher;

  return async dispatch => {
    dispatch(getVoucherPreviewRequest());
    try {
      const xmlBodyStr = voucherPreviewXML({objectId, itemId, orderId, id});

      const { data } = await cultbayChannelWebServicesApi.post(
        '/voucherService',
        xmlBodyStr
      )
      parseString(data, (err, result) => {
        if (err) {
          showErrorMessage('Could not open Voucher Preview');
        }

        const res = result.VoucherServiceRS.Voucher;

        if (res && res[0] && res[0].EncodedText && res[0].EncodedText[0]) {
          dispatch(getVoucherPreviewSuccess(res[0].EncodedText[0]));
        }
      })
    } catch (error) {
      dispatch(getVoucherPreviewFailed(error.message));
      showErrorMessage('Could not open Voucher Preview');
    }
  }
}
