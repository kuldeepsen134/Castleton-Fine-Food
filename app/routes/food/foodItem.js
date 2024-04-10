const { foodItems } = require('../../controllers');
const { authAdmin, authJWT } = require('../../middleware/auth');
const { fileHandler } = require('../../middleware/fileHandler');

var router = require('express').Router();

module.exports = app => {
	router.post('/food-items',authJWT, authAdmin, fileHandler, foodItems.create);
	router.get('/food-items', foodItems.findAll);
	router.get('/food-items/:id', foodItems.findOne);
	// router.patch('/categories/:id', categories.update);
	// router.delete('/categories/:id', categories.delete);




	app.use('/api', router);
};