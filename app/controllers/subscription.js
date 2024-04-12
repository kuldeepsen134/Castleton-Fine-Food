const { Subscription } = require("../models");
const { handleError, handleResponse } = require("../utils/helpers");
const { strings } = require("../utils/string");

// Controller functions
exports.create = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            duration: req.body.duration,
            delivery_frequency: req.body.delivery_frequency
        };

        const subscription = await Subscription.create(data);

        handleResponse(res, subscription, strings.SubscriptionCreated, 1)

    } catch (err) {
        handleError(err, req, res, 0)
    }
};


exports.findOne = async (req, res) => {
    try {
        const subscription = await Subscription.findByPk(req.params.id);
        if (!subscription) {
            handleError(req, res, 0)
            return
        }

        handleResponse(res, subscription, strings.SuccessfullyRetrData, 1);

    } catch (err) {
        handleError(err, req, res, 0)
    }
};