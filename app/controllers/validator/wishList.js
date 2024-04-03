const Joi = require('joi')

const createWishList = Joi.object().keys({
    food_item_id: Joi.string().required(),
})


const updateWishList = Joi.object().keys({
    food_item_id: Joi.string().required()
})




module.exports = {

    createWishList,
    updateWishList,


}