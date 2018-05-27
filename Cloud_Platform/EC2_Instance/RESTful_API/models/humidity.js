const mongoose = require('mongoose');

// Genre Schema
const humiditySchema = mongoose.Schema({
	/*temperature:{
		type: String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	}*/
});

const Humidity = module.exports = mongoose.model('Humidity', humiditySchema, 'humidity');

// Get Genres
module.exports.getHumidity = function (callback, limit){
	Humidity.find(callback).limit(limit);//also passes out optional limit
}

