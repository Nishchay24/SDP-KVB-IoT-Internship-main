// controllers/userController.js
const User = require("../models/User");

// GET /api/users/devices?email=user@example.com
exports.getUserDevices = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ devices: user.devices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/users/count
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/devices/count
exports.getDeviceCount = async (req, res) => {
  try {
    const users = await User.find({}, "devices");
    let totalDevices = 0;

    users.forEach(user => {
      totalDevices += user.devices.length;
    });

    res.json({ totalDevices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};