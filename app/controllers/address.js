const { Address } = require('../models/index');
const { handleError, handleResponse, getPagination, handleSearchQuery, getPagingResults, sortingData } = require('../utils/helpers');

exports.create = async (req, res) => {
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

  Address.create(data)
    .then(data => {
      handleResponse(res, data, 'Address is created successfully.');
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findAll = (req, res) => {
  const { page, size, sort } = req.query;
  const { limit, offset } = getPagination(page, size);
  const sortResponse = sortingData(req);

  Address.findAndCountAll(
    {
      where: handleSearchQuery(req, ['user_id', 'country', 'city']),
      order: [[sortResponse.sortKey, sortResponse.sortValue]],
      limit, offset,
    }
  )
    .then(data => {
      handleResponse(res, getPagingResults(data, page, limit));
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Address.findByPk(id)
    .then(data => {
      handleResponse(res, data.dataValues,'Address get successfully');
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Address.update(req.body, { where: { id: id } })
    .then(data => {
      handleResponse(res, data, 'Updated successfully.');
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Address.destroy({
    where: { id: id }
  }).then(data => {
    handleResponse(res, data);
  }).catch(err => {
    handleError(err, req, res);
  });
};