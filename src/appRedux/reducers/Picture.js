import { PICTURE_TYPES, PICTURES_DATA, PICTURE_DELETE, SIGNOUT_USER_SUCCESS, PICTURE_LOAD_ERROR, ADD_UPLOADED_PICTURE_UID, REMOVE_UPLOADED_PICTURE_UID, SET_UPLOADING_PICTURE } from "../../constants/ActionTypes";

export const INIT_STATE = {
  pictureTypes: [],
  pictures: [],
  error: '',
  uploadedPictureUids: [],
  uploadingPicture: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case PICTURE_TYPES: {
      return { ...state, pictureTypes: action.payload };
    }

    case PICTURES_DATA: {
      return { ...state, pictures: action.payload };
    }

    case PICTURE_DELETE: {
      return { ...state, pictures: state.pictures.filter(({uid}) => uid !== action.payload) };
    }

    case PICTURE_LOAD_ERROR: {
      return { ...state, error: action.payload };
    }

    case SIGNOUT_USER_SUCCESS: {
      return { ...state, pictures: [], uploadedPictureUids: [] };
    }

    case ADD_UPLOADED_PICTURE_UID: {
      return { ...state, uploadedPictureUids: [...state.uploadedPictureUids, action.payload] };
    }

    case REMOVE_UPLOADED_PICTURE_UID: {
      return { ...state, uploadedPictureUids: state.uploadedPictureUids.filter((uid) => uid !== action.payload) };
    }
    
    case SET_UPLOADING_PICTURE: {
      return { ...state, uploadingPicture: action.payload };
    }

    default:
      return state;
  }
};
