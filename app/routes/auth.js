const { auths } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
	router.post('/login', auths.login);
	router.get('/me', auths.me);
	router.post('/reset-password', auths.resetPasswordEmail);
	router.patch('/update-password', auths.updatePassword);

	app.use('/api', router);
};