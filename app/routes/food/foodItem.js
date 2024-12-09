const { foodItems } = require('../../controllers');
const { authAdmin, authJWT } = require('../../middleware/auth');
const { fileHandler } = require('../../middleware/fileHandler');

var router = require('express').Router();

module.exports = app => {
	router.post('/food-items', authJWT, authAdmin, fileHandler, foodItems.create);
	router.get('/food-items', foodItems.findAll);
	router.get('/food-items/:id', foodItems.findOne);

	router.patch('/food-items/:id', authJWT, authAdmin, fileHandler, foodItems.update);
	
	router.delete('/food-items/:id', authJWT, authAdmin, foodItems.delete);

	app.use('/api', router);
};