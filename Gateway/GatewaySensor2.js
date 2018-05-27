//dashboard available at http://www.hivemq.com/demos/websocket-client/
//Author: Oliver Walsh
//Date Modified: 01/05/2018

var noble = require('noble');
var mqtt    = require('mqtt');
//var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');//client is then set up to connect to this URL
var client  = mqtt.connect({
		host: 'mqtt.smartsense.ie',
		port: 1883,
		username: 'oliver',
		password: 'ww9mewbf'		
});//client is then set up to connect to this URL


var readline = require('readline-sync');

var lightLevelData;
var tempLevelData;
var humidLevelData;
var LEDcontrol;
var current_time;

var lightCount=0;
var totalLightVal=0;
var averageLightData=0;

var tempCount=0;
var totalTempVal=0;
var averageTempData=0;

var humidCount=0;
var totalHumidVal=0;
var averageHumidData=0;

console.log("Starting Client...");
console.log("Client Started");


client.subscribe('temperature', subscribeCallback);
client.subscribe('humidity', subscribeCallback);
client.subscribe('lightLevel', subscribeCallback);
client.subscribe('lightControl2', subscribeCallback);

noble.on('stateChange', stateChangeEventHandler); //when a stateChange event occurs call the event handler callback function, discoverDeviceEventHandler

function stateChangeEventHandler(state) { //event handler callback function
  if (state === 'poweredOn') {
    console.log("starting scanning");  
    noble.startScanning();
  } else {
    console.log("stopping scanning");  
    noble.stopScanning();
  }
}

noble.on('discover', discoverDeviceEventHandler); //when a discover event occurs call the event handler callback function, discoverDeviceEventHandler
console.log("up and running");

function discoverDeviceEventHandler(peripheral) { //event handler callback function 
	console.log('Found device with local name: ' + peripheral.advertisement.localName);
	//console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
	console.log("peripheralGlobal" + peripheral.uuid);
	if (peripheral.advertisement.localName == "SmartSense0002"){
    //if (peripheral.uuid == "ded249837831"){ //NOTE: this "xyz" value needs to change to match uuid of the periphearl
        peripheralGlobal = peripheral;  //set the peripheralGlobal variable equal to the callback peripheral parameter value
		console.log(peripheral.uuid);
		peripheral.connect(connectCallback); //call the connect function and when it returns the callback function connectCallback will be executed
	}; //end if 
}

function connectCallback(error) { //this will be executed when the connect request returns
	if (error) {
		console.log("error connecting to peripheral");
	} else {		
		console.log('connected to peripheral: ' + peripheralGlobal.uuid  + "   " + peripheralGlobal.advertisement.localName);
		peripheralGlobal.discoverServices([], discoverServicesCallback); //call the discoverServices function and when it returns the callback function discoverServicesCallback will be executed
	}
}

function discoverServicesCallback(error, services) { //this will be executed when the discoverServices request returns
	if (error) {
		console.log("error discovering services");
	} else {
		console.log("The device contains the following services");			
		for (var i in services) {
			console.log('  ' + i + ' uuid: ' + services[i].uuid);
		}
        //pick one service to interrogate
		var deviceInformationService = services[2];
		deviceInformationService.discoverCharacteristics(null, discoverCharsCallback); //call the discoverCharacteristics function and when it returns the callback function discoverCharsCallback will be executed
	}
}

function discoverCharsCallback(error, characteristics) { //this will be executed when the discoverCharacteristics request returns
	if (error) {
		console.log("error discovering characteristics");
	} 
	
	else {
		console.log('discovered the following characteristics associated with the 2nd service:');
		for (var i in characteristics) {
			console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
        }
        //pick one characteristic to read the value of 
        lightLevelData = characteristics[0];
        LEDcontrol = characteristics[1];
        tempLevelData = characteristics[2];
        humidLevelData = characteristics[3];
        						
		client.on('message', messageCallback);//reads the current state of the light
		
		//prompt message to the user
		console.log("Welcome, from your MQTT client type 'on' to turn the light on, 'off' to turn the light off and 'read' to check the current state of the light.");
		
		//console.log("initial count value: " + lightCount);
			setInterval(() => {
				lightLevelData.read(readLightCallback);
				tempLevelData.read(readTempCallback);
				humidLevelData.read(readHumidCallback);
			}, 30000)
		
	} //end for loop
	
}

function readLightCallback(error, data) { //this will be executed when the read request returns
		if (error) {
			console.log("error reading data");
		} else {
			
			current_time = getCurrentTime();			
			lightCount = increment(lightCount);
			console.log("light count incremented to " + lightCount);
						
			var hexLightData = data.toString('hex');//converts data to hex
			var intLightData = parseInt(hexLightData, 16);//converts data to int
			
			console.log("light level:" + intLightData + "% added to running average");
			totalLightVal = totalLightVal + intLightData;
			console.log("total light level:" + totalLightVal + "%");
											
			if (lightCount == 5){
				
				console.log(totalLightVal);
				averageLightData = totalLightVal/5;
			
				var lightData = averageLightData.toString();
				console.log("averaged light level:" + lightData + "%");
								
				var lightJson = {
					sensor_id: peripheralGlobal.advertisement.localName,
					light_level : lightData,
					light_level_units: "%",
					date_time_recorded: current_time
				};
				
				var lightJsonString = JSON.stringify(lightJson);		
					
				client.publish('lightLevel',lightJsonString);//publishes sensor value to the MQTT topic
				
				lightCount = 0;
				totalLightVal=0;
				averageLightData=0;
				//peripheralGlobal.disconnect(disconnectCallback);
			}
			
		}
		
}

