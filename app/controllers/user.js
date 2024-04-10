const md5 = require('md5');

const { createUser, updateUser } = require('./validator/user');
const { User, Address } = require('../models');
const { handleResponse, handleError, handleSearchQuery, getPagination, sortingData, getPagingResults } = require('../utils/helpers');
const { strings } = require('../utils/string');

exports.create = async (req, res) => {
    const { error } = createUser.validate(req.body,);

    if (error) {
        handleError(error, req, res)
        return
    }

    const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_number: req.body.mobile_number,
        email: req.body.email,
        password: md5(req.body.password),
        role: 'customer',
    };

    User.create(data)
        .then(user => {
            handleResponse(res, user, strings.UserSuccessFullyCreate, 1);
        }).catch(err => {

            handleError(err, req, res, 0);
        });
}

exports.findAll = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);
    User.findAndCountAll(
        {
            where: handleSearchQuery(req, ['first_name', 'last_name', 'email', 'id']),
            order: [[sortResponse.sortKey, sortResponse.sortValue]],
            include: [{ model: Address }],
            limit, offset,
            attributes: { exclude: ['password', 'token', 'status'] },
        }
    )
        .then(data => {
            handleResponse(res, getPagingResults(data, page, limit), strings.SuccessfullyRetrDataList, 1);
        }).catch(err => {
            handleError(err, req, res, 0);
        });
};

exports.findOne = async (req, res) => {

    const id = req.params.id;

    const user = await User.findOne({ where: { id: id } })

    user === null ? handleError(strings.UserNotFound, req, res, 0) :

        User.findByPk(id, {
        })
            .then(data => {
                handleResponse(res, data.dataValues, strings.SuccessfullyRetrData, 1);
            }).catch(err => {
                handleError(err, req, res, 0);
            });
};



exports.update = async (req, res) => {

    const { error } = updateUser.validate(req.body,);

    if (error) {
        handleError(error, req, res)
        return
    }

    const { id } = req.params

    const user = await User.findOne({ where: { id: id } })

    if (!user) {
        handleError(strings.UserNotFound, req, res)
        return
    }


    const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        mobile_number: req.body.mobile_number,
        email: req.body.email,
        role: req.body.role,
        status: req.body.status
    };

    User.update(data, { where: { id: id } })
        .then(data => {
            handleResponse(res, [], strings.UserSuccessfullyUpdate);
        }).catch(err => {
            handleError(err, req, res);
        })

};

exports.delete = async (req, res) => {

    const id = req.params.id;

    const user = await User.findOne({ where: { id: id } })
    if (user?.role === 'admin') {
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