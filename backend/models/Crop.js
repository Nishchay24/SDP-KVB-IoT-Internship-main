// const mongoose = require("mongoose");

// const cropSchema = new mongoose.Schema({
//   crop_name: { type: String, required: true, unique: true },
//   temperature: { type: Number, required: true },
//   humidity: { type: Number, required: true },
// });

// module.exports = mongoose.model("Crop", cropSchema);


const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  crop_name: { type: String, required: true, unique: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  fan_stages: {
    type: [Number], // array of 6 numbers
    validate: {
      validator: function (arr) {
        return arr.length === 6;
      },
      message: "fan_stages must contain exactly 6 values",
    },
    required: true,
  },
});

module.exports = mongoose.model("Crop", cropSchema);
