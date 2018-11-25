const validator = require("validator");
const isEmpty = require("./is-empty");
const _ = require("lodash");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (!validator.isLength(data.title, { min: 5, max: 20 })) {
    errors.title = "Title needs to be between 5 and 20 characters";
  }

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (!validator.isLength(data.company, { min: 3, max: 15 })) {
    errors.company = "Company name needs to be between 3 and 15 characters";
  }

  if (validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isvalid: _.isEmpty(errors)
  };
};
