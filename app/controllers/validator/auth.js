const Joi = require('joi');

const loginUser = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const resetPasswordEmail = Joi.object().keys({
  email: Joi.string().email().required(),
});

const updatePassword = Joi.object().keys({
  token: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
  confirm_password: Joi.string().min(6).required(),
});

module.exports = {
  loginUser,
  resetPasswordEmail,
  updatePassword
};