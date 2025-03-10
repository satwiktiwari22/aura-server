import cv2
from ultralytics import YOLO
import time
import paho.mqtt.client as mqtt

# Load the pre-trained YOLOv8 model
model = YOLO('yolov8n.pt')

# MQTT Client Setup
mqtt_client = mqtt.Client()
mqtt_client.connect("192.168.137.238", 1883)


# Flag to prevent repeated light switching
person_detected_flag = False
last_person_time = time.time()
smart_mode = True
# Start capturing the live video feed
camera_url = "https://192.168.137.248:8080/video"
cap = cv2.VideoCapture(0)


def on_message(client, userdata, msg):
    global smart_mode
    if msg.topic == "home/smartmode":
        smart_mode = msg.payload.decode() == "on"
        print(f"Smart Mode updated to: {'ON' if smart_mode else 'OFF'}")


# Subscribe to the smart mode topic
mqtt_client.on_message = on_message
mqtt_client.subscribe("home/smartmode")
# Loop over frames from the camera
while True:
    ret, frame = cap.read()  # Read the frame from the camera

    if not ret:
        print("Failed to grab frame")
        break

    # Perform YOLO detection on the current frame
    results = model(frame, conf=0.7, iou=0.6)

    # Extract person detections (class_id 0 corresponds to 'person' in the COCO dataset)
    person_detected = False
    for result in results:
        boxes = result.boxes
        class_ids = boxes.cls

        # Filter detections for the "person" class (class_id 0)
        person_detections = boxes[class_ids == 0]

        # If there are any person detections, set the flag to True
        if len(person_detections) > 0:
            person_detected = True
            last_person_time = time.time()  # Reset the timer if a person is detected

            # Draw bounding boxes on the frame
            for det in person_detections:
                x1, y1, x2, y2 = det.xyxy[0]  # Bounding box coordinates
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, "Person", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    # MQTT Logic to control lights
    if person_detected and not person_detected_flag:
        # Publish to turn on light
        mqtt_client.publish("home/lights", "OFF")
        print("Light turned ON")
        person_detected_flag = True  # Set flag to prevent repeated ON commands

    elif not person_detected and person_detected_flag:
        # Check if no person has been detected for 10 seconds
        if time.time() - last_person_time > 10:
            # Publish to turn off light
            mqtt_client.publish("home/lights", "ON")
            print("Light turned OFF")
            person_detected_flag = False  # Reset flag for the next detection

    # Display the frame with the person detections
    cv2.imshow('YOLOv8 Live Person Detection', frame)

    # Press 'q' to quit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()
