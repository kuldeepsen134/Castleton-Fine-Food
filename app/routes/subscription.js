var router = require('express').Router();

const { subscriptions } = require('../controllers');
const { authAdmin, authJWT } = require('../middleware/auth');

module.exports = app => {
    router.post('/subscription', authJWT, authAdmin, subscriptions.create);
    router.get('/subscribes', subscribers.findAll);

    app.use('/api', router);
};