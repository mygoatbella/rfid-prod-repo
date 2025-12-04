const mongoose = require('mongoose');

const TagStatsSchema = new mongoose.Schema({
  tag: { type: String, unique: true, index: true },
  total: { type: Number, default: 0 },
  lastSeen: { type: Date }
});

// The fix is in this line:
module.exports = mongoose.models.TagStats || mongoose.model('TagStats', TagStatsSchema);