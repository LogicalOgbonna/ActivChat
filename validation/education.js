const validator = require("validator");
const isEmpty = require("./is-empty");
const _ = require("lodash");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (!validator.isLength(data.school, { min: 5, max: 20 })) {
    errors.school = "School name needs to be atleast 3 characters and above";
  }

  if (validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  if (!validator.isLength(data.degree, { min: 3, max: 15 })) {
    errors.degree = "Degree field needs to be atleast 3 characters and above";
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  if (!validator.isLength(data.fieldofstudy, { min: 5, max: 20 })) {
    errors.fieldofstudy =
      "Field of study needs to be atleast 5  characters and above";
  }

  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Course of study field is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isvalid: _.isEmpty(errors)
  };
};
