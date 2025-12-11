const express = require("express");
const router = express.Router();
const {
  testServer,
  saveData,
  getRecentByDevice,
  getLatestThreshold,
  getFanStages,
} = require("../controllers/deviceController");

router.get("/", testServer);
router.post("/iotdata", saveData);

// ✅ Put fixed routes first
router.get("/latest_threshold", getLatestThreshold);
router.get("/fan_stages", getFanStages);

// ❗ Keep dynamic routes after
router.get("/:deviceName/recent", getRecentByDevice);

module.exports = router;
