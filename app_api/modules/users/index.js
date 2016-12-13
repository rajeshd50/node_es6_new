'use strict';

module.exports = (app) => {
    app.db.models.KeyStore = require('./models/key-store.model')(app).keyStore;
    app.db.models.User = require('./models/user.model')(app).user;

    let routes = require('./routes/user.routes')(app);
    return routes;
};