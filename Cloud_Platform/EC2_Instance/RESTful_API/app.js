var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

Light_level =require('./models/light_level');
Humidity =require('./models/humidity');
Temperature =require('./models/temperature');


// Connect to Mongoose
mongoose.connect('mongodb://localhost/smartsense');
var db = mongoose.connection;

app.get('/', function(req, res){
	res.send('Please use /api/lightLevel or /api/humidity or /api/temperature');
});

app.get('/api/light_level', function(req, res) {
	Light_level.getLight_level(function(err, light_level){
		if(err){
			throw err;
		}
		res.json(light_level);
	});
});

app.get('/api/humidity', function(req, res) {
	Humidity.getHumidity(function(err, humidity){
		if(err){
			throw err;
		}
		res.json(humidity);
	});
});


app.get('/api/temperature', function(req, res) {
	Temperature.getTemperature(function(err, temperature){
		if(err){
			throw err;
		}
		res.json(temperature);
	});
});

app.listen(3000);
console.log('Running on port 3000...');
