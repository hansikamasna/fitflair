const mongoose = require("mongoose");

/**
 * Saved outfit model.
 * References clothing items by ID for each layer.
 */
const outfitSchema = new mongoose.Schema(
  {
    top:    { type: mongoose.Schema.Types.ObjectId, ref: "Clothing", default: null },
    bottom: { type: mongoose.Schema.Types.ObjectId, ref: "Clothing", default: null },
    dress:  { type: mongoose.Schema.Types.ObjectId, ref: "Clothing", default: null },
    name:   { type: String, default: "My Outfit" },
    screenshot_url: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Outfit", outfitSchema);
