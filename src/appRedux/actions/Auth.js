import {
  INIT_URL,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET,
  SHOW_MESSAGE,
  SWITCH_LANGUAGE,
  REFRESHING_TOKEN,
  DONE_REFRESHING_TOKEN,
  ERROR_REFRESHING_TOKEN
} from "../../constants/ActionTypes";
import axios from "util/Api";
import {baseURL} from '../../util/Api'

export const setInitUrl = url => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const userSignUp = ({ name, email, password }) => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("auth/signup", {
        name: name,
        email: email,
        password: password
      })
      .then(({ data }) => {
        if (data.result) {
          axios.defaults.headers.common["access-token"] = "Bearer " + data.accessToken;
          axios.defaults.headers.common["Authorization"] = "Bearer " + data.accessToken;
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: USER_TOKEN_SET, payload: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }
          });
          dispatch({ type: USER_DATA, payload: data.user });
        } else {
          return data.status;
        }
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
      });
  };
};

export const userSignIn = ({ email, password }) => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("auth/signin", {
        email: email,
        password: password
      })
      .then(({ data }) => {
        if (data.result) {
          sessionStorage.setItem("token", JSON.stringify(data.accessToken));
          sessionStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
          sessionStorage.setItem(
            "user",
            JSON.stringify({
              id: data.user.id,
              name: data.user.name,
              last_name: data.user.last_name,
              language_id: data.user.language_id,
              email: data.user.email,
              email_verified_at: data.user.email_verified_at,
              role: data.user.role
            })
          );
          axios.defaults.headers.common["access-token"] =
            "Bearer " + data.accessToken;

          axios.defaults.headers.common["Authorization"] =
            "Bearer " + data.accessToken;
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: USER_DATA, payload: data.user });
          dispatch({ type: USER_TOKEN_SET, payload: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }
          });
        } else {
          return data.status;
        }
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.response });
        console.log("Error****:", error.message);
      });
  };
};

export const userForgot = ({ email }) => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("auth/forgot", {
        email: email
      })
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({
            type: SHOW_MESSAGE,
            payload: "Check your mail box further proceeding"
          });
        } else {
          return data.status;
        }
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
      });
  };
};

export const getUser = () => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post("auth/me")
      .then(({ data }) => {
        if (data.result) {
          // sessionStorage.setItem("token", JSON.stringify(data.accessToken));
          // sessionStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
          // axios.defaults.headers.common["access-token"] =
          //   "Bearer " + data.accessToken;
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: USER_DATA, payload: data.user });
          dispatch({ type: SWITCH_LANGUAGE, payload: data.user.language_id });
          // dispatch({ type: SIGNOUT_USER_SUCCESS });
          // this.userSignOut()
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
          // userSignOut()
        }
        return data;
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log("Error****:", error.message);
        return error;
      });
  };
};

export const userSignOut = () => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["access-token"];
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: FETCH_SUCCESS });
    dispatch({ type: SIGNOUT_USER_SUCCESS });
  };
};

export const userConfirm = token => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["access-token"];
    delete axios.defaults.headers.common["Authorization"];
    dispatch({ type: SIGNOUT_USER_SUCCESS });
    return axios
      .get(`auth/confirm/${token}`)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
      });
  };
};

export const resendEmail = user => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    return axios
      .post(`auth/resend`, {
        id: user.id,
        name: user.name,
        email: user.email
      })
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: SHOW_MESSAGE, payload: data.message });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
      });
  };
};

export const requestForResetPassword = (token) => async (dispatch) => {
    try {
      dispatch({ type: FETCH_START });
      const req = await fetch(`${baseURL}auth/reset/${token}`)
      if(req.status !== 200){
        dispatch({ type: FETCH_ERROR, payload: req.error });
        const json = await req.json()
        console.log(json)
        return new Promise((_, rej) => {
          dispatch({ type: FETCH_ERROR, payload: json.error });
          rej(json)
        })
      }
      await req.json()
      dispatch({ type: FETCH_SUCCESS });

    } catch (e) {
      dispatch({ type: FETCH_ERROR, payload: e });
    }
}

export const changePassword = (password, token) => async (dispatch) => {
  try {
    const req = await fetch(`${baseURL}auth/reset`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${token}`,
        'access-token': `Bearer ${token}`
      },
      body: JSON.stringify({
        password
      })
    });
    if(req.status === 200) {
      const json = await req.json()
      dispatch({ type: SHOW_MESSAGE, payload: "app.reset_password.changed" });
      return new Promise((res) => {
        res(json)
      })
    }
    dispatch({ type: FETCH_SUCCESS });
  } catch (e) {
    dispatch({ type: FETCH_ERROR, payload: e });
  }
}

export const refreshToken = refreshToken => dispatch => {
    let freshTokenPromise = fetch(`${baseURL}auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${refreshToken}`,
        'access-token': `Bearer ${refreshToken}`
      }
    })
    .then(async response => {
      const t = await response.json();

      if (t.accessToken && t.refreshToken) {

        dispatch({ type: DONE_REFRESHING_TOKEN });
        dispatch({ type: USER_TOKEN_SET, payload: {
            accessToken: t.accessToken,
            refreshToken: t.refreshToken,
          }
        });

        sessionStorage.setItem("token", JSON.stringify(t.accessToken));
        sessionStorage.setItem("refreshToken", JSON.stringify(t.refreshToken));

        axios.defaults.headers.common["access-token"] =
          "Bearer " + t.accessToken;

        axios.defaults.headers.common["Authorization"] =
            "Bearer " + t.accessToken;
      }

      return t.accessToken ? Promise.resolve(t.accessToken) : Promise.reject({message:'could not refresh token'});
    })
    .catch(e => {
      console.log('error refreshing token', e);

      dispatch({ type: ERROR_REFRESHING_TOKEN });
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      delete axios.defaults.headers.common["access-token"];
      delete axios.defaults.headers.common["Authorization"];
      dispatch({ type: SIGNOUT_USER_SUCCESS });

      return Promise.reject(e);
    });

    dispatch({
      type: REFRESHING_TOKEN,
      freshTokenPromise
    });

    return freshTokenPromise;
}
