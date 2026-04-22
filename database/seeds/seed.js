/**
 * seed.js — Populate MongoDB with sample clothing data
 * Run with: cd backend && node ../database/seeds/seed.js
 */
const mongoose = require("mongoose");
require("dotenv").config({ path: "../../backend/.env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/virtual_tryon";

const clothingSchema = new mongoose.Schema({
  name: String, category: String, color: String, image_url: String, tags: [String],
});
const Clothing = mongoose.model("Clothing", clothingSchema);

const SAMPLE_DATA = [
  { name: "Classic White T-Shirt",  category: "top",    color: "white",    tags: ["casual"] },
  { name: "Black Crewneck Tee",     category: "top",    color: "black",    tags: ["casual"] },
  { name: "Sky Blue Oxford Shirt",  category: "top",    color: "blue",     tags: ["smart"] },
  { name: "Cherry Red Blouse",      category: "top",    color: "red",      tags: ["bold"] },
  { name: "Deep Navy Polo",         category: "top",    color: "navy",     tags: ["classic"] },
  { name: "Lavender Silk Top",      category: "top",    color: "lavender", tags: ["elegant"] },
  { name: "Slim Black Jeans",       category: "bottom", color: "black",    tags: ["casual"] },
  { name: "Classic Blue Denim",     category: "bottom", color: "blue",     tags: ["casual"] },
  { name: "Beige Chino Pants",      category: "bottom", color: "beige",    tags: ["smart"] },
  { name: "Charcoal Grey Trousers", category: "bottom", color: "grey",     tags: ["office"] },
  { name: "White Flared Skirt",     category: "bottom", color: "white",    tags: ["feminine"] },
  { name: "Red Midi Skirt",         category: "bottom", color: "red",      tags: ["bold"] },
  { name: "Coral Floral Dress",     category: "dress",  color: "coral",    tags: ["summer"] },
  { name: "Black Evening Gown",     category: "dress",  color: "black",    tags: ["formal"] },
  { name: "White Summer Sundress",  category: "dress",  color: "white",    tags: ["summer"] },
  { name: "Teal Wrap Dress",        category: "dress",  color: "teal",     tags: ["elegant"] },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");
  await Clothing.deleteMany({});
  await Clothing.insertMany(SAMPLE_DATA);
  console.log(`✅ Seeded ${SAMPLE_DATA.length} items`);
  await mongoose.disconnect();
}

seed().catch(console.error);
