const { FoodItem, Media, Category } = require("../../models");
const { handleError, handleResponse, getPagination, sortingData, getPagingResults, handleSearchQuery, getMediaFile } = require("../../utils/helpers");
const { strings } = require("../../utils/string");
const { createFoodItem, updateFoodItem } = require("../validator/fooodItem");

const path = require("path");
const fs = require('fs').promises;

exports.create = async (req, res) => {
    const { error } = createFoodItem.validate(req.body,)

    if (error) {
        handleError(error, req, res)
        return
    }

    const category = await Category.findOne({ where: { id: req.body.category_id } })

    if (!category) {
        handleError(strings.InvalidCategory, req, res, 0);
        return
    };

    const data = {
        name: req.body.name,
        description: req.body.description,
        short_description: req.body.short_description,
        quantity: req.body.quantity,
        total_quantity: req.body.quantity,
        regular_price: req.body.regular_price,
        discounted_price: req.body.discounted_price,
        cost_per_item: req.body.cost_per_item,
        food_item_type: req.body.food_item_type,
        backorders: req.body.backorders,
        stock_status: req.body.stock_status,
        is_jain: req.body.is_jain,
        category_id: req.body.category_id,
    }

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


exports.update = async (req, res) => {
    try {
        const food = await FoodItem.findOne({ where: { id: req.params.id } });
        if (!food) {
            return handleError(strings.InvalidFoodId, req, res, 404);
        }

        const { error } = updateFoodItem.validate(req.body);
        if (error) {
            return handleError(error.details[0].message, req, res, 400);
        }

        const category = await Category.findOne({ where: { id: req.body.category_id } });
        if (!category) {
            return handleError(strings.InvalidCategory, req, res, 400);
        }

        const data = {
            name: req.body.name,
            description: req.body.description,
            short_description: req.body.short_description,
            quantity: req.body.quantity,
            regular_price: req.body.regular_price,
            discounted_price: req.body.discounted_price,
            cost_per_item: req.body.cost_per_item,
            food_item_type: req.body.food_item_type,
            backorders: req.body.backorders,
            stock_status: req.body.stock_status,
            is_jain: req.body.is_jain,
            category_id: req.body.category_id,
        };

        // Update the food item
        await FoodItem.update(data, { where: { id: food.id } });

        if (req.file) {
            const media = await Media.findOne({ where: { food_item_id: food.id } });

            if (media) {
                // Delete previous media file
                const BASE_PATH = path.join(__dirname, "../../upload");
                await fs.unlink(path.join(BASE_PATH, media.name));

                const fileData = {
                    name: req.file.filename,
                    mime_data: req.file.mimetype,
                    path: `/media/${req.file.filename}`,
                    food_item_id: food.id
                };

                // Insert or update media information
                await Media.update(fileData, { where: { id: media.id } });
            }
            else {
                const fileData = {
                    name: req.file.filename,
                    mime_data: req.file.mimetype,
                    path: `/media/${req.file?.filename}`,
                    food_item_id: result.id
                }

                Media.create(fileData)
            }

            handleResponse(res, [], strings.FoodItemsSuccessfullyUpdated, 200);
            return;
        }

        handleResponse(res, [], strings.FoodItemsSuccessfullyUpdated, 200);

    } catch (err) {
        handleError(err.message || err, req, res, 500);
    }
};



exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const foodItem = await FoodItem.findOne({ where: { id: id } })

        if (!foodItem) {
            handleError(strings.InvalidFoodId, req, res, 0)
            return;
        };

        await FoodItem.destroy({ where: { id: id } })
        await Media.destroy({ where: { food_item_id: foodItem.id } })

        handleResponse(res, [], strings.FoodItemsSuccessfullyDeleted, 1);

    } catch (err) {
        handleError(err, req, res);
    }
};