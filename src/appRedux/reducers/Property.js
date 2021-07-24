import { PROPERTY_DATA } from "../../constants/ActionTypes";
import {
  UPDATE_PROPERTY,
  UPDATE_PROPERTY_FAILED,
  GET_USER_PROPERTIES_REQUEST,
  GET_USER_PROPERTIES_SUCCESS,
  GET_USER_PROPERTIES_FAILED,
  DELETE_PROPERTY_REQUEST,
  DELETE_PROPERTY_SUCCESS,
  DELETE_PROPERTY_FAILED,
  SET_SELECTED_PROPERTY_REQUEST,
  SET_SELECTED_PROPERTY_SUCCESS,
  SET_SELECTED_PROPERTY_FAILED,
  ADD_NEW_PROPERTY_REQUEST,
  ADD_NEW_PROPERTY_SUCCESS,
  ADD_NEW_PROPERTY_FAILED,
  GET_DESIGN_TEMPLATES_REQUEST,
  GET_DESIGN_TEMPLATES_SUCCESS,
  GET_DESIGN_TEMPLATES_FAILED,
  SAVE_IMAGES_REQUEST,
  SAVE_IMAGES_SUCCESS,
  SAVE_IMAGES_FAILED,
  SELECT_PICTURE,
  SET_SELECTED_PICTURES,
  UNSELECT_PICTURE,
  CLEAR_SELECTED_PICTURES,
  SET_FOOTER_IMAGE
} from "../actions/Property";
import PropertyPictureCaptions from "constants/PropertyPictureCaptions";

const INIT_STATE = {
  property: null,
  userProperties: {
    loading: false,
    loadingDelete: false,
    data: null,
    error: null
  },
  loadingSetUserProperty: false,
  loadingAddNewProperty: null,
  designTemplates: {
    loading: false,
    data: []
  },
  loadingSaveImages: false,
  selectedPictures: {},
  footerImage: {}
};

export default (state = INIT_STATE, { type, payload }) => {
  switch (type) {
    case PROPERTY_DATA: {
      return { ...state, property: payload };
    }
    case UPDATE_PROPERTY: {
      return {
        ...state,
        property: payload,
        userProperties: {
          ...state.userProperties,
          data: state.userProperties.data.map(up => {
            if (up.id === payload.id) {
              return { ...payload };
            }
            return { ...up };
          })
        }
      };
    }

    case UPDATE_PROPERTY_FAILED: {
      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          error: payload,
          loading: false
        }
      };
    }

    case GET_USER_PROPERTIES_REQUEST:
      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          loading: true
        }
      };
    case GET_USER_PROPERTIES_SUCCESS:
      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          data: payload,
          loading: false
        }
      };
    case GET_USER_PROPERTIES_FAILED:
      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          error: payload,
          loading: false
        }
      };
    case DELETE_PROPERTY_REQUEST:
      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          data: state.userProperties.data.map(p => {
            if (p.id === payload) {
              return {
                ...p,
                loadingDelete: true
              };
            }
            return { ...p };
          })
        }
      };
    case DELETE_PROPERTY_SUCCESS: {
      const { propertyId, newUserSelectedProperty } = payload;
      console.log(payload);

      let property;
      if (newUserSelectedProperty === true) {
        property = { ...state.property };
      } else {
        property = newUserSelectedProperty;
      }

      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          data: state.userProperties.data.map(p => {
            if (p.id === propertyId) {
              return {
                ...p,
                loadingDelete: false
              };
            }
            return { ...p };
          })
        },
        property
      };
    }
    case DELETE_PROPERTY_FAILED:
      return {
        ...state,
        userProperties: {
          ...state.userProperties,
          data: state.userProperties.data.map(p => {
            if (p.id === payload) {
              return {
                ...p,
                loadingDelete: false
              };
            }
            return { ...p };
          })
        }
      };
    case SET_SELECTED_PROPERTY_REQUEST:
      return {
        ...state,
        loadingSetUserProperty: true
      };
    case SET_SELECTED_PROPERTY_SUCCESS:
      return {
        ...state,
        loadingSetUserProperty: false,
        property: payload
      };
    case SET_SELECTED_PROPERTY_FAILED:
      return {
        ...state,
        loadingSetUserProperty: false
      };
    case ADD_NEW_PROPERTY_REQUEST:
      return {
        ...state,
        loadingAddNewProperty: payload
      };
    case ADD_NEW_PROPERTY_SUCCESS:
      return {
        ...state,
        property: payload,
        userProperties: {
          ...state.userProperties,
          data: [...state.userProperties.data, payload]
        },
        loadingAddNewProperty: null
      };
    case ADD_NEW_PROPERTY_FAILED:
      return {
        ...state,
        loadingAddNewProperty: null
      };
    case GET_DESIGN_TEMPLATES_REQUEST: 
      return {
        ...state,
        designTemplates: {
          loading: true,
          data: []
        }
      };
    case GET_DESIGN_TEMPLATES_FAILED:
      return {
        ...state,
        designTemplates: {
          loading: false,
          data: []
        }
      };
    case GET_DESIGN_TEMPLATES_SUCCESS:
      return {
        ...state,
        designTemplates: {
          loading: false,
          data: payload
        }
      };
    case SAVE_IMAGES_REQUEST: 
      return {
        ...state,
        loadingSaveImages: true
      }; 
    case SAVE_IMAGES_FAILED:
      return {
        ...state,
        loadingSaveImages: false
      };
    case SAVE_IMAGES_SUCCESS:
      return {
        ...state,
        loadingSaveImages: false
      }
    case SET_SELECTED_PICTURES: {
      return {
        ...state,
        selectedPictures: payload
      }
    }  
    case SELECT_PICTURE: {
      const { captionCode, image } = payload;
      const caption = PropertyPictureCaptions.find(({code}) => code === captionCode) || {};
      if (caption.multiple) {
        return {
          ...state,
          selectedPictures: {
            ...state.selectedPictures,
            [payload.captionCode]: [...(state.selectedPictures[captionCode] || []), image]
          }
        }
      }
      return {
        ...state,
        selectedPictures: {
          ...state.selectedPictures,
          [captionCode]: [image]
        }
      }
    }
    case UNSELECT_PICTURE: {
      const { captionCode, image } = payload;
      const caption = PropertyPictureCaptions.find(({code}) => code === captionCode) || {};
      if (caption.multiple) {
        return {
          ...state,
          selectedPictures: {
            ...state.selectedPictures,
            [captionCode]: [...(state.selectedPictures[captionCode] || []).filter(({uid}) => uid !== image.uid)]
          }
        }
      }
      return {
        ...state,
        selectedPictures: []
      }
    }
    case SET_FOOTER_IMAGE: {
      return {
        ...state,
        footerImage: payload
      }
    }
    case CLEAR_SELECTED_PICTURES: {
      return {
        ...state,
        selectedPictures: {},
        footerImage: {}
      }
    }
    default:
      return state;
  }
};
