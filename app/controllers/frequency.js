const { Subscription, Frequency } = require("../models");
const { handleError, handleResponse } = require("../utils/helpers");
const { strings } = require("../utils/string");

// Controller functions
exports.create = async (req, res) => {
    try {
        const data = { user_id: req.user.id, subscription_id: req.body.subscription_id }
        const frequency = await Frequency.create(data);
        handleResponse(res, frequency, strings.FrequencyCreated, 1)
    } catch (err) {
        handleError(err, req, res, 0)
    }
};

exports.findOne = async (req, res) => {
    try {
        const frequency = await frequency.findByPk(req.params.id);
        if (!frequency) {
            handleError(strings.FrequencyNotFound, req, res, 0)
        } 
        handleResponse(res, frequency, strings.SuccessfullyRetrData, 1)
    } catch (err) {
        handleError(err, req, res, 0)
    }
};
