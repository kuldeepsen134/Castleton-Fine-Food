const { addToCarts } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
    router.post('/cart/add', addToCarts.create);

    router.get('/cart/items', addToCarts.findAll);

    app.use('/api', router);
};