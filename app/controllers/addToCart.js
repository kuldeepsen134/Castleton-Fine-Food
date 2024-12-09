const { AddToCart, FoodItem, User } = require("../models");
const { handleResponse, handleError, getPagination, sortingData, handleSearchQuery, getPagingResults } = require("../utils/helpers");
const { strings } = require("../utils/string");
const { createAddToCart } = require("./validator/addToCart");


exports.create = async (req, res) => {
    const { quantity, food_item_id } = req.body;

    const { error } = createAddToCart.validate(req.body,);
    if (error) {
        handleError(error, req, res)
        return
    }

    const foodItem = await FoodItem.findOne({ where: { id: food_item_id } })

    if (!foodItem) {
        return handleError('Invalid food item Id', req, res, 0)
    }

    const data = { quantity, price: foodItem?.discounted_price, food_item_id, user_id: req.user.id }

    AddToCart.create(data)
        .then(cart => {
            handleResponse(res, cart, strings.AddToCartCreated, 1);
        }).catch(err => {

            handleError(err, req, res, 0);
        });
}

exports.findAll = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);
    AddToCart.findAndCountAll(
        {
            where: handleSearchQuery(req, ['id']),
            order: [[sortResponse.sortKey, sortResponse.sortValue]],
            include: [{ model: FoodItem },
            { model: User, attributes: { exclude: ['password', 'token', 'status'] } } // Exclude attributes from User model

            ],
            limit, offset,
        }
    )
        .then(data => {
            handleResponse(res, getPagingResults(data, page, limit), strings.SuccessfullyRetrDataList, 1);
        }).catch(err => {
            handleError(err, req, res, 0);
        });
};


exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;

        const { quantity } = req.body;

        const addToCart = await AddToCart.findOne({ where: { id: id } },)

        if (!addToCart) {
            handleError(strings.InvalidCartId, req, res, 0);
            return
        }

        handleResponse(res, addToCart.dataValues, strings.SuccessfullyRetrDataList, 1);
    } catch (error) {
        handleError(error, req, res, 0);
    }
};



exports.update = async (req, res) => {
    try {
        const { id } = req.params

        const addToCart = await AddToCart.findOne({ where: { id: id } })

        if (!addToCart) {
            handleError(strings.InvalidCartId, req, res, 0);
            return
        };

        const data = {
            user_id: req.body.user_id,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            postcode: req.body.postcode,
            status: req.body.status,
        };

        // const addressUpdate = await Address.update(data, { where: { id: id } })

        handleResponse(res, [], strings.AddressSuccessfullyUpdate, 1);

    } catch (error) {
        handleError(error, req, res, 0);
    }



};


exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const addToCart = await AddToCart.findOne({ where: { id: id } })

        if (!addToCart) {
            handleError(strings.InvalidCartId, req, res, 0);
            return
        };

        await AddToCart.destroy({ where: { id: id } });
        handleResponse(res, [], strings.CartSuccessfullyRemove, 1);

    } catch (error) {
        handleError(error, req, res, 0);
    }
};