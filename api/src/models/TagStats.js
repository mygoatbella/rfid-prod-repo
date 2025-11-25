const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TagStats = new Schema({
  tag: { type: String, unique: true, index: true },
  total: { type: Number, default: 0 },
  lastSeen: { type: Date }
});
module.exports = mongoose.model('TagStats', TagStats);
