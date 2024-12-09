const { WishList, FoodItem, User } = require("../models");
const { handleResponse, handleError, getPagination, sortingData, getPagingResults, handleSearchQuery } = require("../utils/helpers");
const { strings } = require("../utils/string");
const { createWishList } = require("./validator/wishList");

exports.create = async (req, res) => {
    const { food_item_id } = req.body;

    const { error } = createWishList.validate(req.body,);
    if (error) {
        handleError(error, req, res)
        return
    }

    const foodItem = await FoodItem.findOne({ where: { id: food_item_id } })
    if (!foodItem) {
        return handleError('Invalid food item Id', req, res, 0)
    }

    const data = { food_item_id, user_id: req.user.id }
    WishList.create(data)
        .then(cart => {
            handleResponse(res, cart, strings.WishListCreated, 1);
        }).catch(err => {

            handleError(err, req, res, 0);
        });
}

exports.findAll = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);
    WishList.findAndCountAll(
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

exports.findOne = (req, res) => {
    WishList.findOne({ where: { id: req.params.id, user_id: req.user.id }, include: [{ model: FoodItem }] })
        .then(data => {
            handleResponse(res, data.dataValues, strings.SuccessfullyRetrDataList, 1);
        }).catch(err => {
            handleError(err, req, res, 0);
        });
};





exports.delete = async (req, res) => {
    const id = req.params.id;

    const wishList = await WishList.findOne({ where: { id: id } })

    wishList === null ? handleError(strings.WishListNotFound, req, res, 0) :

        WishList.destroy({ where: { id: req.params.id, user_id: req.user.id } })
            .then(data => {
                handleResponse(res, data, strings.WishListSuccessfullyDelete);
            }).catch(err => {
                handleError(err, req, res, 0);
            });
};