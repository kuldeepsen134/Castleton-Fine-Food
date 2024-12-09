const { wishLists } = require('../controllers');

var router = require('express').Router();

module.exports = app => {
    router.post('/wish-lists', wishLists.create);

    router.get('/wish-lists', wishLists.findAll);
    router.get('/wish-lists/:id', wishLists.findOne);

    router.delete('/wish-lists/:id', wishLists.delete);


    app.use('/api', router);
};