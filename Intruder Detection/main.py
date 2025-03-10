from flask import Flask, request, jsonify
from flask_cors import CORS
import face_recognition
import os
import cv2
import numpy as np
from datetime import datetime
import paho.mqtt.client as mqtt

# Flask app and MQTT client setup
app = Flask(__name__)
CORS(app)
mqtt_client = mqtt.Client()
mqtt_client.connect("192.168.137.238", 1883)

# Path for known faces
KNOWN_FACES_DIR = "known_faces"
INTRUDER_LOG = "intruder_log.txt"

# Load known faces
known_face_encodings = []
known_face_names = []

# Add these global variables at the top of your file
last_intruder_time = None
intruder_interval = 60  # Time interval in seconds to log the same intruder


def load_known_faces():
    global known_face_encodings, known_face_names
    known_face_encodings.clear()
    known_face_names.clear()
    for filename in os.listdir(KNOWN_FACES_DIR):
        image_path = os.path.join(KNOWN_FACES_DIR, filename)
        image = face_recognition.load_image_file(image_path)
        encoding = face_recognition.face_encodings(image)[0]
        known_face_encodings.append(encoding)
        known_face_names.append(os.path.splitext(filename)[0])


load_known_faces()  # Initial load of known faces

# Endpoint to add a new family member


@app.route('/add_family_member', methods=['POST'])
def add_family_member():
    print(request.form)
    print(request.files)
    name = request.form['name']
    file = request.files['image']
    filepath = os.path.join(KNOWN_FACES_DIR, f"{name}.jpg")
    file.save(filepath)
    load_known_faces()  # Reload faces after adding a new one
    return jsonify({"message": f"Family member {name} added successfully."})

# Endpoint to process face detection


@app.route('/detect_face', methods=['POST'])
def detect_face():
    global last_intruder_time
    file = request.files['image']
    image = face_recognition.load_image_file(file)
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(image, face_locations)

    intruder_detected = False
    for encoding, location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(
            known_face_encodings, encoding)
        if True in matches:
            matched_idx = matches.index(True)
            name = known_face_names[matched_idx]
            print(f"Authorized person detected: {name}")
        else:
            intruder_detected = True
            current_time = datetime.now()
            print(f"Intruder detected at {current_time}")

            if last_intruder_time is None or (current_time - last_intruder_time).total_seconds() > intruder_interval:
                last_intruder_time = current_time
                timestamp = current_time.strftime('%Y-%m-%d %H:%M:%S')
                log_entry = f"Intruder detected at {timestamp}\n"
                with open(INTRUDER_LOG, "a") as log_file:
                    log_file.write(log_entry)
            mqtt_client.publish("home/intruder", "Intruder detected")
            print("Intruder detected")

    return jsonify({"intruder_detected": intruder_detected})

# Endpoint to list all added family members


@app.route('/list_family_members', methods=['GET'])
def list_family_members():
    load_known_faces()  # Ensure the latest list is loaded
    return jsonify({"family_members": known_face_names})


# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
