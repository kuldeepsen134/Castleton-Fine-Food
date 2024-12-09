const { Policy } = require("../models");
const { handleError, handleResponse } = require("../utils/helpers");
const { strings } = require("../utils/string");
const { policyUpdateSchema, policyCreateSchema } = require("./validator/policy");

exports.create = async (req, res) => {
    try {
        const { error } = policyCreateSchema.validate(req.body,);
        if (error) {
            handleError(error, req, res)
            return
        };

        const data = {
            policy_name: req.body.policy_name,
            policy_content: req.body.policy_content,
            policy_type: req.body.policy_type
        };

        const policy = await Policy.create(data)
        handleResponse(res, policy, strings.PolicyCreated, 1)

    } catch (err) {
        handleError(err, req, res, 0)
    }
};


exports.findAll = async (req, res) => {
    try {
        const policy = await Policy.findOne({ where: { policy_type: req.body.policy_type } })
        handleResponse(res, policy.dataValues, strings.SuccessfullyRetrData, 1)
    } catch (err) {
        handleError(err, req, res, 0)
    };
};


exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const policy = await Policy.findOne({ where: { id: id } })

        if (!policy) {
            handleError(strings.InvalidPolicyId, req, res, 0)
            return;
        };

        const { error } = policyUpdateSchema.validate(req.body,);

        if (error) {
            handleError(error, req, res)
            return
        }

        const data = {
            policy_name: req.body.policy_name,
            policy_content: req.body.policy_content,
            policy_type: req.body.policy_type
        }

        await Policy.update(data, { where: { id: id } })

        handleResponse(res, [], strings.PolicyUpdate, 1)

    } catch (err) {
        handleError(err, req, res, 0)
    }
};


exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await Policy.findOne({ where: { id: id } })

        if (!policy) {
            handleError(strings.InvalidPolicyId, req, res, 0)
            return;
        };

        await Policy.destroy({ where: { id: id } })

        handleResponse(res, [], strings.PolicyDeleted);

    } catch (err) {
        handleError(err, req, res);
    }
};