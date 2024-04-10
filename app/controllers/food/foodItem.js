const { FoodItem, Media } = require("../../models");
const { handleError, handleResponse, getPagination, sortingData, getPagingResults, handleSearchQuery, getMediaFile } = require("../../utils/helpers");
const { strings } = require("../../utils/string");
const { createFoodItem } = require("../validator/fooodItem");

exports.create = async (req, res) => {
    const { error } = createFoodItem.validate(req.body,)

    if (error) {
        handleError(error, req, res)
        return
    }

    const { name, description, short_description, quantity, regular_price, discounted_price, cost_per_item, food_item_type, backorders, stock_status, is_jain, category_id } = req.body

    const data = { name, description, short_description, quantity, total_quantity: quantity, regular_price, discounted_price, cost_per_item, food_item_type, backorders, stock_status, is_jain, category_id }

    FoodItem.create(data)
        .then(result => {
            if (req.file) {
                const fileData = {
                    name: req.file.filename,
                    mime_data: req.file.mimetype,
                    path: `/media/${req.file?.filename}`,
                    food_item_id: result.id
                }

                Media.create(fileData)
            }

            handleResponse(res, result, strings.FoodItemsSuccessfullyCreate, 1)
        }).catch(err => {
            handleError(err, req, res)
        })
};

exports.findAll = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sortResponse = sortingData(req);

    FoodItem.findAndCountAll({
        where: handleSearchQuery(req, ['name', 'last_name',]), order: [[sortResponse.sortKey, sortResponse.sortValue]], include: [
            { model: Media }
        ], limit, offset,
    })
        .then((data) => {

            for (let i = 0; i < data.rows.length; i++) {
                const element = data.rows[i];
                const x = getMediaFile(element.id)
            }

            handleResponse(res, getPagingResults(data, page, limit), strings.SuccessfullyRetrDataList, 1);

        }).catch(err => {
            handleError(err, req, res, 0);
        });
};

exports.findOne = (req, res) => {

    FoodItem.findOne({ where: { id: req.params.id } })
        .then((data) => {

            handleResponse(res, data.dataValues, strings.SuccessfullyRetrData, 1);
        }).catch(err => {
            handleError(err, req, res, 0);
        });
};