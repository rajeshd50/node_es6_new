'use strict';

module.exports = (app) => {
    let mongoose = require('mongoose');
    let config = app.config;

    let gracefulShutdown;
    var dbURI = config.mongoUrl;

    let db = mongoose.connect(dbURI);

    // CONNECTION EVENTS
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to ' + dbURI);
    });
    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error: ' + err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

    // CAPTURE APP TERMINATION / RESTART EVENTS
    // To be called when process is restarted or terminated
    gracefulShutdown = (msg, callback) => {
        mongoose.connection.close(() => {
            console.log('Mongoose disconnected through ' + msg);
            callback();
        });
    };
    // For nodemon restarts
    process.once('SIGUSR2', () => {
        gracefulShutdown('nodemon restart', () => {
            process.kill(process.pid, 'SIGUSR2');
        });
    });
    // For app termination
    process.on('SIGINT', () => {
        gracefulShutdown('app termination', () => {
            process.exit(0);
        });
    });
    // For Heroku app termination
    process.on('SIGTERM', () => {
        gracefulShutdown('Heroku app termination', () => {
            process.exit(0);
        });
    });

    return {
        connection: db,
        mongoose: mongoose,
        models: {}
    }
}
