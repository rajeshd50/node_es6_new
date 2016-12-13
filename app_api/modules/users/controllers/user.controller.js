'use strict';

module.exports = (app) => {
    let _ = app._,
        fs = require('fs'),
        path = require('path'),
        mongoose = app.db.mongoose,
        config = app.config,
        jwt = require('jsonwebtoken'),
        User = app.db.models.User,
        KeyStore = app.db.models.KeyStore;

    let TOKEN_EXPIRATION = 3600000 * 24;
    let authenticate = (req, res) => {
        if (!req.body.userName) {
            return res.status(400).send({
                message: 'Username is required!'
            });
        }
        if (!req.body.password) {
            return res.status(400).send({
                message: 'Password is required!'
            });
        }

        User.findOne({
            userName: req.body.userName
        }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    message: 'Something wrong!'
                });
            }
            if (!user) {
                return res.status(404).send({
                    message: 'User not found!'
                });
            }
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (err) {
                    return res.status(403).send({
                        message: 'Password is wrong!'
                    });
                }
                let token = jwt.sign({
                    userName: req.body.userName,
                    userId: user._id
                }, config.jwtSecret);
                let keyData = {
                    userId: user._id,
                    token: token,
                    expiary: new Date((new Date()).getTime() + TOKEN_EXPIRATION)
                };
                KeyStore.findOneAndUpdate({
                    userId: user._id
                }, keyData, {
                    upsert: true
                }, (err, key) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error occured'
                        });
                    }
                    return res.status(200).json({
                        message: 'Success!',
                        token: token,
                        userId: user._id,
                        userName: user.userName
                    });
                });
            });
        })
    };

    let createUser = (req, res) => {
        if (!req.body.userName) {
            return res.status(400).send({
                message: 'Username is required!'
            });
        }
        if (!req.body.password) {
            return res.status(400).send({
                message: 'Password is required!'
            });
        }
        let user = new User(req.body);

        user.save((err, data) => {
            if (err || !data) {
                console.log('error,500');
                return res.status(500).send({
                    message: 'Username already exists!'
                });
            }
            delete data.password;
            return res.status(201).json(data);
        });
    };

    let checkToken = (req, res) => {
        res.status(200).json({
            message: 'Token alive!!',
            token: req.jwtToken,
            userId: req.user.userId,
            userName: req.user.userName
        });
    }


    let logout = (req, res) => {
        KeyStore.remove({
            userId: req.user.userId,
            token: req.jwtToken
        }, (err, data) => {
            if (err) {
                return res.status(500).send({
                    message: 'Could not logout!'
                });
            }
            return res.status(200).send({
                message: 'Success!!'
            });
        });
    }

    return {
        authenticate: authenticate,
        logout: logout,
        createUser: createUser,
        checkToken: checkToken
    }
}
