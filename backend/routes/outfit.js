const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");

/**
 * POST /outfit/save
 * Save a user's current outfit combination.
 */
router.post("/save", async (req, res) => {
  try {
    const { top, bottom, dress, name, screenshot_url } = req.body;
    if (!top && !bottom && !dress) {
      return res.status(400).json({ error: "At least one clothing item is required" });
    }
    const outfit = await Outfit.create({ top, bottom, dress, name, screenshot_url });
    res.status(201).json(outfit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /outfit/suggestions
 * Returns recently saved outfits as inspiration.
 */
router.get("/suggestions", async (req, res) => {
  try {
    const outfits = await Outfit.find()
      .populate("top bottom dress")
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(outfits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /outfit/:id
 * Get a single saved outfit.
 */
router.get("/:id", async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id).populate("top bottom dress");
    if (!outfit) return res.status(404).json({ error: "Outfit not found" });
    res.json(outfit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
