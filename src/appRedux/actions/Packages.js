import showErrorMessage from "util/showErrorMessage";
import showSuccessMessage from "util/showSuccessMessage";
import moment from "moment";

import {
  fetchPackagesList,
  fetchPackageDetails,
  createPackage as createPackageWithApi,
  updatePackage as updatePackageWithApi,
  createOffer as createOfferWithApi,
  fetchTemplateDetails,
  fetchTemplatePreview,
  fetchSellerAccounts,
  getAvailabilityStatus
 } from 'API/Packages';

import { setNotificationMessage } from "appRedux/actions";
import translate from 'util/translate';

export const GET_PACKAGES_REQUEST = "GET_PACKAGES_REQUEST";

export const GET_PACKAGES_SUCCESS = "GET_PACKAGES_SUCCESS";
export const GET_PACKAGES_FAILED = "GET_PACKAGES_FAILED";

export const GET_PACKAGE_DETAILS_SUCCESS = "GET_PACKAGE_DETAILS_SUCCESS";
export const GET_PACKAGE_DETAILS_FAILED = "GET_PACKAGE_DETAILS_FAILED";

export const SET_PACKAGE_DATA_SUCCESS = "SET_PACKAGE_DATA_SUCCESS";
export const UPDATE_PACKAGES_LIST_SUCCESS = "UPDATE_PACKAGES_LIST_SUCCESS";
export const UPDATE_PACKAGES_EDIT_SUCCESS = "UPDATE_PACKAGES_EDIT_SUCCESS";
export const TOGGLE_NEW_PACKAGE = 'TOGGLE_NEW_PACKAGE';

export const SET_PACKAGE_CALENDAR = 'SET_PACKAGE_CALENDAR';
export const SET_LOADING = 'SET_LOADING';
export const CLEAR_LOADING = 'CLEAR_LOADING';

export const SET_PREVIEW = 'SET_PREVIEW';

export const GET_SELLER_ACCOUNTS_REQUEST = "GET_SELLER_ACCOUNTS_REQUEST";
export const GET_SELLER_ACCOUNTS_SUCCESS = "GET_SELLER_ACCOUNTS_SUCCESS";
export const GET_SELLER_ACCOUNTS_FAILED = "GET_SELLER_ACCOUNTS_FAILED";

export const SET_PACKAGE_OFFERABLE = "SET_PACKAGE_OFFERABLE";

function getPackagesRequest(payload) {
  return { type: GET_PACKAGES_REQUEST, payload };
}

function getPackagesSuccess(payload) {
  return { type: GET_PACKAGES_SUCCESS, payload };
}
function getPackagesFailed(payload) {
  return { type: GET_PACKAGES_FAILED, payload };
}

function getPackageDetailsSuccess(payload) {
  return { type: GET_PACKAGE_DETAILS_SUCCESS, payload };
}
function getPackagesDetailsFailed(payload) {
  return { type: GET_PACKAGE_DETAILS_FAILED, payload };
}

function setPackagDataSuccess(payload) {
  return { type: SET_PACKAGE_DATA_SUCCESS, payload };
}

function updatePackagsListSuccess(payload) {
  return { type: UPDATE_PACKAGES_LIST_SUCCESS, payload };
}

function setPackageCalendar(payload) {
  return { type: SET_PACKAGE_CALENDAR, payload };
}

function setLoading() {
  return { type: SET_LOADING };
}

function clearLoading() {
  return { type: CLEAR_LOADING };
}

function setTemplatePreview(payload) {
  return { type: SET_PREVIEW, payload };
}

function getSellerAccountsRequest(payload) {
  return { type: GET_SELLER_ACCOUNTS_REQUEST, payload }
}

function getSellerAccountsSuccess(payload) {
  return { type: GET_SELLER_ACCOUNTS_SUCCESS, payload }
}

function getSellerAccountsFailed(payload) {
  return { type: GET_SELLER_ACCOUNTS_FAILED, payload }
}

function setPackageOfferable(payload) {
  return { type: SET_PACKAGE_OFFERABLE, payload }
}

export function toggleNewPackage(status = false) {
  return async dispatch => {
    dispatch({ type: TOGGLE_NEW_PACKAGE, payload: status });
  };
}

export function getPackages({objectId, errorLang, offset, limit}) {
  return async dispatch => {
    dispatch(getPackagesRequest());
    try {
      const response = await fetchPackagesList({objectId, errorLang, offset, limit});
      dispatch(getPackagesSuccess(response));
    } catch (error) {
      dispatch(getPackagesFailed(error.response ? error.response : ''));
      showErrorMessage("There was an error while getting the vouchers");
    }
  };
}

export function getPackageDetails({objectId, packageId, templateId}) {
  return async dispatch => {
    if (!packageId) {
      return dispatch(getPackageDetailsSuccess({}))
    }
    dispatch(getPackagesRequest());
    try {
      const response = await fetchPackageDetails({objectId, packageId});
      const { data } = response;

      dispatch(getPackageDetailsSuccess({...data, templateId}));
    } catch (error) {
      console.log(error);
      dispatch(getPackagesDetailsFailed(error.response));
      showErrorMessage("There was an error while getting the package details");
    }
  };
}

