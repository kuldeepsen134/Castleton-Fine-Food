const { auths } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/login', auths.login);
	router.get('/me', auths.me);
	// router.get('/users/:id', users.findOne);




	app.use('/api', router);
};