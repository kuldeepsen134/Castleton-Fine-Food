const { users } = require('../controllers');
const { authAdmin } = require('../middleware/auth');

var router = require('express').Router();

module.exports = app => {
	router.post('/users/register', users.create);
	router.get('/users', authAdmin, users.findAll);
	router.get('/users/:id', authAdmin, users.findOne);
	router.patch('/users/:id', authAdmin, users.update);
	router.delete('/users/:id', authAdmin, users.delete);

	app.use('/api', router);
};