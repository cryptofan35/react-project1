import { refreshToken, userSignOut } from '../actions/Auth';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import axios from 'axios';
import { DONE_REFRESHING_TOKEN, ERROR_REFRESHING_TOKEN, REFRESHING_TOKEN, USER_TOKEN_SET } from 'constants/ActionTypes';

export default function jwt({ dispatch, getState }) {
  return next => action => {

      if ([REFRESHING_TOKEN, DONE_REFRESHING_TOKEN, ERROR_REFRESHING_TOKEN, USER_TOKEN_SET].includes(action.type)) {
        next(action);
        return;
      }

      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      if (getState().auth && getState().auth.token && getState().auth.refreshToken) {

        const refreshTokenExpiration = jwtDecode(getState().auth.refreshToken).exp;

        if (refreshTokenExpiration && (moment(Date.now()) > moment(refreshTokenExpiration * 1000))) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          delete axios.defaults.headers.common["access-token"];
          delete axios.defaults.headers.common["Authorization"];

          window.location.reload();
          next(action);
          return;
        }

        const tokenExpiration = jwtDecode(getState().auth.token).exp;

        //if the token expiration happens in the next 5 seconds, refresh the token.
        if (tokenExpiration && (moment(tokenExpiration * 1000) - moment(Date.now()) < 5000)) {

          if (!getState().auth.freshTokenPromise) {
            return refreshToken(getState().auth.refreshToken)(dispatch).then(() => next(action));
          } else {
            return getState().auth.freshTokenPromise.then(() => next(action));
          }
        }
      }

    next(action);
  }
}
