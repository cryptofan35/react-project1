import {
  GET_PACKAGES_REQUEST,
  GET_PACKAGES_SUCCESS,
  GET_PACKAGES_FAILED,
  GET_PACKAGE_DETAILS_SUCCESS,
  GET_PACKAGE_DETAILS_FAILED,
  SET_PACKAGE_DATA_SUCCESS,
  UPDATE_PACKAGES_LIST_SUCCESS,
  UPDATE_PACKAGES_EDIT_SUCCESS,
  TOGGLE_NEW_PACKAGE,
  SET_PACKAGE_CALENDAR,
  SET_LOADING,
  CLEAR_LOADING,
  SET_PREVIEW,
  GET_SELLER_ACCOUNTS_REQUEST,
  GET_SELLER_ACCOUNTS_SUCCESS,
  GET_SELLER_ACCOUNTS_FAILED,
  SET_PACKAGE_OFFERABLE
} from "../actions/Packages";

const initialState = {
  loading: false,
  error: null,
  packagesList: [],
  totalPackageCount: 0,
  packageData: {},
  packageDetails: {},
  currency: 'EUR',
  timeZone: 'MESZ',
  isNewPackage: false,
  calendar: {
    reservedDates: []
  },
  preview: null,
  sellerAccounts: [],
  isPackageOfferable: null
};

export default (
  state = initialState,
  { type, payload, id }
) => {
  switch (type) {
    case TOGGLE_NEW_PACKAGE:
      return {
        ...state,
        isNewPackage: payload
      };
    case GET_SELLER_ACCOUNTS_REQUEST:
      return {
        ...state,
        loading: true
      }  
    case GET_SELLER_ACCOUNTS_SUCCESS: 
      return {
        ...state,
        loading: false,
        sellerAccounts: payload
      }
    case GET_SELLER_ACCOUNTS_FAILED:
      return {
        ...state,
        loading: false
      }  
    case GET_PACKAGES_REQUEST:
      return {
        ...state,
        loading: true
      };
    case GET_PACKAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        packagesList: payload.templates,
        packagesCount: payload.count,
        error: null,
      };
    case GET_PACKAGES_FAILED:
      return {
        ...state,
        loading: false,
        error: payload.message
      };
    case GET_PACKAGE_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        packageDetails: payload,
        error: null,
      };
    case GET_PACKAGE_DETAILS_FAILED:
      return {
        ...state,
        loading: false,
        error: payload.message
      };
    case SET_PACKAGE_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        packageData: payload
      };
    case UPDATE_PACKAGES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_PACKAGES_EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        packagesList: state.packagesList.map((pckg) => {
          if (pckg.id !== id) {
            return pckg
          }
  
          return { ...pckg, ...payload }
        }),
        error: null,
      };
    case SET_PACKAGE_CALENDAR:
      return {
        ...state,
        calendar: payload
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false
      };
    case SET_PREVIEW:
      return {
        ...state,
        preview: payload
      }
    case SET_PACKAGE_OFFERABLE:
      return {
        ...state,
        isPackageOfferable: payload
      }    
    default:
      return {
        ...state
      };
  }
}
