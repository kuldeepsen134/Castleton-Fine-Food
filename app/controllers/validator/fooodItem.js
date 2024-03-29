const Joi = require('joi')

const createFoodItem = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().allow(null),
  short_description: Joi.string().allow(null),
  quantity: Joi.number().required(),
  regular_price: Joi.number().required(),
  discounted_price: Joi.number().required(),
  cost_per_item: Joi.number().required(),
  food_item_type: Joi.string().required(),
  backorders: Joi.string().required(),
  stock_status: Joi.string().required(),
  is_jain: Joi.string().required(),

  category_id: Joi.allow(null).required(),
  image: Joi.string().allow(null),

})

const updateFoodItem = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(null),
    short_description: Joi.string().allow(null),
    quantity: Joi.number().required(),
    regular_price: Joi.number().required(),
    discounted_price: Joi.number().required(),
    cost_per_item: Joi.number().required(),
    food_item_type: Joi.string().required(),
    backorders: Joi.string().required(),
    stock_status: Joi.string().required(),
    is_jain: Joi.string().required(),

    category_id: Joi.allow(null).required(),

})




module.exports = {
    createFoodItem,
    updateFoodItem,
  
  
  }