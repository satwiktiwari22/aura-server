import cv2
import requests
import time

# Replace with your IP camera's stream URL
camera_url = "http://192.168.137.248:8080/video"

# Flask server URL
flask_url = "http://192.168.137.114:5000/detect_face"

# Open the video stream
cap = cv2.VideoCapture(camera_url)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Save the frame as a temporary file
    _, img_encoded = cv2.imencode('.jpg', frame)
    files = {'image': ('frame.jpg', img_encoded.tobytes(), 'image/jpeg')}

    # Send the frame to the Flask server
    response = requests.post(flask_url, files=files)
    if response.ok:
        detection_result = response.json()
        if detection_result.get("intruder_detected"):
            print("Intruder detected!")
    else:
        print("Error sending frame to server.")

    # Delay between frames
    time.sleep(1)  # Send one frame per second

cap.release()
