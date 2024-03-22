const { users } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/users/register', users.create);
	router.get('/users', users.findAll);
	router.get('/users/:id', users.findOne);




	app.use('/api', router);
};