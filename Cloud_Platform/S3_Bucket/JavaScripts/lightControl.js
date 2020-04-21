//Uses the Paho MQTT JS client library - http://www.eclipse.org/paho/files/jsdoc/index.html to send and receive messages using a web browser

// Create a client instance
client = new Paho.MQTT.Client("mqtt.smartsense.ie", 3033, "web_" + parseInt(Math.random() * 100, 10));
//client = new Paho.MQTT.Client("mqtt.smartsense.ie", 8883, "web_" + parseInt(Math.random() * 100, 10));
//client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "web_" + parseInt(Math.random() * 100, 10));

document.getElementById("1on").addEventListener("click", turnS1LightOn); 
document.getElementById("1off").addEventListener("click", turnS1LightOff); 
document.getElementById("2on").addEventListener("click", turnS2LightOn); 
document.getElementById("2off").addEventListener("click", turnS2LightOff);


client.onMesssageArrived = messageArrived;
client.onConnectionLost = onConnectionLost;

client.connect({
    onSuccess: onConnect, 
    userName : "oliver",
    password : "${passwordKey}",
});

 
var connectOptions = {
    onSuccess: onConnectCallback //other options available to set
    //useSSL=true;
};

var subscribeOptions = {
    onSuccess: onSubscribeCallback //other options available to set
    //useSSL=true;
};

//--------------functions---------------
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected");
  client.subscribe("lightControl",subscribeOptions);
}

function subscribeToBroker() {
    // connect the client
    client.subscribe("lightControl",subscribeOptions);
}

function turnS1LightOn() {
    // publish to the client
    console.log("publishing on command");
    client.publish("lightControl1", "on", 0, false); //publish a message to the broker
}

function turnS1LightOff() {
    // publish to the client
    console.log("publishing off command");
    client.publish("lightControl1", "off", 0, false); //publish a message to the broker
}

function turnS2LightOn() {
    // publish to the client
    console.log("publishing on command");
    client.publish("lightControl2", "on", 0, false); //publish a message to the broker
}

function turnS2LightOff() {
    // publish to the client
    console.log("publishing off command");
    client.publish("lightControl2", "off", 0, false); //publish a message to the broker
}

//--------------callbacks---------------

// called when the client connect request is successful
function onConnectCallback() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("connected");
  client.publish("lightControl1", "connected", 0, false); //publish a message to the broker
  client.publish("lightControl2", "connected", 0, false); //publish a message to the broker
}

function onSubscribeCallback() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("subscribed");
  client.publish("lightControl", "subscribed to topic", 0, false); //publish a message to the broker
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

function messageArrived(message){
	console.log("message arrived");
	console.log("message Arrived"+message.payloadString);
}



