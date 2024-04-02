const { users } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/users/register', users.create);
	router.get('/users', users.findAll);
	router.get('/users/:id', users.findOne);
	router.patch('/users/:id', users.update);
	router.delete('/users/:id', users.delete);

	app.use('/api', router);
};