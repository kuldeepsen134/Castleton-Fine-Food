const Joi = require('joi')

const cartSchema = Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().precision(2).positive().required(),
    food_item_id: Joi.string().required(),
    user_id: Joi.string().required()
})

const createOrder = Joi.object({
    items: Joi.array().items(cartSchema).min(1).required()
});

const updateAddToCart = Joi.object().keys({
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().precision(2).positive().required(),
    food_item_id: Joi.string().required()
})




module.exports = {
    createOrder,
    updateAddToCart,
}