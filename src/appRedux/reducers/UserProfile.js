import {
  UPDATE_USER_DATA,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_DEFAULT_LANGUAGE
} from "../../constants/ActionTypes";

const INIT_STATE = {
  user: {}
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_USER_DATA: {
      return {
        ...state,
        user: action.payload
      };
    }

    case UPDATE_USER_PASSWORD: {
      return {
        ...state
      };
    }

    case UPDATE_USER_DEFAULT_LANGUAGE: {
      return {
        ...state,
        user: action.payload
      };
    }

    default:
      return state;
  }
};
