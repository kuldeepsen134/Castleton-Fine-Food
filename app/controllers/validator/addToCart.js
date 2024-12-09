const Joi = require('joi')

const createAddToCart = Joi.object().keys({
    quantity: Joi.number().min(1).required(),
    food_item_id: Joi.string().required(),
})


const updateAddToCart = Joi.object().keys({
    quantity: Joi.number().min(1).required(),
    price: Joi.number().precision(2).positive().required(),
    food_item_id: Joi.string().required()
})




module.exports = {

    createAddToCart,
    updateAddToCart,


}