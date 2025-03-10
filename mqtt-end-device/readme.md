# Smart Home IoT System

This Arduino project is designed to control and monitor various devices in a smart home setup. It integrates an ESP32 microcontroller with sensors and actuators, sending data to an MQTT broker for remote monitoring and control. The system supports controlling an LED, lock, and publishing temperature, humidity, and smoke sensor readings.

## Features

- **WiFi Connectivity**: Connects to your WiFi network for internet access.
- **MQTT Integration**: Sends and receives data from an MQTT broker for remote control and monitoring.
- **Temperature & Humidity Sensor**: Uses a DHT11 sensor to measure temperature and humidity.
- **Smoke Sensor**: Monitors air quality using an analog smoke sensor.
- **Device Control**: Allows control of an LED and lock using MQTT messages.

## Components Required

- **ESP32** microcontroller
- **DHT11** sensor (for temperature and humidity)
- **Smoke sensor** (analog)
- **LED** (for visual indication)
- **Relay or solenoid** for locking mechanism
- **Jumper wires** and a breadboard for wiring

## Wiring

- **LED**: Connect to GPIO 12.
- **Lock**: Connect to GPIO 13.
- **DHT11 sensor**: Connect to GPIO 14.
- **Smoke sensor**: Connect to ADC pin GPIO 35.

## Software Libraries

This code requires the following libraries:

- `WiFi.h`: For WiFi connection.
- `PubSubClient.h`: For MQTT communication.
- `DHT.h`: For DHT11 sensor interaction.

To install these libraries, use the Arduino Library Manager:
1. Open the Arduino IDE.
2. Go to **Sketch** > **Include Library** > **Manage Libraries**.
3. Search for and install:
   - `WiFi`
   - `PubSubClient`
   - `DHT sensor library`

## Setup and Configuration

1. **WiFi Configuration**: Modify the following lines in the code with your WiFi credentials:
   ```cpp
   const char* ssid = "your-wifi-ssid";
   const char* password = "your-wifi-password";
   ```

2. **MQTT Configuration**: Change the MQTT broker IP address in the following line:
   ```cpp
   const char* mqttServer = "your-mqtt-server-ip";
   ```

   Ensure that the MQTT broker is running and accessible from your ESP32 device.

3. **Pin Configuration**: The code uses GPIO pins for various sensors and devices. Modify these pin assignments if needed:
   - `LED_PIN`: GPIO 12
   - `LOCK_PIN`: GPIO 13
   - `DHT_PIN`: GPIO 14
   - `SMOKE_SENSOR_PIN`: GPIO 35

## MQTT Topics

This system communicates with the following MQTT topics:

- **LED Control**: `home/lights` (Send "ON" or "OFF" to control the LED).
- **Lock Control**: `home/lock` (Send "ON" or "OFF" to control the lock).
- **Temperature Sensor**: `home/sensors/temperature` (Published data: temperature in Celsius).
- **Humidity Sensor**: `home/sensors/humidity` (Published data: humidity percentage).
- **Smoke Sensor**: `home/sensors/smoke` (Published data: analog smoke sensor reading).

## Code Flow

1. **WiFi Connection**: The ESP32 connects to the WiFi network defined in the `connectWiFi()` function.
2. **MQTT Connection**: The device connects to the MQTT broker and subscribes to topics for controlling the LED and lock.
3. **Sensor Data Publishing**: The temperature, humidity, and smoke sensor data is published to the corresponding MQTT topics every 2 seconds.
4. **Control via MQTT**: The system listens to MQTT messages for controlling the LED and lock. When a message is received on the `home/lights` or `home/lock` topics, the corresponding hardware is toggled (LED or lock).

## Control and Monitoring

1. **Control the LED**: Send "ON" or "OFF" messages to the `home/lights` topic to toggle the LED.
2. **Control the Lock**: Send "ON" or "OFF" messages to the `home/lock` topic to toggle the lock.
3. **Monitor Sensors**: The temperature, humidity, and smoke readings are published to the `home/sensors/temperature`, `home/sensors/humidity`, and `home/sensors/smoke` topics, respectively.

## Troubleshooting

- Ensure that the ESP32 is connected to the correct WiFi network and can reach the MQTT broker.
- Check the MQTT broker settings and ensure that the ESP32 has permission to subscribe and publish to the topics.
- Make sure the DHT11 sensor is connected correctly, and check the readings via the serial monitor.
