import {
  PROPERTY_DATA,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS
} from "../../constants/ActionTypes";
import axios from "util/Api";
import { push } from "react-router-redux";
import showErrorMessage from "../../util/showErrorMessage";
import showSuccessMessage from "../../util/showSuccessMessage";
import {
  fetchPropertyXML,
  fetchDesignTemplates,
  saveImages as saveImagesWithApi,
  saveDesignTemplateDetail,
  updatePropertyXML,
  createProfileWithCurrency as createProfileWithCurrencyWithApi
 } from "../../API/Property";
 import { UPDATE_NAMEADDRESS } from "../../constants/xmlTypes";
import { showNotification } from 'util/notifications';
import PropertyPictureCaptions from "constants/PropertyPictureCaptions";
import { fetchStart, fetchSuccess, fetchError } from './Common';
import { fetchEbayOffers } from "API/Ebay"
import { parseString } from 'xml2js';
import translate from 'util/translate';
import { setAppLoading } from './Global';

export const UPDATE_PROPERTY = "UPDATE_PROPERTY";
export const UPDATE_PROPERTY_FAILED = "UPDATE_PROPERTY_FAILED";

export const GET_USER_PROPERTIES_REQUEST = "GET_USER_PROPERTIES_REQUEST";
export const GET_USER_PROPERTIES_SUCCESS = "GET_USER_PROPERTIES_SUCCESS";
export const GET_USER_PROPERTIES_FAILED = "GET_USER_PROPERTIES_FAILED";

export const DELETE_PROPERTY_REQUEST = "DELETE_PROPERTY_REQUEST";
export const DELETE_PROPERTY_SUCCESS = "DELETE_PROPERTY_SUCCESS";
export const DELETE_PROPERTY_FAILED = "DELETE_PROPERTY_FAILED";

export const SET_SELECTED_PROPERTY_REQUEST = "SET_SELECTED_PROPERTY_REQUEST";
export const SET_SELECTED_PROPERTY_SUCCESS = "SET_SELECTED_PROPERTY_SUCCESS";
export const SET_SELECTED_PROPERTY_FAILED = "SET_SELECTED_PROPERTY_FAILED";

export const ADD_NEW_PROPERTY_REQUEST = "ADD_NEW_PROPERTY_REQUEST";
export const ADD_NEW_PROPERTY_SUCCESS = "ADD_NEW_PROPERTY_SUCCESS";
export const ADD_NEW_PROPERTY_FAILED = "ADD_NEW_PROPERTY_FAILED";

export const GET_DESIGN_TEMPLATES_REQUEST = "GET_DESIGN_TEMPLATES_REQUEST";
export const GET_DESIGN_TEMPLATES_SUCCESS = "GET_DESIGN_TEMPLATES_SUCCESS";
export const GET_DESIGN_TEMPLATES_FAILED = "GET_DESIGN_TEMPLATES_FAILED";

export const SAVE_IMAGES_REQUEST = "SAVE_IMAGES_REQUEST";
export const SAVE_IMAGES_SUCCESS = "SAVE_IMAGES_SUCCESS";
export const SAVE_IMAGES_FAILED = "SAVE_IMAGES_FAILED";

export const SELECT_PICTURE = "SELECT_PICTURE";
export const UNSELECT_PICTURE = "UNSELECT_PICTURE";
export const SET_SELECTED_PICTURES = "SET_SELECTED_PICTURES";
export const CLEAR_SELECTED_PICTURES = "CLEAR_SELECTED_PICTURES";
export const SET_FOOTER_IMAGE = "SET_FOOTER_IMAGE";

function getUserPropertiesRequest(payload) {
  return { type: GET_USER_PROPERTIES_REQUEST, payload };
}

function getUserPropertiesSuccess(payload) {
  return { type: GET_USER_PROPERTIES_SUCCESS, payload };
}

function getUserPropertiesFailed(payload) {
  return { type: GET_USER_PROPERTIES_FAILED, payload };
}

function deletePropertyRequest(payload) {
  return { type: DELETE_PROPERTY_REQUEST, payload };
}

function deletePropertySuccess(payload) {
  return { type: DELETE_PROPERTY_SUCCESS, payload };
}

function deletePropertyFailed(payload) {
  return { type: DELETE_PROPERTY_FAILED, payload };
}

function setSelectedPropertyRequest(payload) {
  return { type: SET_SELECTED_PROPERTY_REQUEST, payload };
}

function setSelectedPropertySuccess(payload) {
  return { type: SET_SELECTED_PROPERTY_SUCCESS, payload };
}

