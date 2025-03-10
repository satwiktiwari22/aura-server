#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define LED_PIN 12  // GPIO pin for LED
#define LOCK_PIN 13  // GPIO pin for LOCK
#define DHT_PIN 14  // GPIO pin for DHT sensor (temperature & humidity)
#define SMOKE_SENSOR_PIN 35  // ADC pin for smoke sensor

// WiFi credentials
const char* ssid = "wifi-ssid";
const char* password = "your-password";

// MQTT broker details
const char* mqttServer = "192.168.137.238"; // change this to the mqtt-server's ip address
const int mqttPort = 1883;

// MQTT topics
const char* ledControlTopic = "home/lights";
const char* temperatureTopic = "home/sensors/temperature";
const char* humidityTopic = "home/sensors/humidity";
const char* smokeTopic = "home/sensors/smoke";
const char* lockTopic = "home/lock";

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHT_PIN, DHT11);

void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  pinMode(LOCK_PIN, OUTPUT);
  
  dht.begin();
  pinMode(SMOKE_SENSOR_PIN, INPUT);

  connectWiFi();
  client.setServer(mqttServer, mqttPort);
  client.setCallback(mqttCallback);

  connectMQTT();
}

void loop() {
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();

  // Publish sensor data
  publishSensorData();

  delay(2000);  // Adjust the interval as required
}

void connectWiFi() {
  delay(10);
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
}

void connectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");

      // Subscribe to LED control topic
      client.subscribe(ledControlTopic);
      client.subscribe(lockTopic);
      
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == ledControlTopic) {
    if (message == "ON") {
      digitalWrite(LED_PIN, HIGH);
    } else if (message == "OFF") {
      digitalWrite(LED_PIN, LOW);
    }
    Serial.println("LED state changed to: " + message);
  }
  else if (String(topic) == lockTopic) {
    if (message == "ON") {
      digitalWrite(LOCK_PIN, HIGH);
    } else if (message == "OFF") {
      digitalWrite(LOCK_PIN, LOW);
    }
    Serial.println("Lock state changed to: " + message);
  }
}

void publishSensorData() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int smokeValue = analogRead(SMOKE_SENSOR_PIN);

  if (!isnan(temperature)) {
    client.publish(temperatureTopic, String(temperature).c_str());
  }
  if (!isnan(humidity)) {
    client.publish(humidityTopic, String(humidity).c_str());
  }
  client.publish(smokeTopic, String(smokeValue).c_str());

  Serial.println("Sensor data published");
}
