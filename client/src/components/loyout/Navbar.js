import React, { Component } from "react";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            href="#"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            {user ? (
              <img
                className="rounded-circle"
                style={{ width: "25px", marginRight: "5px" }}
                src={user.avatar}
                alt={user.name}
                title="You must have a Gravatar connected to your email to display your image "
              />
            ) : null}{" "}
            Logout
          </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            ActivChat
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

Navbar.propTypes = {
  logoutUser: propTypes.func.isRequired,
  auth: propTypes.object.isRequired
};
export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
