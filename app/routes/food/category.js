const { categories } = require('../../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/categories', categories.create);
	router.get('/categories', categories.findAll);
	router.get('/categories/:id', categories.findOne);
	router.patch('/categories/:id', categories.update);
	router.delete('/categories/:id', categories.delete);

	app.use('/api', router);
};