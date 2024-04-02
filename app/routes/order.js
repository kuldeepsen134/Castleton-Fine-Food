const { orders } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/orders', orders.create);
	router.get('/orders', orders.findAll);

	app.use('/api', router);
};