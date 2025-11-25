# RFID API (Express + Mongo) + ESP32 client

## Quick start (Docker)
1. Copy .env.example -> api/.env (or rely on compose env)
2. Edit API_KEY in docker-compose.yml to a secret.
3. Start:
   docker-compose up --build

API will be at http://localhost:3000

## Test endpoints
POST sample:
curl -X POST http://localhost:3000/api/scan -H "Content-Type: application/json" -H "x-api-key: change-me-to-a-secret-key" -d '{"tag":"ABC123","deviceId":"test"}'

Get history:
curl http://localhost:3000/api/tags/ABC123/history

Top:
curl http://localhost:3000/api/stats/top?days=7&limit=10

## ESP32
- Edit `esp32/esp32_rfid_client.ino` with your WiFi and server IP.
- Upload to ESP32. Connect ID12LA TX -> RX1 pin (configured as RX_PIN=16 above).
- Set API key header to match server.

## Notes
- Use HTTPS + proper auth in production.
- Consider rate-limiting, validation, and device-level auth.