function setSelectedPropertyFailed(payload) {
  return { type: SET_SELECTED_PROPERTY_FAILED, payload };
}

function addNewPropertyRequest(payload) {
  return { type: ADD_NEW_PROPERTY_REQUEST, payload };
}

function addNewPropertySuccess(payload) {
  return { type: ADD_NEW_PROPERTY_SUCCESS, payload };
}

function addNewPropertyFailed(payload) {
  return { type: ADD_NEW_PROPERTY_FAILED, payload };
}


function getDesignTemplatesRequest(payload) {
  return { type: GET_DESIGN_TEMPLATES_REQUEST, payload };
}

function getDesignTemplatesSuccess(payload) {
  return { type: GET_DESIGN_TEMPLATES_SUCCESS, payload };
}

function getDesignTemplatesFailed(payload) {
  return { type: GET_DESIGN_TEMPLATES_FAILED, payload };
}

function saveImagesRequest() {
  return { type: SAVE_IMAGES_REQUEST };
}

function saveImagesSuccess() {
  return { type: SAVE_IMAGES_SUCCESS };
}

function saveImagesFailed() {
  return { type: SAVE_IMAGES_FAILED };
}

export const setSelectedPictures = payload => dispatch => dispatch({type: SET_SELECTED_PICTURES, payload});

export const clearSelectedPictures = () => dispatch => dispatch({type: CLEAR_SELECTED_PICTURES});

export const setFooterImage = payload => dispatch => dispatch({type: SET_FOOTER_IMAGE, payload});

export const updatePropertyState = (payload) => {
  return async dispatch => {
    dispatch({ type: UPDATE_PROPERTY, payload });
  }
}


export const updateProperty = (value, notificationEnabled = true) => {
  return async dispatch => {

    dispatch({ type: FETCH_START });

    let responseInternal = {
      data: {
        property: {
          objectId: null,
        }
      }
    };

    if (['objectId', 'name', 'billing_address', 'legal_address', 'show_map', 'language'].includes(value.fieldName)) {
      responseInternal = await axios.post('property/update', value);
    } else {
      responseInternal = await axios.get('property');
    }

    if (!responseInternal.data.result) {
      notificationEnabled && showNotification({message: responseInternal.data.error, type:'error'});
      return;
    }

    let objectId = value.objectId || responseInternal.data.property.objectId || null;

    let validResult = {};

    if (!objectId && responseInternal.data.result
      && ['objectId', 'name', 'billing_address', 'legal_address', 'show_map', 'language'].includes(value.fieldName)) {

        if (notificationEnabled) {
          showNotification({message: 'app.common.saved'});
          return dispatch({ type: UPDATE_PROPERTY, payload: responseInternal.data.property });
        }

    }

    if (!responseInternal.data.result) return;

    validResult = extractInternalValues(responseInternal.data.property);

    let propertyXML = {};

    if (objectId) {
      propertyXML = await fetchPropertyXML(objectId);
    }

    const valuesToUpdate = {
      ...validResult,
      ...propertyXML,
      objectId,
      manager: propertyXML.manager === null ? 'no' : propertyXML.manager,
      zoom: propertyXML.zoom == 0 ? 14 : propertyXML.zoom,
      [value.fieldName]: value.fieldValue,
    };

    if (value.fieldName === 'country') {
      valuesToUpdate['region'] = null;
    }

    if (value.fieldName === 'billing_country') {
      valuesToUpdate['billing_region'] = null;
    }

    if (value.fieldName === 'legal_country') {
      valuesToUpdate['legal_region'] = null;
    }


    if (['billing_address', 'legal_address', 'show_map'].includes(value.fieldName)) {
      if (notificationEnabled) {
        showNotification({message: 'app.common.saved'});
      }
      dispatch({ type: UPDATE_PROPERTY, payload: valuesToUpdate });
      return valuesToUpdate;
    }

    const response = await updatePropertyXML(valuesToUpdate, UPDATE_NAMEADDRESS);

    if (response && response.error) {
      dispatch({ type: FETCH_ERROR, payload: 'Error updating data' });
      dispatch({ type: UPDATE_PROPERTY_FAILED, payload: 'Error updating data' });
    } else {

      const finalResult = {...valuesToUpdate, ...response.result};

      if (value.fieldName === 'country') {
        finalResult['region'] = null;
      }

      if (value.fieldName === 'billing_country') {
        finalResult['billing_region'] = null;
      }

      if (value.fieldName === 'legal_country') {
        finalResult['legal_region'] = null;
      }

      if (notificationEnabled) {
        showNotification({message: 'app.common.saved'});
      }
      dispatch({ type: FETCH_SUCCESS });
      dispatch({ type: UPDATE_PROPERTY, payload: finalResult});

      return finalResult;
    }

  };
};

