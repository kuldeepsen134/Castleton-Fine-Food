const { Policy } = require("../models");
const { handleError, handleResponse } = require("../utils/helpers");
const { strings } = require("../utils/string");

exports.create = async (req, res) => {
    const { policy_name, policy_content, policy_type } = req.body;
    const data = { policy_name, policy_content, policy_type }

    Policy.create(data)
        .then((data) => handleResponse(res, data, strings.PolicyCreated, 1))
        .catch((err) => handleError(err, req, res, 0))
};


exports.findAll = async (req, res) => {
    Policy.findOne({ where: { policy_type: req.body.policy_type } })
        .then(data => {
            handleResponse(res, data.dataValues, strings.SuccessfullyRetrData, 1)
        })
        .catch((err) => handleError(err, req, res, 0))
}