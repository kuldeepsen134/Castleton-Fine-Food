const Joi = require('joi')

const policyCreateSchema = Joi.object().keys({
    policy_name: Joi.string().required(),
    policy_content:  Joi.string().required(),
    policy_type:  Joi.string().required(),
})


const policyUpdateSchema = Joi.object().keys({
    policy_name: Joi.string(),
    policy_content:  Joi.string(),
    policy_type:  Joi.string(),
})




module.exports = {
    policyCreateSchema,
    policyUpdateSchema,
}