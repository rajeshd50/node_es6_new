'use strict';

module.exports = (app) => {
    let mongoose = app.db.mongoose,
        Schema = mongoose.Schema,
        bcrypt = require('bcryptjs'),
        KeyStore = app.db.models.KeyStore;

    let UserSchema = new Schema({
        userName: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        createdOn: {
            type: Date,
            default: Date.now
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    });

    UserSchema.pre('save', function(next) {
        let user = this;
        if (this.isModified('password') || this.isNew) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    return next(err);
                }
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            });
        } else {
            return next();
        }
    });

    UserSchema.post('remove', function(doc) {
        KeyStore.find({
            userId: doc._id
        }, (err, data) => {
            if (!err && data) {
                data.forEach((element, index) => {
                    element.remove((err) => {});
                });
            }
        });
    });

    UserSchema.methods.comparePassword = function(passw, cb) {
        bcrypt.compare(passw, this.password, function(err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };

    return {
        users: mongoose.model('User', UserSchema)
    };
}
