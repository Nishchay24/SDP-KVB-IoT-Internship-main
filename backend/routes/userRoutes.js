// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserDevices,
  getUserCount,
  getDeviceCount,
} = require("../controllers/userController");

router.get("/devices", getUserDevices);
router.get("/count", getUserCount);
router.get("/devices/count", getDeviceCount);

module.exports = router;
