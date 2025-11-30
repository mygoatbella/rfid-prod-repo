#include <SoftwareSerial.h>

// Connect RFID Reader TX to Arduino Pin 2
// Connect RFID Reader RX to Arduino Pin 3 (optional, not used)
SoftwareSerial RFIDSerial(2, 3); 

void setup() {
  // Start the USB connection to the computer
  Serial.begin(9600);
  
  // Start the connection to the RFID reader
  RFIDSerial.begin(9600); 
  
  Serial.println("Arduino Ready. Scan a tag...");
}

void loop() {
  if (RFIDSerial.available()) {
    String tag = "";
    
    // Read the tag characters
    while (RFIDSerial.available()) {
      char c = RFIDSerial.read();
      // Only keep numbers/letters (clean up garbage data)
      if (isAlphaNumeric(c)) {
        tag += c;
      }
      delay(5); // Wait tiny bit for next char
    }
    
    if (tag.length() > 0) {
      Serial.println("TAG:" + tag); // Send to Python
      delay(1000); // Wait 1 second before next scan
    }
  }
}