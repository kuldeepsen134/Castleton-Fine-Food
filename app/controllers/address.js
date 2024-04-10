const { Address } = require('../models/index');
const { handleError, handleResponse, getPagination, handleSearchQuery, getPagingResults, sortingData } = require('../utils/helpers');
const { strings } = require('../utils/string');

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

exports.findOne = async (req, res) => {
  const { id } = req.params
  const address = await Address.findByPk(id)

  if (!address) {
    handleError(strings.InvalidAddressId, req, res, 0);
    return
  }

  Address.findOne({ where: { id: id } })
    .then(data => {
      handleResponse(res, data.dataValues, strings.SuccessfullyRetrData);
    }).catch(err => {
      handleError(err, req, res);
    });
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params

    const address = await Address.findOne({ where: { id: id } })

    if (!address) {
      handleError(strings.InvalidAddressId, req, res, 0);
      return
    }

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

    const addressUpdate = await Address.update(data, { where: { id: id } })

    handleResponse(res, addressUpdate, strings.AddressSuccessfullyUpdate, 1);

  } catch (error) {
    handleError(error, req, res, 0);
  }



};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({ where: { id: id } })

    if (!address) {
      handleError(strings.InvalidAddressId, req, res, 0);
      return
    };

    await Address.destroy({ where: { id: id } });
    handleResponse(res, [], strings.AddressSuccessfullyRemove, 1);

  } catch (error) {
    handleError(error, req, res, 0);
  }
}