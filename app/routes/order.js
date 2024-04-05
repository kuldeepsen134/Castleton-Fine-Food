const { orders } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/orders', orders.create);
	router.get('/orders', orders.findAll);
	router.get('/orders/:id', orders.findOne);


	router.post('/payment', orders.payment);



	app.use('/api', router);
};