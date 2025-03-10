# Face Recognition Intruder Detection System

This project is a face recognition-based intruder detection system built using Flask for the backend. The system allows you to add family members' faces to a known faces database and detect intruders by comparing faces in uploaded images against the known faces.

## Features

- Add family members' faces to the known faces database.
- Detect intruders by comparing faces in uploaded images against the known faces.
- Publish intruder detection events to an MQTT broker.
- List all added family members.

## Technologies Used

- **Server:** Flask, face_recognition, OpenCV, paho-mqtt

## Prerequisites

- Python 3.x
- Node.js and npm
- React Native CLI
- Flask and required Python packages
- MQTT broker (e.g., Mosquitto)

## Installation

1. **Create a virtual environment and activate it:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

2. **Install the required Python packages:**

   ```bash
   pip install flask flask-cors face-recognition opencv-python paho-mqtt numpy
   ```

3. **Run the Flask server:**

   ```bash
   python main.py
   ```

## Usage

### Adding a Family Member

1. Use the `/add_family_member` endpoint to add a family member.
2. Provide the name and image of the family member.
3. The system will detect the face in the image and add it to the known faces database.

### Detecting Faces

1. Use the `/detect_face` endpoint to upload an image for face detection.
2. The system will compare the faces in the uploaded image against the known faces.
3. If an intruder is detected, an event will be published to the MQTT broker.

### Listing Family Members

1. Use the `/list_family_members` endpoint to get a list of all added family members.

## API Endpoints

### Add Family Member

- **URL:** `/add_family_member`
- **Method:** `POST`
- **Parameters:**
  - `name` (string): The name of the family member.
  - `image` (file): The image file of the family member.
- **Response:**
  - Success: `{"message": "Family member <name> added successfully."}`
  - Error: `{"error": "No face detected in the image."}`

### Detect Face

- **URL:** `/detect_face`
- **Method:** `POST`
- **Parameters:**
  - `image` (file): The image file to be processed for face detection.
- **Response:**
  - `{"intruder_detected": true}` if an intruder is detected.
  - `{"intruder_detected": false}` if no intruder is detected.

### List Family Members

- **URL:** `/list_family_members`
- **Method:** `GET`
- **Response:**
  - `{"family_members": ["name1", "name2", ...]}`

## Project Structure

```
face-recognition-intruder-detection/
├── main.py                # Flask backend code
├── requirements.txt       # Python dependencies
├── known_faces/           # Directory to store known faces images
├── intruder_log.txt       # Log file for intruder detection events
└── react-native-app/      # React Native frontend code
```

## Configuration

- **MQTT Broker:**

  - Update the MQTT broker address in main.py:
    ```python
    mqtt_client.connect("your-mqtt-broker-address", 1883)
    ```

- **Known Faces Directory:**
  - Ensure the known_faces directory exists in the project root.

## Troubleshooting

- **400 Bad Request:**

  - Ensure the `name` and `image` parameters are included in the request.
  - Verify the `Content-Type` header is set to `multipart/form-data`.

- **Network Issues:**
  - Ensure both the React Native app and the Flask server are on the same network.
  - Use the correct IP address and port for the Flask server.
