const { address } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/address', address.create);
	router.get('/address', address.findAll);
	router.get('/address/:id', address.findOne);
	router.patch('/address/:id', address.update);
	router.delete('/address/:id', address.delete);

	app.use('/api', router);
};