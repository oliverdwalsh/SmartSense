var mqtt = require('mqtt');

var mongodb = require("mongodb");
var urlDB = "mongodb://localhost:27017";

var client  = mqtt.connect({
    host: 'mqtt.smartsense.ie',
    port: 1883,
    username: 'oliver',
    password: 'ww9mewbf'
});//client is then set up to connect to this URL

var dbo, dbGlobal;
var sensorLevelData;
var MongoClient;



client.subscribe('temperature', subscribeCallback);
client.subscribe('humidity', subscribeCallback);
client.subscribe('lightLevel', subscribeCallback);
client.subscribe('lightControl', subscribeCallback);


var MongoClient = mongodb.connect(urlDB, connectCallback);

client.on('message', messageCallback);//reads the current state of the light

function subscribeCallback(error) {     
   	if (error) {
		console.log("error subscribing to topic");
	} else {	 
        console.log("Subscribed to topic");
        //client.end(); // Close the connection when published
    }
}


function connectCallback(err, db) {
  if (err) throw err;
  console.log("mongo connected");
  //create a collection (equivalent to a table in SQL) if it does not already exist 
  //insert a document (equivalent to a record in SQL) into it
  dbGlobal = db;
  dbo = db.db("Test_Mongo_DB");
}


function messageCallback(topic, message) {
  // read a message from a subscribed topic
  //console.log(message.toString());//converts message on the MQTT client to a string
  
  console.log('Received message: ' + message.toString()); // print out received mqtt message
  console.log('TOPIC: ' + topic.toString()); // print out message topic
  
  var message = message.toString();
  var topic = topic.toString();
  var myobj;

  if (topic == 'temperature'){
    myobj = JSON.parse(message);//object must be in JASON format, not string
    dbo.collection("temperature").insertOne(myobj, insertCallback);
  }

  if (topic == 'humidity'){
    myobj = JSON.parse(message);//object must be in JASON format, not string
    dbo.collection("humidity").insertOne(myobj, insertCallback);
  }

  if (topic == 'lightLevel'){
    myobj = JSON.parse(message);//object must be in JASON format, not string
    dbo.collection("lightLevel").insertOne(myobj, insertCallback);
  }

  if (topic == 'lightControl'){
    
  }

}

function insertCallback(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    //dbo.collection("Sensor_data").find({}).toArray(findCallback);
    //db.close();
  }

function findCallback(err, result) {
  if (err) throw err;
    console.log(result);
    //dbGlobal.close();
}


