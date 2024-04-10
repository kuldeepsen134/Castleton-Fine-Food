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


exports.update = async (req, res) => {
    const { id } = req.params
    const { policy_name, policy_content, policy_type } = req.body;
    const data = { policy_name, policy_content, policy_type }

    Policy.update(data, { where: { id: id } })
        .then((data) => handleResponse(res, data, strings.PolicyUpdate, 1))
        .catch((err) => handleError(err, req, res, 0))
};



exports.delete = async (req, res) => {

    const id = req.params.id;

    const policy = await Policy.findOne({ where: { id: id } })
    if (req.user?.role === 'admin') {
        handleError(strings.AdminForbidden, req, res, 0)
        return
    }
    user === null ? handleError(strings.UserNotFound, req, res) :

        User.destroy({ where: { id: req.params.id } })
            .then(data => {
                handleResponse(res, data, strings.UserSuccessfullyDelete);
            }).catch(err => {
                handleError(err, req, res);
            });
};