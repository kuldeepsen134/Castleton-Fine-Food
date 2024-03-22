const Joi = require('joi')

const createUser = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  mobile_number: Joi.string().min(10).max(13).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
//   role: Joi.string().required(),
})

const updateUser = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  mobile_number: Joi.string().min(10).max(13).pattern(/^[0-9]+$/).required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  status: Joi.string().required()
});


module.exports = {
  createUser,
  updateUser,
}


