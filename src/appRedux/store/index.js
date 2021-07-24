import { applyMiddleware, compose, createStore } from "redux";
import reducers from "../reducers/index";
import { routerMiddleware } from "react-router-redux";
import thunk from 'redux-thunk';
import jwt from '../middleware/jwt';

const createHistory = require("history").createBrowserHistory;

const history = createHistory();
const routeMiddleware = routerMiddleware(history);

const middlewares = [jwt, thunk, routeMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const store = createStore(reducers, initialState,
    composeEnhancers(applyMiddleware(...middlewares)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

const store = configureStore();

export { history, store };
