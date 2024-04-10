const { Category } = require('../../models/index')

const { handleError, getPagination, handleSearchQuery, getPagingResults, handleResponse, sortingData, getSlug } = require('../../utils/helpers')
const { strings } = require('../../utils/string')
const { createCategory, updateCategory } = require('../validator/category')

exports.create = async (req, res) => {
  const { error } = createCategory.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const data = {
    name: req.body.name,
    parent_id: req.body.parent_id ? req.body.parent_id : null,
    description: req.body.description
  }

  Category.findOne({ where: { id: data.parent_id } })
    .then(result => {

      if (data.parent_id && result === null) { res.status(400).send({ error: true, message: strings.ParentIdDoesnotExist }) }

      if (!result && data.parent_id == '') { res.status(400).send({ error: true, message: strings.InvalidParenntId }) }

      (data.parent_id == result?.dataValues.id) && (Category.create(data)
        .then(data => {
          handleResponse(res, data, strings.CategorySuccessfullyCreate)
        }).catch(err => {
          handleError(err, req, res)
        })
      )
    })
    .catch(err => {
      handleError(err, req, res)
    })
}

exports.findAll = (req, res) => {
  const { page, size, sort } = req.query
  const { limit, offset } = getPagination(page, size)

  const sortResponse = sortingData(req)

  Category.findAndCountAll(
    {
      where: handleSearchQuery(req, ['parent_id', 'name']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset
    }
  )
    .then(data => {
      handleResponse(res, getPagingResults(data, page, limit))
    }).catch(err => {
      handleError(err, req, res)
    })
}

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ where: { id: id } })

    if (!category) {
      handleError(strings.InvalidCategory, req, res, 0);
      return
    };

    handleResponse(res, category.dataValues, strings.SuccessfullyRetrData, 1)

  } catch (error) {
    handleError(error, req, res, 0)
  }
};



exports.update = async (req, res) => {
  try {
    const { error } = updateCategory.validate(req.body,)

    if (error) {
      handleError(error, req, res)
      return
    }

    const { id } = req.params
    const category = await Category.findOne({ where: { id: id } })

    if (!category) {
      handleError(strings.InvalidCategory, req, res)
      return
    }

    const data = {
      name: req.body.name,
      parent_id: req.body.parent_id,
      description: req.body.description
    };

    await Category.update(data, { where: { id: id } })

    handleResponse(res, [], strings.CategorySuccessfullyUpdate, 1)

  } catch (error) {
    handleError(err, req, res, 0)
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.findOne({ where: { id: id } })

    if (!category) {
      handleError(strings.InvalidCategory, req, res)
      return;
    }

    await Category.destroy({ where: { id: id } })
    
    handleResponse(res, [], strings.CategorySuccessfullyDelete, 1)

  } catch (error) {
    handleError(error, req, res, 0)
  }
};