import React, { Fragment } from "react";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

// import "assets/vendors/style";
import "styles/cultbay.less";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import ReduxToastr from "react-redux-toastr";

import { store, history } from "./appRedux/store";
import App from "./containers/App/index";


const NextApp = () => (
  <Provider store={store}>
    <Fragment>
      <ReduxToastr
        timeOut={2000}
        position="top-right"
        getState={state => state.toastr}
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        closeOnToastrClick
      />
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ConnectedRouter>
    </Fragment>
  </Provider>
);

export default NextApp;
