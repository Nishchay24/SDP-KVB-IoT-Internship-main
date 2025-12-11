const mongoose = require("mongoose");

const deviceHistorySchema = new mongoose.Schema({
  device_name: { type: String, required: true },
  crop_name: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  configuredAt: { type: Date, default: Date.now },
});

// Optional index for faster cleanup queries
deviceHistorySchema.index(
  { configuredAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 31 }
);
// TTL index keeps entries for 31 days automatically

module.exports = mongoose.model("DeviceHistory", deviceHistorySchema);
