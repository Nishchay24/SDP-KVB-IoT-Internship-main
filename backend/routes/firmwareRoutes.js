const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FirmwareManager = require("../utils/firmware-manager");
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const firmwareManager = new FirmwareManager(
  path.join(__dirname, "../firmware")
);

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // increased limit to 10MB
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith(".bin")) {
      cb(null, true);
    } else {
      cb(new Error("Only .bin files are allowed"), false);
    }
  },
});

// ✅ Admin-only: Upload firmware
router.post(
  "/upload",
  protect,
  authorizeAdmin,
  upload.single("firmware"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No firmware file provided",
        });
      }

      const version = req.body.version || `1.0.${Date.now()}`;
      const firmwareInfo = firmwareManager.uploadFirmware(
        req.file.buffer,
        version
      );

      res.json({
        success: true,
        message: "Firmware uploaded successfully",
        firmware: firmwareInfo,
      });
    } catch (error) {
      console.error("Error uploading firmware:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading firmware",
      });
    }
  }
);

// Public: Get firmware info
router.get("/info", (req, res) => {
  const firmwareInfo = firmwareManager.getFirmwareInfo();
  if (!firmwareInfo) {
    return res
      .status(404)
      .json({ available: false, message: "No firmware available" });
  }
  res.json({ available: true, ...firmwareInfo });
});

// Public: Download firmware
router.get("/download", (req, res) => {
  const firmwarePath = path.join(__dirname, "../firmware/firmware.bin");
  if (!fs.existsSync(firmwarePath)) {
    return res
      .status(404)
      .json({ success: false, message: "No firmware file found" });
  }
  res.download(firmwarePath, "firmware.bin");
});

module.exports = router;
