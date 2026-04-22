const express = require("express");
const router = express.Router();
const Clothing = require("../models/Clothing");

// Demo data used when MongoDB is unavailable
const DEMO_CLOTHES = [
  { _id: "1",  name: "White T-Shirt",   category: "top",    color: "white",    image_url: null },
  { _id: "2",  name: "Black Tee",       category: "top",    color: "black",    image_url: null },
  { _id: "3",  name: "Blue Shirt",      category: "top",    color: "blue",     image_url: null },
  { _id: "4",  name: "Red Blouse",      category: "top",    color: "red",      image_url: null },
  { _id: "5",  name: "Navy Top",        category: "top",    color: "navy",     image_url: null },
  { _id: "6",  name: "Lavender Top",    category: "top",    color: "lavender", image_url: null },
  { _id: "7",  name: "Black Jeans",     category: "bottom", color: "black",    image_url: null },
  { _id: "8",  name: "Blue Denim",      category: "bottom", color: "blue",     image_url: null },
  { _id: "9",  name: "Beige Chinos",    category: "bottom", color: "beige",    image_url: null },
  { _id: "10", name: "Grey Trousers",   category: "bottom", color: "grey",     image_url: null },
  { _id: "11", name: "White Skirt",     category: "bottom", color: "white",    image_url: null },
  { _id: "12", name: "Red Midi Skirt",  category: "bottom", color: "red",      image_url: null },
  { _id: "13", name: "Floral Dress",    category: "dress",  color: "coral",    image_url: null },
  { _id: "14", name: "Black Evening",   category: "dress",  color: "black",    image_url: null },
  { _id: "15", name: "White Summer",    category: "dress",  color: "white",    image_url: null },
  { _id: "16", name: "Teal Wrap Dress", category: "dress",  color: "teal",     image_url: null },
];

/**
 * GET /clothes
 * Returns all clothing items. Falls back to demo data if DB unavailable.
 */
router.get("/", async (req, res) => {
  try {
    const clothes = await Clothing.find().sort({ category: 1, name: 1 });
    if (clothes.length === 0) return res.json(DEMO_CLOTHES);
    res.json(clothes);
  } catch {
    res.json(DEMO_CLOTHES);
  }
});

/**
 * GET /clothes/:category
 * Returns clothing filtered by category (top | bottom | dress).
 */
router.get("/:category", async (req, res) => {
  const { category } = req.params;
  if (!["top", "bottom", "dress"].includes(category)) {
    return res.status(400).json({ error: "Invalid category. Use: top, bottom, dress" });
  }
  try {
    const clothes = await Clothing.find({ category }).sort({ name: 1 });
    if (clothes.length === 0) return res.json(DEMO_CLOTHES.filter((c) => c.category === category));
    res.json(clothes);
  } catch {
    res.json(DEMO_CLOTHES.filter((c) => c.category === category));
  }
});

/**
 * POST /clothes
 * Add a new clothing item.
 */
router.post("/", async (req, res) => {
  try {
    const { name, category, color, image_url, tags, brand } = req.body;
    if (!name || !category || !color) {
      return res.status(400).json({ error: "name, category, and color are required" });
    }
    const item = await Clothing.create({ name, category, color, image_url, tags, brand });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /clothes/:id
 * Remove a clothing item.
 */
router.delete("/:id", async (req, res) => {
  try {
    await Clothing.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
