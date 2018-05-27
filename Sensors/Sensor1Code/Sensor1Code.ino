/*  Temperatur Sensor Connected to A0
 *  Uses CurieBLE library
 *  Written by: Oliver Walsh
 *  Updated: 28/04/2018
 */

#include <CurieBLE.h>// include libary for BLE
#include "DHT.h"  //include this libary for various DHT models
#define DHTPIN 2   //define the digital pin data is connected to
#define DHTTYPE DHT11   //define the specific DHT sensor being used

BLEPeripheral blePeripheral;
BLEService lightService("12345678-ABCD-12AB-34CD-A2B4C5D6E7F8"); // BLE Battery Service

//BLEService tempService("12345678-ABCD-12AB-4DCF-42DA65CFE891"); // BLE Battery Service

/* BLE Light Level Characteristic */
BLEUnsignedCharCharacteristic lightLevelChar("1A2B3C4D-1234-ABCD-5E6F-1F2E3D4C5B6F", BLERead | BLENotify);
/* BLE Led switching characteristic */     
BLEUnsignedCharCharacteristic LedSwitchChar("FEDCBA21-ABCD-1234-F6E5-F1E2D3C4B5A6", BLERead | BLEWrite);

/* BLE Temperature Characteristic */
BLEUnsignedCharCharacteristic tempChar("164AC478-1234-ABCD-FE54-184DF5C7A9FF", BLERead | BLENotify);
/* BLE Humidity Characteristic */
BLEUnsignedCharCharacteristic humidChar("164AC478-1234-ABCD-FE54-CA56FF3CA7DB", BLERead | BLENotify);

DHT dht(DHTPIN, DHTTYPE);// Initialize DHT sensor.
int oldLightLevel = 0;  // last light level reading from analog input
long previousMillis = 0;  // last time the battery level was checked, in ms


void setup() {
  Serial.begin(9600);    /* initialize serial communication */
  pinMode(13, OUTPUT);   /* initialize the LED on pin 13 as output */
  /* Set local name of device */
  blePeripheral.setLocalName("SmartSense0001");
  /* set UUID of device */
  blePeripheral.setAdvertisedServiceUuid("1234");
  /* Add light service */
  blePeripheral.addAttribute(lightService);
  /* Add temp service */
  //blePeripheral.addAttribute(tempService);
  /* Add light level characteristic to service */
  blePeripheral.addAttribute(lightLevelChar);
  /* Add LED switching characterisitic to service */
  blePeripheral.addAttribute(LedSwitchChar);
  /* Add temperature characteristic to service */
  blePeripheral.addAttribute(tempChar);
  /* Add humidity characteristic to service */
  blePeripheral.addAttribute(humidChar);
  /* Reset initial value of characteristics */
  lightLevelChar.setValue(0);
  LedSwitchChar.setValue(0);
  tempChar.setValue(0);
  humidChar.setValue(0);
  /* Start peripheral */
  blePeripheral.begin();
  dht.begin();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {

  //float h = dht.readHumidity();
  //float t = dht.readTemperature();

  
  
  /* listen for BLE to connect: */
  BLECentral central = blePeripheral.central();
  /* if a central is connected to peripheral: */
  if (central) {
    Serial.print("Connected to central: ");
    /* print the central's MAC address: */
    Serial.println(central.address());
    /* as long as the central is still connected: */
    while (central.connected()) 
    {
      /* Scale light sensor value to 0-100% */
      int lightSensorValue = map(analogRead(0), 0, 1023, 0, 100);
      /* Set characteristic value to sensor percentage */
      lightLevelChar.setValue(lightSensorValue);

      /* Scale light sensor value to 0-100% */
      float tempSensorValue = dht.readTemperature();
      /* Set characteristic value to sensor percentage */
      tempChar.setValue(tempSensorValue);


      // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
      float humidSensorValue = dht.readHumidity();
      /* Set characteristic value to sensor percentage */
      humidChar.setValue(humidSensorValue);
            
      /* If data writted to led switchin characteristic */
      if (LedSwitchChar.written())
      {
        /* If a '1' was written */
        if (LedSwitchChar.value() == 1)
        {
          Serial.print("On command received: ");
          Serial.println(LedSwitchChar.value());
          /* Turn LED on */
          digitalWrite(13, HIGH);
        }
        /* If a '0' was written */
        else if (LedSwitchChar.value() == 0)
        {
          Serial.print("Off command received: ");
          Serial.println(LedSwitchChar.value());
          /* Turn LED off */
          digitalWrite(13, LOW);
        }
        /* If any other data is written to characteristic */
        else
        {
          /* Notify of different data being written (Debugging) */
          Serial.print("Other Command Received: ");
          Serial.println(LedSwitchChar.value());
        }
      }
    }
    /* when the central disconnects */
    if (!(central.connected()))
    {
      Serial.print("Disconnected from central: ");
      Serial.println(central.address());
    }
  }
}

