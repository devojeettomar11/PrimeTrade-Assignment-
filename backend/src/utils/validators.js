const validator = require("validator");

const validateRegister = ({ name, email, password }) => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (!email || !validator.isEmail(email)) {
    return "Valid email is required";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  return null;
};

const validateLogin = ({ email, password }) => {
  if (!email || !validator.isEmail(email)) {
    return "Valid email is required";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};

const validateTask = ({ title }) => {
  if (!title || title.trim().length < 2) {
    return "Task title must be at least 2 characters long";
  }
  return null;
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask
};
