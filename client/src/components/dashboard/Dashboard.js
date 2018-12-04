import React, { Component } from "react";
import { connect } from "react-redux";
import propTypes from "prop-types";
import { getCurrentUser, deleteAccount } from "../../actions/profileActions";
import Spiner from "../common/Spinner";
import _ from "lodash";
import { Link } from "react-router-dom";
import ProfileAction from "./ProfileAction";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let DashboardContent;
    if (profile === null || loading) {
      DashboardContent = <Spiner />;
    } else {
      // Check if logged in user has a profile
      if (!_.isEmpty(profile)) {
        DashboardContent = (
          <div>
            <p className="lead text-muted">
              Welcome{" "}
              <Link to={`/profile/${profile.handle}`}>{user.name} </Link>
            </p>
            <ProfileAction />

            <div style={{ marginBottom: "60px" }} />
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-danger"
            >
              Delete My Account
            </button>
          </div>
        );
      } else {
        DashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup your profile, please add your profile</p>
            <Link to="create-profile" className="btn btn-lg btn-info">
              {" "}
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {DashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

Dashboard.propTypes = {
  getCurrentUser: propTypes.func.isRequired,
  deleteAccount: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  profile: propTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  { getCurrentUser, deleteAccount }
)(Dashboard);
