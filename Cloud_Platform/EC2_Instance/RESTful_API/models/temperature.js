const mongoose = require('mongoose');

// Genre Schema
const temperatureSchema = mongoose.Schema({
	/*temperature:{
		type: String,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	}*/
});

const Temperature = module.exports = mongoose.model('Temperature', temperatureSchema, 'temperature');


// Get Genres
module.exports.getTemperature = function (callback, limit){
	Temperature.find(callback).limit(limit);//also passes out optional limit
}

/*
// Get Genres
module.exports.getTemperature = function (callback, limit){
	//Temperature.find(callback).limit(limit);//also passes out optional limit

	Temperature.aggregate(
	   [
	      {
	        $group : {
	           _id : { sensor_id: "$sensor_id", month: { $month: "$date_time_recorded" }},
	           averageTemperature: { $avg: "$temperature" },
	           count: { $sum: 1 }
	        }
	      }
	   ]
	).limit(limit);

}
*/
