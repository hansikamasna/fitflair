const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const clothesRouter = require("./routes/clothes");
const outfitRouter  = require("./routes/outfit");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────

// ✅ Allow all origins (for development)
app.use(cors());

// Parse JSON
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────

// API routes
app.use("/clothes", clothesRouter);
app.use("/outfit", outfitRouter);

// ✅ Root route (FIXED YOUR ERROR)
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date(),
  });
});

// ─── Database + Server Start ───────────────────────────────

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/virtual_tryon";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected:", MONGO_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);

    console.log("⚠️ Starting without database (demo mode)...");

    app.listen(PORT, () => {
      console.log(`🚀 Backend (no DB) running on http://localhost:${PORT}`);
    });
  });

module.exports = app;