const extractInternalValues = ({objectId, name, billing_address, legal_address, show_map, language}) =>
  ({objectId, name, billing_address, legal_address, show_map, language});

export const getProperty = () => {
  return dispatch => {
    dispatch(fetchStart());
    return axios
      .get(`property`)
      .then(async ({ data }) => {
        dispatch(fetchSuccess());
        if (data.result) {
          const { objectId, name, id, billing_address, legal_address, show_map, language } = data.property;

          let propertyXML= {};
          if (objectId) {
            propertyXML = await fetchPropertyXML(objectId);
          }

          const internalProps = {id, name, objectId, billing_address, legal_address, show_map, language};

          dispatch({ type: PROPERTY_DATA, payload: {...internalProps, ...propertyXML} });
        }
      })
      .catch(function(error) {
        dispatch(fetchError());
        console.error('error getting property data:', error);
        dispatch({ type: PROPERTY_DATA, payload: {} });
      });
  };
};

export function getUserProperties(withDetails = false, withOffersStatus = null) {
  return async dispatch => {
    dispatch(getUserPropertiesRequest());
    try {
      const { data: properties } = await axios.get("users/properties");
      const propertiesInfo = await Promise.all(properties.map( async property => {

        const { objectId, name, id, billing_address, legal_address, show_map, language } = property;

        let propertyXML= {};
        if (objectId) {
          if (withDetails) {
            propertyXML = await fetchPropertyXML(objectId);
          }

          if (withOffersStatus) {
            const offersResponse = await fetchEbayOffers({objectId, status: withOffersStatus})
            const offers = await new Promise((resolve, reject) => parseString(offersResponse.data, (err, offersResult) => {
              if (err) {
                return reject(err);
              }
              resolve(offersResult.ListOfOffersRS.Offers[0] ? offersResult.ListOfOffersRS.Offers[0].Offer : [])
            }));
            propertyXML = {...propertyXML, offers}
          }
        }

        const internalProps = {id, name, objectId, billing_address, legal_address, show_map, language};

        return {...internalProps, ...propertyXML}
      }))

      dispatch(getUserPropertiesSuccess(propertiesInfo));
    } catch (error) {
      showErrorMessage("There was an error getting the properties");
      dispatch(getUserPropertiesFailed(error.response));
    }
  };
}

export function deleteProperty(propertyId) {
  return async dispatch => {
    dispatch(deletePropertyRequest(propertyId));
    try {
      const {
        data: { newUserSelectedProperty }
      } = await axios.delete(`property/${propertyId}`);

      dispatch(deletePropertySuccess({ propertyId, newUserSelectedProperty }));
      showSuccessMessage("Property deleted successfully");
      dispatch(getUserProperties());
    } catch (error) {
      if (error.response) {
        let { data, status } = error.response;
        if (status === 404) {
          showErrorMessage("Property does not exist");
        }
        if (status === 409) {
          showErrorMessage(data);
        }
      } else {
        showErrorMessage("There was an error deleting the property");
      }

      dispatch(deletePropertyFailed(propertyId));
    }
  };
}

export function setSelectedProperty(propertyId) {
  return async dispatch => {
    try {
      dispatch(setSelectedPropertyRequest());
      const { data: property } = await axios.patch(
        `property/setSelectedProperty/${propertyId}`
      );
      const { objectId, name, id, billing_address, legal_address, show_map, language } = property;

      let propertyXML= {};
      if (objectId) {
        propertyXML = await fetchPropertyXML(objectId);
      }

      const internalProps = {id, name, objectId, billing_address, legal_address, show_map, language};

      dispatch(setSelectedPropertySuccess({...internalProps, ...propertyXML}));
    } catch (error) {
      showErrorMessage("There was an error selecting the property");
      dispatch(setSelectedPropertyFailed(error.response));
    }
  };
}

export function addNewProperty(propertyType) {
  return async dispatch => {
    try {
      dispatch(addNewPropertyRequest(propertyType));
      const { data: property } = await axios.post("property");
      dispatch(addNewPropertySuccess(property));
        dispatch(push({ pathname: `/property/${propertyType}` }));
    } catch (error) {
      showErrorMessage("There was an error adding the property");
      dispatch(addNewPropertyFailed(error.response));
    }
  };
}

export function getDesignTemplates({objectId, errorLang}) {
  return async dispatch => {
    try {
      dispatch(getDesignTemplatesRequest());
      const templates = await fetchDesignTemplates({objectId, errorLang});
      dispatch(getDesignTemplatesSuccess(templates));
    } catch (error) {
      console.log(error);
      showErrorMessage("There was an error getting design templates");
      dispatch(getDesignTemplatesFailed(error.response));
    }
  }
}

