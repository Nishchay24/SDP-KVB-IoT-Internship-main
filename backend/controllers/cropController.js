const Crop = require("../models/Crop");

exports.uploadCrops = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    let jsonData = JSON.parse(req.file.buffer.toString());

    // If it's a single object, wrap it in an array
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData];
    }

    for (const crop of jsonData) {
      const { crop_name, temperature, humidity } = crop;

      if (!crop_name || temperature === undefined || humidity === undefined) {
        continue; // Skip invalid entries
      }

      // Upsert: update if exists, otherwise insert
      await Crop.findOneAndUpdate(
        { crop_name },
        { temperature, humidity },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ msg: "Crops uploaded and updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all crops
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
