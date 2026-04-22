const mongoose = require("mongoose");

/**
 * Clothing model schema
 * Stores each clothing item with its category, color, and image path.
 */
const clothingSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    category:  { type: String, required: true, enum: ["top", "bottom", "dress"], index: true },
    color:     { type: String, required: true, lowercase: true, trim: true },
    image_url: { type: String, default: null },   // path to /public/clothes/<category>/<file>.png
    tags:      [{ type: String }],               // optional style tags e.g. ["casual","summer"]
    brand:     { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clothing", clothingSchema);
