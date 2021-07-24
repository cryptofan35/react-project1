import { PICTURE_TYPES, PICTURES_DATA, PICTURE_DELETE, PICTURE_LOAD_ERROR, ADD_UPLOADED_PICTURE_UID, REMOVE_UPLOADED_PICTURE_UID, SET_UPLOADING_PICTURE } from "../../constants/ActionTypes";
import axios, {cultbayChannelWebServicesApi} from 'util/Api'
import {ObjectMetaData, ListPictures, removePictureXML} from 'constants/xmlBody'
import showErrorMessage from "util/showErrorMessage";

export const getPictures = ({objectId, errorLang, category}) => dispatch => {
  const payload = ListPictures({
    authenticationCode: "ef3bbd58f93242a16b11c189f6a9cd7b",
    sourceId: "2",
    channelId: "1",
    objectId: objectId,
    errorLang: errorLang,
    category: category
  })
  cultbayChannelWebServicesApi.post("/pictureslist", payload)
  .then((response) => {
    if (response.data.ack === 'Success') {
      dispatch({type: PICTURES_DATA, payload: response.data.images.image.map(image => {
        let thumbnailURL = image.thumbnailURL;
        if (thumbnailURL.search('http://') !== 0 && thumbnailURL.search('https://') !== 0) {
          thumbnailURL = '//' + thumbnailURL
        }
        let imageURL = image.url;
        if (imageURL.search('http://') !== 0 && imageURL.search('https://') !== 0) {
          imageURL = '//' + imageURL;
        }
        return {
          uid: image.imageId,
          name: image.name,
          thumbUrl: thumbnailURL,
          url: imageURL,
          category: image.category
        };
      })})
    }
  })
  .catch(error => console.error("Error****:", error.message))
}

export const getPictureTypes = ({objectId, errorLang}) => async (dispatch, getState) => {
  const {
    settings: {
      locale: {
        userLanguageId
      }
    }
  } = getState();
  const objectMetaDataPayload = {
    authenticationCode: "ef3bbd58f93242a16b11c189f6a9cd7b",
    sourceId: "2",
    channelId: "1",
    objectId: objectId,
    errorLang: errorLang,
    siteId: "0",
    requestParameters: "PictureCategories"
  };
  const payload = ObjectMetaData(objectMetaDataPayload);
  const categoriesResponse = await cultbayChannelWebServicesApi.post("/ObjectMetaData", payload);
  const categories = categoriesResponse.data.pictureCategories.pictureCategory.map(category => ({id: category.id, value: category.name}));
  const pictureTypesResponse = await axios.get("/picture/types");
  
  const pictureTypes = categories.map((category) => {
    let pictureType = pictureTypesResponse.data.data.find(pt => pt.oldCategoryId == category.id && pt.languageId == userLanguageId)
    return {
      ...category,
      value: pictureType ? pictureType.value : category.value,
      hint: pictureType ? pictureType.hint : null
    }
  })
  dispatch({type: PICTURE_TYPES, payload: pictureTypes});
}

export const setPicture = (file, category) => dispatch =>
  axios
    .post("picture", {file, category})
    .catch(error => console.error("Error****:", error.message));

export const removePicture = ({uid, objectId, errorLang}) => async dispatch => {
  const payload = removePictureXML({objectId, imageId: uid, errorLang});
  try {
    const response = await cultbayChannelWebServicesApi.post("/picturedelete", payload);
    if (response.data.errors) {
      const errorMessage = response.data.errors.error ? response.data.errors.error[0].errorMessage : "Could not remove picture. Please try again later.";
      showErrorMessage(errorMessage);
      return;
    }
    dispatch({type: PICTURE_DELETE, payload: uid});
  } catch (error) {
    console.log(error);
    showErrorMessage("Could not remove picture. Please try again later.");
  }
  
}

export const resortPicture = (picturesOrder) => dispatch =>
  axios
    .post("picture/resort", {picturesOrder})
    .catch(error => console.error("Error****:", error.message));

export const setPictureError = (message) => dispatch =>
  dispatch({ type: PICTURE_LOAD_ERROR, payload: message })

export const addUploadedPictureUid = (uid) => dispatch => dispatch({type: ADD_UPLOADED_PICTURE_UID, payload: uid});

export const removeUploadedPictureUid = (uid) => dispatch => dispatch({type: REMOVE_UPLOADED_PICTURE_UID, payload: uid});

export const setUploadingPicture = (uploading) => dispatch => dispatch({type: SET_UPLOADING_PICTURE, payload: uploading})
