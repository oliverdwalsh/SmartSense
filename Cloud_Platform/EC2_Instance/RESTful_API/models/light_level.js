const mongoose = require('mongoose');

// Genre Schema
const light_levelSchema = mongoose.Schema({
	/*temperature:{
		type: String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	}*/
});

const Light_level = module.exports = mongoose.model('Light_level', light_levelSchema, 'light_level');

// Get Genres
module.exports.getLight_level = function (callback, limit){
	Light_level.find(callback).limit(limit);//also passes out optional limit
}

