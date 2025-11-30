import serial
import requests
import time
import json

# --- CONFIGURATION ---
# REPLACE 'COM3' with your actual Arduino Port (Check Arduino IDE > Tools > Port)
# On Mac it will look like '/dev/cu.usbserial-...'
SERIAL_PORT = '/dev/cu.Bluetooth-Incoming-Port Serial Port' 
BAUD_RATE = 9600

# REPLACE with your actual Render URL
API_URL = "https://rfid-api-epu4.onrender.com"
# ---------------------

print(f"Connecting to Arduino on {SERIAL_PORT}...")

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    time.sleep(2) # Wait for Arduino to reset
    print("Connected! Waiting for scans...")

    while True:
        if ser.in_waiting > 0:
            # Read line from Arduino
            line = ser.readline().decode('utf-8').strip()
            
            # Check if it's a tag (Our Arduino code sends "TAG:12345")
            if line.startswith("TAG:"):
                tag_id = line.split(":")[1]
                print(f"Tag Detected: {tag_id}")
                
                # Prepare data for Server
                payload = {
                    "tag": tag_id,
                    "deviceId": "arduino-bridge",
                    "readerId": "r1"
                }
                
                # Send to Render Server
                try:
                    response = requests.post(API_URL, json=payload)
                    if response.status_code == 200:
                        print("✅ Sent to Server successfully!")
                    else:
                        print(f"❌ Server Error: {response.status_code}")
                except Exception as e:
                    print(f"⚠️ Internet Error: {e}")
                    
except serial.SerialException:
    print(f"Error: Could not open port {SERIAL_PORT}. Check your cable and settings.")
except KeyboardInterrupt:
    print("\nStopping Bridge.")