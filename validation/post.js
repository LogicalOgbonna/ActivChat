const validator = require("validator");
const isEmpty = require("./is-empty");
const _ = require("lodash");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post field must be between 10 to 300  ";
  }

  if (validator.isEmpty(data.text)) {
    errors.text = "Post field is required";
  }

  return {
    errors,
    isvalid: _.isEmpty(errors)
  };
};
