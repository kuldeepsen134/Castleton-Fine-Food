const { policies } = require('../controllers');
const { authAdmin, authJWT } = require('../middleware/auth');
const express = require('express');
const { nullFile } = require('../middleware/fileHandler');

var router = require('express').Router();

module.exports = app => {
    router.post('/privacies', authJWT, authAdmin, nullFile,  policies.create);
    router.get('/privacies', policies.findAll);

    app.use('/api', router);
};