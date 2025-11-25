#include <WiFi.h>
#include <HTTPClient.h>

// CONFIG
const char* ssid = "WIFI_SSID";
const char* password = "WIFI_PASS";
const char* endpoint = "http://your-server-ip:3000/api/scan"; // use https in prod
const char* apiKey = "change-me-to-a-secret-key";

HardwareSerial RFIDSerial(1); // use UART1 (RX1/TX1 pins)
const int RX_PIN = 16; // connect ID-12LA TX -> RX1
const int TX_PIN = 17; // unused but required for begin

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.println("\nWiFi connected");

  RFIDSerial.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN); // RX pin receives reader TX
  Serial.println("RFID UART ready");
}

String readTag() {
  String s = "";
  unsigned long start = millis();
  while (millis() - start < 1000) {
    while (RFIDSerial.available()) {
      char c = RFIDSerial.read();
      if (c >= 32 && c <= 126) s += c;
    }
    if (s.length()) break;
  }
  s.trim();
    return s;   
}
void sendScan(const String &tag) {
    if (WiFi.status() != WL_CONNECTED) return;
    HTTPClient http;
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", apiKey);
  
    String payload = "{\"tag\":\"" + tag + "\",\"deviceId\":\"esp32-01\",\"readerId\":\"r1\"}";
    int code = http.POST(payload);
    if (code > 0) {
      Serial.printf("POST %d\n", code);
    } else {
      Serial.printf("POST failed: %s\n", http.errorToString(code).c_str());
    }
    http.end();
  }
  void loop() {
    String tag = readTag();
    if (tag.length()) {
      Serial.println("Tag: " + tag);
      sendScan(tag);
      delay(500); // avoid duplicates
    }
  }
  