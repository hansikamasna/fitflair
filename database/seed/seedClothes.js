// database/seed/seedClothes.js
// Populates MongoDB with sample clothing items
// Run: node database/seed/seedClothes.js

require("dotenv").config({ path: "../backend/.env" });
const mongoose = require("mongoose");
const Clothing = require("../backend/models/Clothing");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/virtual_tryon";

/* ── Sample dataset ───────────────────────────────────────────── */
const sampleClothes = [
  // ── TOPS ──
  {
    name: "Classic White Shirt",
    category: "top",
    color: "white",
    image_url: "/clothes/tops/white-shirt.png",
    tags: ["formal", "classic"],
  },
  {
    name: "Navy Blue Tee",
    category: "top",
    color: "blue",
    image_url: "/clothes/tops/blue-tee.png",
    tags: ["casual", "summer"],
  },
  {
    name: "Red Crop Top",
    category: "top",
    color: "red",
    image_url: "/clothes/tops/red-crop.png",
    tags: ["casual", "trendy"],
  },
  {
    name: "Black Fitted Top",
    category: "top",
    color: "black",
    image_url: "/clothes/tops/black-top.png",
    tags: ["versatile", "evening"],
  },
  {
    name: "Lavender Blouse",
    category: "top",
    color: "lavender",
    image_url: "/clothes/tops/lavender-blouse.png",
    tags: ["feminine", "spring"],
  },
  {
    name: "Striped Casual Tee",
    category: "top",
    color: "navy",
    image_url: "/clothes/tops/stripe-tee.png",
    tags: ["casual", "nautical"],
  },

  // ── BOTTOMS ──
  {
    name: "High-Waist Jeans",
    category: "bottom",
    color: "blue",
    image_url: "/clothes/bottoms/blue-jeans.png",
    tags: ["denim", "casual"],
  },
  {
    name: "Beige Chinos",
    category: "bottom",
    color: "beige",
    image_url: "/clothes/bottoms/beige-chinos.png",
    tags: ["smart casual", "neutral"],
  },
  {
    name: "Black Trousers",
    category: "bottom",
    color: "black",
    image_url: "/clothes/bottoms/black-trousers.png",
    tags: ["formal", "versatile"],
  },
  {
    name: "White Skirt",
    category: "bottom",
    color: "white",
    image_url: "/clothes/bottoms/white-skirt.png",
    tags: ["feminine", "summer"],
  },
  {
    name: "Grey Joggers",
    category: "bottom",
    color: "grey",
    image_url: "/clothes/bottoms/grey-joggers.png",
    tags: ["casual", "sporty"],
  },
  {
    name: "Floral Midi Skirt",
    category: "bottom",
    color: "pink",
    image_url: "/clothes/bottoms/floral-skirt.png",
    tags: ["feminine", "spring"],
  },

  // ── DRESSES ──
  {
    name: "Little Black Dress",
    category: "dress",
    color: "black",
    image_url: "/clothes/dresses/black-dress.png",
    tags: ["evening", "classic"],
  },
  {
    name: "Floral Sundress",
    category: "dress",
    color: "yellow",
    image_url: "/clothes/dresses/yellow-sundress.png",
    tags: ["casual", "summer"],
  },
  {
    name: "Emerald Wrap Dress",
    category: "dress",
    color: "green",
    image_url: "/clothes/dresses/green-wrap.png",
    tags: ["smart", "occasion"],
  },
  {
    name: "Maxi Boho Dress",
    category: "dress",
    color: "coral",
    image_url: "/clothes/dresses/coral-maxi.png",
    tags: ["boho", "beach"],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  await Clothing.deleteMany({});
  console.log("Cleared existing clothing items");

  const inserted = await Clothing.insertMany(sampleClothes);
  console.log(`✅  Inserted ${inserted.length} clothing items`);

  await mongoose.disconnect();
  console.log("Done — database seeded!");
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
