import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import propTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated ? <Component {...props} /> : <Redirect to="login" />
    }
  />
);

const mapStateToProps = state => ({
  auth: state.auth
});

PrivateRoute.prototype = {
  auth: propTypes.object.isRequired
};

export default connect(mapStateToProps)(PrivateRoute);
