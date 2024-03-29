const { Category } = require('../../models/index')

const { handleError, getPagination, handleSearchQuery, getPagingResults, handleResponse, sortingData, getSlug } = require('../../utils/helpers')
const { strings } = require('../../utils/string')
const { createCategory } = require('../validator/category')

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
  const id = req.params.id
  const category = await Category.findOne({ where: { id: id } })
  category ?
    Category.findByPk(id)
      .then(data => {
        handleResponse(res, data.dataValues)
      }).catch(err => {
        handleError(err, req, res)
      }) :
    handleError(strings.InvalidCategoryId, req, res)
}

exports.update = async (req, res) => {
  const { error } = updateCategory.validate(req.body,)

  if (error) {
    handleError(error, req, res)
    return
  }

  const id = req.params.id
  const category = await Category.findOne({ where: { id: id } })

  if (category) {
    // const slug = await getSlug(req.body.name)

    const data = {
      name: req.body.name,
      parent_id: req.body.parent_id,
      // slug: req.body.slug ? req.body.slug : slug ,
      description: req.body.description
    }
    Category.update(data, { where: { id: id } })
      .then(data => {
        handleResponse(res, data, strings.CategorySuccessfullyUpdate)
      }).catch(err => {
        handleError(err, req, res)
      })
  } else {
    handleError(strings.InvalidCategoryId, req, res)
  }

}

exports.delete = async (req, res) => {

  const id = req.params.id

  const category = await Category.findOne({ where: { id: id } })

  category ?

    Category.destroy({ where: { id: id } })
      .then(data => {
        handleResponse(res, data, strings.CategorySuccessfullyDelete)
      }).catch(err => {
        handleError(err, req, res)
      }) :
    handleError(strings.InvalidCategoryId, req, res)
}