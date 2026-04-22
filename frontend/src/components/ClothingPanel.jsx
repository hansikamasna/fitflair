import { useState, useEffect } from "react";
import { useOutfit } from "../context/OutfitContext";
import DragDropClothing from "./DragDropClothing";
import UploadClothing from "./UploadClothing";

const CATEGORIES = ["all", "top", "bottom", "dress"];

/**
 * Right sidebar: clothing catalog.
 * Fetches from Node.js backend. Falls back to demo data if offline.
 */

// Demo clothing data used when backend is unavailable
const DEMO_CLOTHES = [
  { _id: "1", name: "White T-Shirt",     category: "top",    color: "white",  image_url: null },
  { _id: "2", name: "Black Tee",         category: "top",    color: "black",  image_url: null },
  { _id: "3", name: "Blue Shirt",        category: "top",    color: "blue",   image_url: null },
  { _id: "4", name: "Red Blouse",        category: "top",    color: "red",    image_url: null },
  { _id: "5", name: "Navy Top",          category: "top",    color: "navy",   image_url: null },
  { _id: "6", name: "Lavender Top",      category: "top",    color: "lavender", image_url: null },
  { _id: "7", name: "Black Jeans",       category: "bottom", color: "black",  image_url: null },
  { _id: "8", name: "Blue Denim",        category: "bottom", color: "blue",   image_url: null },
  { _id: "9", name: "Beige Chinos",      category: "bottom", color: "beige",  image_url: null },
  { _id:"10", name: "Grey Trousers",     category: "bottom", color: "grey",   image_url: null },
  { _id:"11", name: "White Skirt",       category: "bottom", color: "white",  image_url: null },
  { _id:"12", name: "Red Midi Skirt",    category: "bottom", color: "red",    image_url: null },
  { _id:"13", name: "Floral Dress",      category: "dress",  color: "coral",  image_url: null },
  { _id:"14", name: "Black Evening",     category: "dress",  color: "black",  image_url: null },
  { _id:"15", name: "White Summer",      category: "dress",  color: "white",  image_url: null },
  { _id:"16", name: "Teal Wrap Dress",   category: "dress",  color: "teal",   image_url: null },
];

const COLOR_DOT = {
  red: "#e74c3c", blue: "#3498db", green: "#2ecc71",
  yellow: "#f1c40f", white: "#f0f0f0", black: "#2c2c2c",
  grey: "#95a5a6", beige: "#f5deb3", pink: "#ff69b4",
  purple: "#9b59b6", orange: "#e67e22", navy: "#1a237e",
  teal: "#00897b", coral: "#ff6b6b", lavender: "#9c88ff",
};

export default function ClothingPanel() {
  const [clothes, setClothes] = useState(DEMO_CLOTHES);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const { outfit, removeClothing, resetOutfit, fetchAISuggestions } = useOutfit();

  // Fetch from backend
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/clothes")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length) setClothes(data); })
      .catch(() => {}) // silently use demo data
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "all"
    ? clothes
    : clothes.filter((c) => c.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xs font-mono tracking-[0.2em] text-violet-400 uppercase">
          Wardrobe
        </h2>
        <p className="text-white/30 text-xs mt-1">Drag items onto mannequin</p>
      </div>
      <UploadClothing />
      {/* Category filters */}
      <div className="flex gap-1 p-3 border-b border-white/10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-1 py-1.5 rounded text-xs font-mono capitalize transition-all ${
              activeCategory === cat
                ? "bg-violet-600 text-white"
                : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Current outfit summary */}
      <div className="px-4 py-3 border-b border-white/10 space-y-1.5">
        <p className="text-xs text-white/30 uppercase tracking-widest font-mono">Wearing</p>
        {["top","bottom","dress"].map((layer) => (
          outfit[layer] ? (
            <div key={layer} className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: COLOR_DOT[outfit[layer].color] || outfit[layer].color }}
                />
                <span className="text-xs text-white/70">{outfit[layer].name}</span>
              </div>
              <button
                onClick={() => removeClothing(layer)}
                className="text-white/30 hover:text-red-400 text-xs px-1 transition-colors"
              >✕</button>
            </div>
          ) : (
            <div key={layer} className="flex items-center gap-2 px-2 py-1">
              <span className="w-3 h-3 rounded-full border border-white/10" />
              <span className="text-xs text-white/20 italic capitalize">{layer} — empty</span>
            </div>
          )
        ))}
        {(outfit.top || outfit.bottom || outfit.dress) && (
          <button
            onClick={resetOutfit}
            className="w-full mt-1 py-1.5 text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/50 rounded transition-all"
          >
            Reset outfit
          </button>
        )}
      </div>

      {/* Clothing grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((item) => (
              <DragDropClothing
                key={item._id}
                item={item}
                colorDot={COLOR_DOT[item.color] || item.color}
                onAIRequest={() => item.category === "top" && fetchAISuggestions(item.color)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
