import {
  FETCH_ERROR, 
  FETCH_START, 
  FETCH_SUCCESS, 
  HIDE_MESSAGE, 
  SHOW_MESSAGE,
  SET_NOTIFICATION_MESSAGE
} from '../../constants/ActionTypes'

const INIT_STATE = {
  error: '',
  loading: false,
  loadingCount: 0,
  message: '',
  notificationMessage: {
    title: '',
    message: ''
  }
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_START: {
      return {...state, error: '', message: '', loading: true, loadingCount: state.loadingCount + 1};
    }
    case FETCH_SUCCESS: {
      return {...state, error: '', message: '', loading: state.loadingCount > 1, loadingCount: state.loadingCount > 1 ? state.loadingCount - 1 : 0};
    }
    case SHOW_MESSAGE: {
      return {...state, error: '', message: action.payload, loading: state.loadingCount > 1, loadingCount: state.loadingCount > 1 ? state.loadingCount - 1 : 0};
    }
    case FETCH_ERROR: {
      return {...state, loading: state.loadingCount > 1, loadingCount: state.loadingCount > 1 ? state.loadingCount - 1 : 0, error: action.payload, message: ''};
    }
    case HIDE_MESSAGE: {
      return {...state, loading: state.loadingCount > 1, loadingCount: state.loadingCount > 1 ? state.loadingCount - 1 : 0, error: '', message: ''};
    }
    case SET_NOTIFICATION_MESSAGE: {
      return {
        ...state,
        notificationMessage: action.payload
      }
    }
    default:
      return state;
  }
}