function readTempCallback(error, data) { //this will be executed when the read request returns
		if (error) {
			console.log("error reading data");
		} else {
			
			current_time = getCurrentTime();				
			tempCount = increment(tempCount);
			console.log("temp count incremented to " + tempCount);
						
			var hexTempData = data.toString('hex');//converts data to hex
			var intTempData = parseInt(hexTempData, 16);//converts data to int
			
			console.log("temp level:" + intTempData + "°C added to running average");
			totalTempVal = totalTempVal + intTempData;
			console.log("total temp level:" + totalTempVal + "°C");
											
			if (tempCount == 5){
				
				console.log(totalTempVal);
				averageTempData = totalTempVal/5;
			
				var tempData = averageTempData.toString();
				console.log("averaged temp level:" + tempData + "%");
								
				var tempJson = {
					sensor_id: peripheralGlobal.advertisement.localName,
					temperature : tempData,
					temperature_units: "°C",
					date_time_recorded: current_time
				};
				
				var tempJsonString = JSON.stringify(tempJson);		
					
				client.publish('temperature',tempJsonString);//publishes sensor value to the MQTT topic
				
				tempCount = 0;
				totalTempVal=0;
				averageTempData=0;
				//peripheralGlobal.disconnect(disconnectCallback);
			}
			
		}
		
}

function readHumidCallback(error, data) { //this will be executed when the read request returns
		if (error) {
			console.log("error reading data");
		} else {
			
			current_time = getCurrentTime();				
			humidCount = increment(humidCount);
			console.log("humid count incremented to " + humidCount);
						
			var hexHumidData = data.toString('hex');//converts data to hex
			var intHumidData = parseInt(hexHumidData, 16);//converts data to int
			
			console.log("humid level:" + intHumidData + "% added to running average");
			totalHumidVal = totalHumidVal + intHumidData;
			console.log("total humid level:" + totalHumidVal + "%\n");
											
			if (humidCount == 5){
				
				console.log(totalHumidVal);
				averageHumidData = totalHumidVal/5;
			
				var humidData = averageHumidData.toString();
				console.log("averaged humid level:" + humidData + "%");
								
				var humidJson = {
					sensor_id: peripheralGlobal.advertisement.localName,
					humidity : humidData,
					humidity_units: "%",
					date_time_recorded: current_time
				};
				
				var humidJsonString = JSON.stringify(humidJson);		
					
				client.publish('humidity',humidJsonString);//publishes sensor value to the MQTT topic
				
				humidCount = 0;
				totalHumidVal=0;
				averageHumidData=0;
				//peripheralGlobal.disconnect(disconnectCallback);
			}
			
		}
		
}


function writeOnCallback(error, data) { //this will be executed when the light is turned on
		if (error) {
			console.log("error reading data");
		} else {
				console.log("Light is on");
		}
}

function writeOffCallback(error, data) { //this will be executed when the light is turned off
		if (error) {
			console.log("error reading data");
		} else {
				console.log("Light is off");
		}
}

function disconnectCallback(error){ //this will be executed when the disconnect request returns
	if (error) {
		console.log("error disconnecting");
	} else {
		console.log("Disconnecting and stopping scanning");
	}
}

//-----------------MQTT Functions-----------

function subscribeCallback(error) {     
   	if (error) {
		console.log("error subscribing to topic");
	} else {	 
        console.log("Subscribed to topic");
        //client.end(); // Close the connection when published
    }
}

function messageCallback(topic, message) {
  // read a message from a subscribed topic
  console.log(message.toString());//converts message on the MQTT client to a string
    
	if (message=="on"){  //if 'on' is published to the topic, do the following
		 console.log("turning light on");
		 LEDcontrol.write(new Buffer([1]),false,writeOnCallback);	//turn light on
	}
	  
	if (message=="off"){  //if 'off' is published to the topic, do the following
		console.log("turning light off");
		LEDcontrol.write(new Buffer([0]),false,writeOffCallback);	//turn light off
	}
	if (message == "read") {  //if 'read' is published to the topic, do the following
			lightLevelData.read(readDataCallback); //call the read function and when it returns the callback function readDataCallback will be executed
	} 
	
  //client.end() //dont want to close connection as we want to stay subscribed
}

function publishCallback(error) {     
   	if (error) {
		console.log("error publishingr data");
	} else {	 
        console.log("Message is published");
        //client.end(); // Close the connection when published
    }
}

function getCurrentTime(){
	var time = new Date();
	var current_time = new Date();
	current_time.setHours(time.getHours()+1);
	return current_time;
}


function increment (n){
	n++;
	return n;
}
