const { policies, subscribers } = require('../controllers');
const { authAdmin, authJWT } = require('../middleware/auth');

var router = require('express').Router();

module.exports = app => {
    router.post('/subscribes', subscribers.create);
    router.get('/subscribes', authJWT, authAdmin, subscribers.findAll);

    app.use('/api', router);
};