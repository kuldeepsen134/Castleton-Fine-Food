const { AddToCart, FoodItem, User } = require("../models");
const { handleResponse, handleError, getPagination, sortingData, handleSearchQuery, getPagingResults } = require("../utils/helpers");
const { strings } = require("../utils/string");
const { createAddToCart } = require("./validator/addToCart");




exports.create = async (req, res) => {
    const { quantity, price, food_item_id } = req.body;

    const { error } = createAddToCart.validate(req.body,);
    if (error) {
        handleError(error, req, res)
        return
    }

    const data = { quantity, price, food_item_id, user_id: req.user.id }

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
            // attributes: { exclude: ['password', 'token', 'status'] },
        }
    )
        .then(data => {
            handleResponse(res, getPagingResults(data, page, limit), strings.SuccessfullyRetrDataList, 1);
        }).catch(err => {
            handleError(err, req, res, 0);
        });
};