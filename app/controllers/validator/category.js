const Joi = require('joi')

const createCategory = Joi.object().keys({
  name: Joi.string().required(),
  parent_id: Joi.allow(null),
  description: Joi.string().allow(null),
})

const updateCategory = Joi.object().keys({
  name: Joi.string(),
  parent_id: Joi.allow(null),
  description: Joi.string().allow(null),

})


module.exports = { createCategory, updateCategory, };