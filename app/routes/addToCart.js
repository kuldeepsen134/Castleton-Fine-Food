const { addToCarts } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
    router.post('/cart/add', addToCarts.create);

    router.get('/cart/items', addToCarts.findAll);
    router.get('/cart/items/:id', addToCarts.findOne);
    router.patch('/cart/items/:id', addToCarts.update);

    router.delete('/cart/items/:id', addToCarts.delete);



    app.use('/api', router);
};