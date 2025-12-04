const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  tag: { type: String, required: true, index: true },
  deviceId: String,
  readerId: String,
  metadata: mongoose.Schema.Types.Mixed,
  ts: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Scan', ScanSchema);