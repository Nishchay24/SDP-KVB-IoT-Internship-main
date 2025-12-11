const DeviceConfig = require("../models/deviceConfig");
const Crop = require("../models/Crop");
const DeviceHistory = require("../models/DeviceHistory");

// @desc    Get configuration for a device
// @route   GET /api/device-config/:deviceName
exports.getDeviceConfig = async (req, res) => {
  try {
    const config = await DeviceConfig.findOne({
      device_name: req.params.deviceName,
    });
    if (!config)
      return res.status(404).json({ msg: "No configuration found." });
    res.json(config);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// @desc    Update device configuration based on selected crop
// @route   POST /api/device-config/:deviceName/configure
exports.configureDevice = async (req, res) => {
  const { cropName } = req.body;

  try {
    const crop = await Crop.findOne({ crop_name: cropName });
    if (!crop) return res.status(404).json({ msg: "Crop not found." });

    // 1️⃣ Update the current configuration including fan stages
    const updatedConfig = await DeviceConfig.findOneAndUpdate(
      { device_name: req.params.deviceName },
      {
        temperature: crop.temperature,
        humidity: crop.humidity,
        stage1_pwm: crop.fan_stages[0],
        stage2_pwm: crop.fan_stages[1],
        stage3_pwm: crop.fan_stages[2],
        stage4_pwm: crop.fan_stages[3],
        stage5_pwm: crop.fan_stages[4],
        stage6_pwm: crop.fan_stages[5],
      },
      { new: true, upsert: true }
    );

    // 2️⃣ Save a history entry including fan stages
    await DeviceHistory.create({
      device_name: req.params.deviceName,
      crop_name: crop.crop_name,
      temperature: crop.temperature,
      humidity: crop.humidity,
      fan_stages: crop.fan_stages,
    });

    res.json({
      msg: "Device configured successfully.",
      config: updatedConfig,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getDeviceHistory = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = { device_name: req.params.deviceName };

    if (start || end) {
      filter.configuredAt = {};

      if (start) {
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0); // start of the day local
        filter.configuredAt.$gte = startDate;
      }

      if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // end of the day local
        filter.configuredAt.$lte = endDate;
      }
    }

    const history = await DeviceHistory.find(filter).sort({ configuredAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("Error fetching device history:", err);
    res.status(500).json({ msg: err.message });
  }
};