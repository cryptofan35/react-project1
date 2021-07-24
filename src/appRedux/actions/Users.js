import axios from "util/Api";
import success_img from "../../assets/images/success-notification.png";
import { message } from "antd";
import showSuccessMessage from "../../util/showSuccessMessage";
import showErrorMessage from "../../util/showErrorMessage";

export const GET_USERS_REQUEST = "GET_USERS_REQUEST";
export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
export const GET_USERS_FAILED = "GET_USERS_FAILED";

export const CREATE_USER_REQUEST = "CREATE_USER_REQUEST";
export const CREATE_USER_SUCCESS = "CREATE_USER_SUCCESS";
export const CREATE_USER_FAILED = "CREATE_USER_FAILED";

export const EDIT_USER_REQUEST = "EDIT_USER_REQUEST";
export const EDIT_USER_SUCCESS = "EDIT_USER_SUCCESS";
export const EDIT_USER_FAILED = "EDIT_USER_FAILED";

export const GET_USER_BY_ID_REQUEST = "GET_USER_BY_ID_REQUEST";
export const GET_USER_BY_ID_SUCCESS = "GET_USER_BY_ID_SUCCESS";
export const GET_USER_BY_ID_FAILED = "GET_USER_BY_ID_FAILED";

export const ACTIVATE_USER_REQUEST = "ACTIVATE_USER_REQUEST";
export const ACTIVATE_USER_SUCCESS = "ACTIVATE_USER_SUCCESS";
export const ACTIVATE_USER_FAILED = "ACTIVATE_USER_FAILED";

export const BLOCK_USER_REQUEST = "BLOCK_USER_REQUEST";
export const BLOCK_USER_SUCCESS = "BLOCK_USER_SUCCESS";
export const BLOCK_USER_FAILED = "BLOCK_USER_FAILED";

export const SAVE_USER_FORM_DATA = "SAVE_USER_FORM_DATA";
export const GET_USER_FORM_DATA_ERROR = "GET_USER_FORM_DATA_ERROR";

function getUsersRequest(payload) {
  return { type: GET_USERS_REQUEST, payload };
}
function getUsersSuccess(payload) {
  return { type: GET_USERS_SUCCESS, payload };
}

function getUsersFailed(payload) {
  return { type: GET_USERS_FAILED, payload };
}

function createUserRequest(payload) {
  return { type: CREATE_USER_REQUEST, payload };
}

function createUserSuccess(payload) {
  return { type: CREATE_USER_SUCCESS, payload };
}

function createUserFailed(payload) {
  return { type: CREATE_USER_FAILED, payload };
}

function editUserRequest(payload) {
  return { type: EDIT_USER_REQUEST, payload };
}

function editUserSuccess(payload) {
  return { type: EDIT_USER_SUCCESS, payload };
}

function editUserFailed(payload) {
  return { type: EDIT_USER_FAILED, payload };
}

function getUserByIdRequest(payload) {
  return { type: GET_USER_BY_ID_REQUEST, payload };
}

function getUserByIdSuccess(payload) {
  return { type: GET_USER_BY_ID_SUCCESS, payload };
}

function getUserByIdFailed(payload) {
  return { type: GET_USER_BY_ID_FAILED, payload };
}

function activateUserRequest(payload) {
  return { type: ACTIVATE_USER_REQUEST, payload };
}
function activateUserSuccess(payload) {
  return { type: ACTIVATE_USER_SUCCESS, payload };
}
function activateUserFailed(payload) {
  return { type: ACTIVATE_USER_FAILED, payload };
}

function blockUserRequest(payload) {
  return { type: BLOCK_USER_REQUEST, payload };
}
function blockUserSuccess(payload) {
  return { type: BLOCK_USER_SUCCESS, payload };
}
function blockUserFailed(payload) {
  return { type: BLOCK_USER_FAILED, payload };
}
function saveUserFormData(payload) {
  return { type: SAVE_USER_FORM_DATA, payload };
}

function getUserFormDataError(payload) {
  return { type: GET_USER_FORM_DATA_ERROR, payload };
}

export const PROPS_TRANSLATION_MAPPINGS = {
  "Guest": "app.users.list.group_guest",
  "Operator": "app.users.list.group_operator",
  "Active": "app.users.list.status_active",
  "Blocked": "app.users.list.status_blocked",
}

export function getUsers() {
  return async dispatch => {
    dispatch(getUsersRequest());
    try {
      const result = await axios.get("/users");
      dispatch(getUsersSuccess(result.data));
    } catch (error) {
      showErrorMessage("app.users.list.users_fetch_error");
      dispatch(getUsersFailed(error));
    }
  };
}

export function createUser(newUserData, history) {
  return async dispatch => {
    dispatch(createUserRequest());
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        language: languageCode,
        userGroup: roleID
      } = newUserData;

      const newUser = {
        firstName,
        lastName,
        email,
        languageCode,
        roleId: roleID,
        propertyIds: newUserData.object,
        password
      };
      await axios.post("/users", newUser);
      dispatch(createUserSuccess());
      history.replace("/users");
      showSuccessMessage("app.users.list.user_create_successfully");
    } catch (error) {
      showErrorMessage("app.users.list.user_create_error");
      dispatch(createUserFailed(error.response));
    }
  };
}

export function editUser(userId, { object, userGroup, password }) {
  return async dispatch => {
    const reqObj = {
      propertyIds: object,
      roleId: userGroup,
      password
    };

    dispatch(editUserRequest());
    try {
      await axios.put(`/users/${userId}`, reqObj);
      dispatch(editUserSuccess());
      showSuccessMessage("app.users.list.user_update_success");
    } catch (error) {
      dispatch(editUserFailed(error.response));
      showErrorMessage("app.users.list.user_update_error");
    }
  };
}

export function getUserById(userId) {
  return async dispatch => {
    dispatch(getUserByIdRequest());
    try {
      const { data: user } = await axios.get(`/users/${userId}`);
      dispatch(getUserByIdSuccess(user));
    } catch (error) {
      dispatch(getUserByIdFailed(error.response));
    }
  };
}

export function activateUser(userId) {
  return async dispatch => {
    dispatch(activateUserRequest(userId));
    try {
      await axios.patch(`/users/${userId}/activate`);
      dispatch(activateUserSuccess(userId));
      showSuccessMessage("app.users.list.user_activate_success");
    } catch (error) {
      showErrorMessage("app.users.list.user_activate_error");
      dispatch(activateUserFailed(error));
    }
  };
}

export function blockUser(userId) {
  return async dispatch => {
    dispatch(blockUserRequest(userId));
    try {
      await axios.patch(`/users/${userId}/block`);
      dispatch(blockUserSuccess(userId));
      showSuccessMessage("app.users.list.user_block_success");
    } catch (error) {
      showErrorMessage("app.users.list.user_block_error");
      dispatch(blockUserFailed(error));
    }
  };
}

export function getUserFormData() {
  return async dispatch => {
    try {
      const [roles, properties, languages] = await Promise.all([
        getUserRoles(),
        getUserProperties(),
        getUserLanguages()
      ]);
      dispatch(saveUserFormData({ roles, properties, languages }));
    } catch (error) {
      getUserFormDataError(error);
    }
  };
}

async function getUserRoles() {
  const res = await axios.get("/roles");
  return res.data;
}

async function getUserProperties() {
  const res = await axios.get("/users/properties");
  return res.data;
}

async function getUserLanguages() {
  const res = await axios.get("/data/languages");
  return res.data.languages;
}
