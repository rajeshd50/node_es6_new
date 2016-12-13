'use strict';

module.exports = (app) => {
	return {
		utils: require('./utils.js')(app)
	}
};