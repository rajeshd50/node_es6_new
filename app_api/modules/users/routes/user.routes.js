'use strict';

module.exports = (app) => {
    let userController = require('../controllers/user.controller')(app);
    let router = require('express').Router();

    router.post('/login',userController.authenticate);

    return router;
}