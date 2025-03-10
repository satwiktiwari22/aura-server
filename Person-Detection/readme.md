# YOLOv8 Live Person Detection System

This project implements real-time person detection using YOLOv8 and automatically controls smart lights via MQTT based on presence detection.

## Features

- Real-time person detection using YOLOv8
- Automatic light control based on presence
- MQTT communication for smart home integration
- Smart mode toggle support
- Visual bounding box display for detected persons

## Requirements

- Python 3.8+
- Webcam or IP camera
- MQTT broker (e.g., Mosquitto)
- Smart lights compatible with MQTT

## Installation

1. Create a virtual environment:

```sh
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

2. Install the required packages:

```sh
pip install -r requirements.txt
```

## Configuration

Before running the application, configure these settings in main.py:

1. Camera Source:

   - Use `cap = cv2.VideoCapture(0)` for your default webcam
   - For an IP camera, use `cap = cv2.VideoCapture("your_camera_url")`

2. MQTT Settings:
   - Update broker address: `mqtt_client.connect("your_broker_ip", 1883)`
   - Topics used:
     - `home/lights`: Controls the lights (ON/OFF)
     - `home/smartmode`: Toggles smart mode functionality

## Usage

Run the application:

```sh
python main.py
```

### Controls:

- Press 'q' to exit the application

### Behavior:

- When a person is detected, the system sends "OFF" to the `home/lights` topic (turns lights ON)
- If no person is detected for 10 seconds, it sends "ON" to `home/lights` (turns lights OFF)
- Smart mode can be toggled by publishing "on" or "off" to `home/smartmode`

## Troubleshooting

1. Camera Issues:

   - Ensure your webcam/camera is properly connected
   - Try different camera index values (0, 1, 2) if using webcam
   - Check your IP camera URL is correct and accessible

2. MQTT Connection Issues:

   - Verify your MQTT broker is running
   - Check the IP address and port are correct
   - Ensure there are no firewall issues

3. Detection Problems:
   - Adjust the confidence threshold (`conf=0.7`) for more/fewer detections
   - Ensure proper lighting for better detection accuracy

## Dependencies

- OpenCV: Computer vision and image processing
- Ultralytics YOLO: Object detection model
- Paho-MQTT: MQTT client for Python