export const clearPackageDetails = () => dispatch => dispatch(getPackageDetailsSuccess());

export function setPackageData(data) {
  return async dispatch => {
    if (!data.id) {
      return dispatch(setPackagDataSuccess({}))
    }

    dispatch(setPackagDataSuccess(data));
  };
}

export const updatePackage = ({objectId, packageId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, description, voucherDescription, imageUrls, availabilityPrice, calendarOffer, marketPlaceCurrencyCode, propertyCurrencyCode}, onSuccess) => async dispatch => {
  try {
    await updatePackageWithApi({objectId, packageId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, description, voucherDescription, imageUrls, availabilityPrice, calendarOffer, marketPlaceCurrencyCode, propertyCurrencyCode});
    dispatch(updatePackagsListSuccess());
    showSuccessMessage("Package updated");
    onSuccess();
  } catch (error) {
    if (error.message) {
      console.log(error.message);
      showErrorMessage(error.message);
      return;
    }
    showErrorMessage(translate('app.packages.place_offer.error_update'));
  }
}

export const createPackage = ({objectId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, description, voucherDescription, imageUrls, availabilityPrice, calendarOffer, marketPlaceCurrencyCode, propertyCurrencyCode}, onSuccess) => async dispatch => {
  try {
    await createPackageWithApi({objectId, marketplaceId, roomId, price, numberOfNights, numberOfGuests, voucherValidity, name, description, voucherDescription, imageUrls, availabilityPrice, calendarOffer, marketPlaceCurrencyCode, propertyCurrencyCode});
    dispatch(updatePackagsListSuccess());
    showSuccessMessage("Package created");
    onSuccess();
  } catch (error) {
    if (error.message) {
      showErrorMessage(error.message);
      return;
    }
    showErrorMessage(translate('app.packages.place_offer.error_create'));
  }
}

export const fetchPackageCalendar = ({packageId}) => async dispatch => {
  try {
    const fromDate = moment().format("YYYY-MM-DD")
    const endDate = moment().add(3, 'years').subtract(1, 'days').format("YYYY-MM-DD")
    const availabilityStatus = await getAvailabilityStatus({
      productId: packageId,
      fromDate,
      endDate
    })
    const convertedReservedDates = Object.keys(availabilityStatus)
      .map(date => ({
        quantity: availabilityStatus[date],
        isClosed: false,
        date: moment(date).format("MM-DD-YYYY")
      }))
    dispatch(setPackageCalendar({reservedDates: convertedReservedDates}))
  } catch (error) {
    console.log(error);
    showErrorMessage("Could not load package calendar. Please try again later.");
  }
}

export const createOffer = ({objectId, errorLang, marketPlaceId, currency, templateId, listingType, listingDuration, startTime, price, retailPrice, offerRepeat}) => async dispatch => {
  try {
    dispatch(setLoading());
    await createOfferWithApi({objectId, errorLang, marketPlaceId, currency, templateId, listingType, listingDuration, startTime, price, retailPrice, offerRepeat});
    dispatch(clearLoading());
  } catch (error) {
    dispatch(clearLoading());
    showErrorMessage(translate('app.packages.place_offer.error_create'));
    throw error;
  }
}

export const getTemplateDetail = ({objectId, templateId, errorLang}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    const {
      packages: {
        packageDetails: {
          packageId,
          roomId
        }
      }
    } = getState();
    const [details, preview] = await Promise.all([
      fetchTemplateDetails({objectId, templateId, errorLang}),
      fetchTemplatePreview({objectId, templateId, errorLang, roomId, packageId})
    ])
    dispatch(setTemplatePreview({
      preview: {
        htmlContent: preview
      },
      details
    }))
    dispatch(clearLoading());
  } catch (error) {
    dispatch(clearLoading());
    showErrorMessage("Could not get template detail and preview. Please try again later.");
    throw error;
  }
}

export const getSellerAccounts = ({objectId, siteId, errorLang}) => async dispatch => {
  dispatch(getSellerAccountsRequest());
  try {
    const response = await fetchSellerAccounts({objectId, siteId, errorLang});
    dispatch(getSellerAccountsSuccess(response));
  } catch (error) {
    dispatch(getSellerAccountsFailed());
    showErrorMessage("There was an error while getting seller accounts");
  }
}

export const checkPackageToOffer = ({objectId, packageId, templateId}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading());
    await dispatch(getPackageDetails({objectId, packageId, templateId}));
    const {
      packages: {
        packageDetails: {
          marketPlaceId
        }
      },
      auth: {
        user: {
          language_id
        }
      }
    } = getState();
    await dispatch(getSellerAccounts({objectId, siteId: marketPlaceId, errorLang: language_id.substring(0,2)}))
    const {
      packages: {
        sellerAccounts
      }
    } = getState();

    const isPackageOfferable = sellerAccounts && sellerAccounts.length > 0;

    dispatch(setPackageOfferable(isPackageOfferable));
    dispatch(clearLoading());

  } catch (error) {
    dispatch(clearLoading());
    dispatch(setNotificationMessage("Error", "Could not check package to offer. Please try again later."));
  }
}

export const clearPackageOfferable = () => dispatch => {
  dispatch(setPackageOfferable(null));
}
