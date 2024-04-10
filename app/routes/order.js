const { orders } = require('../controllers');
const { authJWT } = require('../middleware/auth');

var router = require('express').Router();

module.exports = app => {
	router.post('/orders', authJWT, orders.create);
	router.get('/orders', authJWT, orders.findAll);
	router.get('/orders/:id', orders.findOne);


	router.post('/payments', orders.payment);



	app.use('/api', router);
};