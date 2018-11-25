const validator = require("validator");
const isEmpty = require("./is-empty");
const _ = require("lodash");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!validator.isLength(data.handle, { min: 3, max: 40 })) {
    errors.handle = "Handle needs to be between 2 and 4 characters";
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile Handle is required";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }

  if (!_.isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = `${data.website} is not a valid URL`;
    }
  }

  if (!_.isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = `${data.youtube} is not a valid Youtube URL`;
    }
  }

  if (!_.isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = `${data.twitter} is not a valid Twitter URL`;
    }
  }

  if (!_.isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = `${data.facebook} is not a valid Facebook URL`;
    }
  }

  if (!_.isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = `${data.linkedin} is not a valid Linkedin URL`;
    }
  }

  if (!_.isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = `${data.instagram} is not a valid Instagram URL`;
    }
  }

  return {
    errors,
    isvalid: _.isEmpty(errors)
  };
};