export function selectPicture({captionCode, image}) {
  return async (dispatch, getState) => {
    await dispatch({ type: SELECT_PICTURE, payload: {captionCode, image} });
    try {
      const { property } = getState();
      const selectedPictures = property.selectedPictures;
      const objectId = property.property.objectId;
      let imageUrlsByCaptionCode = {};
      for (let captionCodeOfSelectedPictures of Object.keys(selectedPictures)) {
        imageUrlsByCaptionCode[captionCodeOfSelectedPictures] = selectedPictures[captionCodeOfSelectedPictures].map(
          ({url}) => url.indexOf('https:') !== 0 ? 'https:' + url : url
        );
      }
      await saveImagesWithApi({objectId, imageUrlsByCaptionCode});
    } catch (error) {
      console.log(error);
      showErrorMessage("There was an error saving images");
      dispatch({ type: UNSELECT_PICTURE, payload: { captionCode, image } });
    }
  }
}

export function unSelectPicture({captionCode, image}) {
  return async  (dispatch, getState) => {
    const caption = PropertyPictureCaptions.find(({code}) => code === captionCode) || {};
    if (caption.required) {
      const {
        picture: {
          pictureTypes
        }
      } = getState();
      const pictureType = pictureTypes.find(({id}) => id === caption.categoryId)
      if (! caption.multiple) {
        showErrorMessage(`${pictureType.value} ${translate('app.common.is_required')}`);
        return;
      }
      if (getState().property.selectedPictures[captionCode].length === 1) {
        showErrorMessage(`${pictureType.value} ${translate('app.common.is_required')}`);
        return;
      }
    }
    dispatch({ type: UNSELECT_PICTURE, payload: { captionCode, image } });
    try {
      const { property } = getState();
      const selectedPictures = property.selectedPictures;
      const objectId = property.property.objectId;
      let imageUrlsByCaptionCode = {};
      for (let captionCodeOfSelectedPictures of Object.keys(selectedPictures)) {
        imageUrlsByCaptionCode[captionCodeOfSelectedPictures] = selectedPictures[captionCodeOfSelectedPictures].map(({url}) => 'https:' + url);
      }
      await saveImagesWithApi({objectId, imageUrlsByCaptionCode});
    } catch (error) {
      console.log(error);
      showErrorMessage("There was an error saving images");
      dispatch({ type: SELECT_PICTURE, payload: { captionCode, image } });
    }
  }
}

export function saveFooterImage( {designTemplateId, footerImage} ) {
  return async (dispatch, getState) => {
    const {
      property: {
        footerImageUrl: oldFooterImage,
        property: {
          objectId
        }
      }
    } = getState();
    await dispatch(setFooterImage(footerImage));
    try {
      await Promise.all([
        saveDesignTemplateDetail({objectId, designTemplateId, languageId: 'eng', footerImageUrl: footerImage.url}),
        saveDesignTemplateDetail({objectId, designTemplateId, languageId: 'deu', footerImageUrl: footerImage.url})
      ]);
    } catch (error) {
      console.log(error);
      showErrorMessage("There was an error saving footer image");
      dispatch(setFooterImage(oldFooterImage));
    }
  }
}

export const createProfileWithCurrency =  (currency) => async dispatch => {
  try {
    dispatch(setAppLoading(true));

    // create empty property
    const {
      data: {
        id: propertyId,
        name: propertyName
      }
    } = await axios.post("property");

    // create profile and get objectId
    const objectId = await createProfileWithCurrencyWithApi({currency, propertyName});

    // update objectId in internal api
    await axios.post('property/update', {fieldName: "objectId", fieldValue: objectId, propertyId});

    // just to be sure
    await axios.patch(`property/setSelectedProperty/${propertyId}`)

    // update redux state
    await dispatch(getProperty());
    dispatch(setAppLoading(false));
  } catch (error) {
    dispatch(setAppLoading(false));
    dispatch(fetchError());
    console.error('error getting property data:', error);
  }
}

export const updatePropertyName = (name, propertyId) => async dispatch => {
  dispatch({type: FETCH_START});
  const internalResponse = await axios.post('property/update', {
    fieldName: 'name',
    fieldValue: name,
    propertyId
  });
  if (!internalResponse.data.result) {
    showNotification({message: internalResponse.data.error, type:'error'})
  }
  dispatch({ type: UPDATE_PROPERTY, payload: internalResponse.data.property });
}
