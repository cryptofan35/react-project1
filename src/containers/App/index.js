import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { IntlProvider } from 'react-intl-hooks';


import AppLocale from "lngProvider";
import MainApp from "./MainApp";
import SignIn from "../../pages/Auth/SignIn";
import SignUp from "../../pages/Auth/SignUp";
import ForgotPassword from "../../pages/Auth/ForgotPassword";
import ResetPassword from "../../pages/Auth/ResetPassword";
import VerifyEmail from "../../pages/Auth/VerifyEmail";
import Confirm from "../../pages/Auth/Confirm";

import { setInitUrl } from "appRedux/actions/Auth";
import axios from "util/Api";

import AppLoading from "../../components/Global/AppLoading";
import { getInitialAppData } from "../../appRedux/actions/Global";
import UploadTemplateRoute from "routes/UploadTemplate";
import Voucher from "../../pages/Voucher/Voucher";

const RestrictedRoute = ({ component: Component, token, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

class App extends Component {
  componentWillMount() {}

  componentDidMount() {
    const { token, initialDataLoaded } = this.props;
    if (this.props.initURL === "") {
      this.props.setInitUrl(this.props.history.location.pathname);
    }

    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      if (!initialDataLoaded) {
        this.props.getInitialAppData();
      }
    }
  }

  render() {
    const { match, location, locale, token, initURL, appLoading, property = {} } = this.props;
    if (appLoading) {
      return <AppLoading />;
    }

    if (location.pathname === "/dashboard") {
      if (property && !property.objectId) { // If no property -> redirect to property name settings

        return <Redirect to="/property/add"/>;
      }
    } else if (location.pathname === "/") {
      if (token === null) {
        return <Redirect to={"/signin"} />;
      }
      if (!property || !property.objectId) { // If no property -> redirect to property name settings
        return <Redirect to="/property/add"/>
      }
      if (initURL === "" || initURL === "/" || initURL === "/signin") {
        return <Redirect to={"/dashboard"} />;
      }

      return <Redirect to={initURL} />;

    } else if (location.pathname === "/rooms") {
      if (property && !property.objectId) { // If no property -> redirect to property name settings

        return <Redirect to="/property/add"/>;
      }

    } else if (location.pathname === "/packages") {
      if (property && !property.objectId) { // If no property -> redirect to property name settings

        return <Redirect to="/property/add"/>;
      }
    }

    const currentAppLocale = AppLocale[locale.locale];
    return (
      // <LocaleProvider locale={currentAppLocale.antd}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
        onError={(err) => {
          if (err.code === "MISSING_TRANSLATION") {
            console.warn("Missing translation", err.message);
            return;
          }
          throw err;
        }}
      >
        <Switch>
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:token"
            component={ResetPassword}
          />
          <Route exact path="/verify-email" component={VerifyEmail} />
          <Route exact path="/confirm/:token" component={Confirm} />
          <Route exact path="/voucher-preview/:id" component={Voucher} />

          <Route
            exact
            path={`/upload-template`}
            component={UploadTemplateRoute}
          />
          <RestrictedRoute
            path={`${match.url}`}
            token={token}
            component={MainApp}
          />
        </Switch>
      </IntlProvider>
      // </LocaleProvider>
    );
  }
}

const mapStateToProps = ({ settings, auth, global, property }) => {
  const { locale } = settings;
  const { token, initURL } = auth;

  return {
    locale,
    token,
    initURL,
    appLoading: global.appLoading,
    initialDataLoaded: global.initialDataLoaded,
    property: property.property
  };
};

export default connect(mapStateToProps, {
  setInitUrl,
  getInitialAppData
})(App);
