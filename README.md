# RFID API (Express + Mongo) + ESP32 client

## How to Run (Arduino Uno + Python Bridge)
1. Upload the code in `arduino_scanner.ino` to the Arduino Uno.
2. Connect the Arduino to the laptop via USB.
3. Update the COM port in `bridge/bridge.py`.
4. Run the bridge:
   cd bridge
   python bridge.py

API will be at http://localhost:3000

## Test endpoints
POST sample:
curl -X POST http://localhost:3000/api/scan -H "Content-Type: application/json" -H "x-api-key: change-me-to-a-secret-key" -d '{"tag":"ABC123","deviceId":"test"}'

Get history:
curl http://localhost:3000/api/tags/ABC123/history

Top:
curl http://localhost:3000/api/stats/top?days=7&limit=10


## Notes
- Use HTTPS + proper auth in production.
- Consider rate-limiting, validation, and device-level auth.

