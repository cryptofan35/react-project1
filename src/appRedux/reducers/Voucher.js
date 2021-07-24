import {
  GET_VOUCHERS_REQUEST,
  GET_VOUCHERS_SUCCESS,
  GET_VOUCHERS_FAILED,
  GET_VOUCHER_BY_ID_REQUEST,
  GET_VOUCHER_BY_ID_SUCCESS,
  GET_VOUCHER_BY_ID_FAILED,
  REDEEM_VOUCHER_REQUEST,
  REDEEM_VOUCHER_SUCCESS,
  REDEEM_VOUCHER_FAILED, GET_VOUCHER_PREVIEW_REQUEST, GET_VOUCHER_PREVIEW_SUCCESS, GET_VOUCHER_PREVIEW_FAILED
} from "../actions/Voucher";

const initialState = {
  vouchersList: {
    loading: false,
    error: null,
    data: []
  },
  voucherRedemption: {
    loading: false,
    error: null,
    data: null
  },
  redeemVoucherForm: {
    loading: false,
    error: null
  },
  previewVoucher: {
    loading: false,
    error: null,
    data: null,
  }
};

export default function vouchersReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case GET_VOUCHERS_REQUEST:
      return {
        ...state,
        vouchersList: {
          ...state.vouchersList,
          loading: true
        }
      };
    case GET_VOUCHERS_SUCCESS:
      return {
        ...state,
        vouchersList: {
          ...state.vouchersList,
          loading: false,
          error: null,
          data: payload
        }
      };
    case GET_VOUCHERS_FAILED:
      return {
        ...state,
        vouchersList: {
          ...state.vouchersList,
          loading: false,
          error: null
        }
      };
    case GET_VOUCHER_BY_ID_REQUEST:
      return {
        ...state,
        voucherRedemption: {
          ...state.voucherRedemption,
          loading: true
        }
      };
    case GET_VOUCHER_BY_ID_SUCCESS:
      return {
        ...state,
        voucherRedemption: {
          ...state.voucherRedemption,
          loading: false,
          data: payload,
          error: null
        }
      };
    case GET_VOUCHER_BY_ID_FAILED:
      return {
        ...state,
        voucherRedemption: {
          ...state.voucherRedemption,
          loading: false,
          error: payload
        }
      };
    case REDEEM_VOUCHER_REQUEST:
      return {
        ...state,
        redeemVoucherForm: {
          ...state.redeemVoucherForm,
          loading: true
        }
      };
    case REDEEM_VOUCHER_SUCCESS:
      return {
        ...state,
        redeemVoucherForm: {
          ...state.redeemVoucherForm,
          loading: false
        }
      };
    case REDEEM_VOUCHER_FAILED:
      return {
        ...state,
        redeemVoucherForm: {
          ...state.redeemVoucherForm,
          loading: false,
          error: payload
        }
      };
    case GET_VOUCHER_PREVIEW_REQUEST:
      return {
        ...state,
        previewVoucher: {
          ...state.previewVoucher,
          loading: true,
        }
      }
    case GET_VOUCHER_PREVIEW_SUCCESS:
      return {
        ...state,
        previewVoucher: {
          ...state.previewVoucher,
          loading: false,
          data: payload,
          error: null,
        }
      }
    case GET_VOUCHER_PREVIEW_FAILED:
      return {
        ...state,
        previewVoucher: {
          ...state.previewVoucher,
          loading: false,
          error: payload,
        }
      }
    default:
      return {
        ...state
      };
  }
}
