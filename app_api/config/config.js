'use strict';

module.exports = function() {
    let config = {
        jwtSecret: 'nshkvisbvncosjlakoeeiyokaskvxc'
    };

    if(process.env.NODE_ENV === 'production') {
        config.mongoUrl = 'mongodb://localhost/testtodo';
    } else {
        config.mongoUrl = 'mongodb://localhost/testtodo';
    }

    return config;
}