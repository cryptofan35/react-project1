import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILED,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILED,
  ACTIVATE_USER_REQUEST,
  ACTIVATE_USER_SUCCESS,
  ACTIVATE_USER_FAILED,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_FAILED,
  SAVE_USER_FORM_DATA,
  GET_USER_FORM_DATA_ERROR,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_BY_ID_FAILED,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILED
} from "../actions/Users";

const initialState = {
  users: null,
  getUsersLoading: false,
  getUsersError: null,
  createUserLoading: false,
  createUserError: null,
  activateUserError: null,
  blockUserError: null,
  formData: {
    roles: null,
    properties: null,
    languages: null,
    error: null
  },
  editUser: {
    loadingGetUserById: false,
    loadingEdit: false,
    getUserByIdError: null,
    editError: null,
    user: null
  }
};

export default (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case GET_USERS_REQUEST:
      return {
        ...state,
        getUsersLoading: true
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: payload,
        getUsersLoading: false
      };
    case GET_USERS_FAILED:
      return {
        ...state,
        users: null,
        getUsersLoading: false,
        getUsersError: payload
      };

    case CREATE_USER_REQUEST:
      return {
        ...state,
        createUserLoading: true
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        createUserLoading: false,
        createUserError: null
      };
    case CREATE_USER_FAILED:
      return {
        ...state,
        createUserLoading: false,
        createUserError: payload
      };

    case ACTIVATE_USER_REQUEST: {
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id == payload) {
            user.isModifying = true;
            return user;
          }
          return user;
        })
      };
    }
    case ACTIVATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id == payload) {
            user.isModifying = false;
            user.statusName = "Active";
            return user;
          }
          return user;
        })
      };
    case ACTIVATE_USER_FAILED:
      return {
        ...state,
        activateUserError: payload
      };

    case BLOCK_USER_REQUEST:
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id == payload) {
            user.isModifying = true;
            return user;
          }
          return user;
        })
      };
    case BLOCK_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id == payload) {
            user.isModifying = false;
            user.statusName = "Blocked";
            return user;
          }
          return user;
        })
      };
    case BLOCK_USER_FAILED:
      return {
        ...state,
        blockUserError: payload
      };

    case SAVE_USER_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          roles: payload.roles,
          properties: payload.properties,
          languages: payload.languages
        }
      };

    case GET_USER_FORM_DATA_ERROR:
      return {
        ...state,
        formData: {
          ...state.formData,
          error: payload
        }
      };
    case GET_USER_BY_ID_REQUEST:
      return {
        ...state,
        editUser: {
          ...state.editUser,
          loadingGetUserById: true
        }
      };
    case GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        editUser: {
          ...state.editUser,
          loadingGetUserById: false,
          user: payload
        }
      };
    case GET_USER_BY_ID_FAILED:
      return {
        ...state,
        editUser: {
          ...state.editUser,
          loadingGetUserById: false,
          getUserByIdError: payload
        }
      };
    case EDIT_USER_REQUEST:
      return {
        ...state,
        editUser: {
          ...state.editUser,
          loadingEdit: true
        }
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        editUser: {
          ...state.editUser,
          loadingEdit: false
        }
      };
    case EDIT_USER_FAILED:
      return {
        ...state,
        editUser: {
          ...state.editUser,
          loadingEdit: false,
          editError: payload
        }
      };
    default:
      return state;
  }
};
