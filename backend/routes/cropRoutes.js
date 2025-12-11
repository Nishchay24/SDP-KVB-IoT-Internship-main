const express = require("express");
const multer = require("multer");
const { uploadCrops, getCrops } = require("../controllers/cropController");

const router = express.Router();

// Multer setup: store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload crops JSON
router.post("/upload", upload.single("file"), uploadCrops);

// Get all crops
router.get("/", getCrops);

module.exports = router;
