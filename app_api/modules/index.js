'use strict';

module.exports = (app) => {

    let router = require('express').Router();

    router.use('/users',require('./users')(app));

    return router;

};