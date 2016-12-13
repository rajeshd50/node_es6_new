'use strict';

module.exports = (app) => {
    let Schema = app.db.mongoose.Schema;

    let KeyStoreSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdOn: {
            type: Date,
            default: Date.now
        },
        token: {
            type: String,
            required: true
        },
        expiary: {
            type: Date,
            required: true
        }
    });


    return {
    	keyStore: app.db.mongoose.model('KeyStore', KeyStoreSchema)
    };
}
