const { policies } = require('../controllers');
const { authAdmin, authJWT } = require('../middleware/auth');
const express = require('express');
const { nullFile } = require('../middleware/fileHandler');

var router = require('express').Router();

module.exports = app => {
    router.post('/privacies', authJWT, authAdmin, nullFile, policies.create);
    router.get('/privacies', policies.findAll);

    router.patch('/privacies/:id', authJWT, authAdmin, nullFile, policies.update);
    router.delete('/privacies/:id', authJWT, authAdmin, policies.delete);

    app.use('/api', router);
};