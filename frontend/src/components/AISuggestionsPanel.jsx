import { useState } from "react";
import { useOutfit } from "../context/OutfitContext";

const COLORS = [
  "red","blue","green","yellow","white","black",
  "grey","beige","pink","purple","orange","navy","teal","coral","lavender",
];

const COLOR_HEX = {
  red:"#e74c3c",blue:"#3498db",green:"#2ecc71",yellow:"#f1c40f",
  white:"#f0f0f0",black:"#2c2c2c",grey:"#95a5a6",beige:"#f5deb3",
  pink:"#ff69b4",purple:"#9b59b6",orange:"#e67e22",navy:"#1a237e",
  teal:"#00897b",coral:"#ff6b6b",lavender:"#9c88ff",
};

/**
 * AI Stylist panel — uses FastAPI color recommendation service.
 * User picks a top color, receives suggested bottom colors.
 */
export default function AISuggestionsPanel() {
  const { aiSuggestions, loadingAI, fetchAISuggestions, outfit, equipClothing } = useOutfit();
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorPick = (color) => {
    setSelectedColor(color);
    fetchAISuggestions(color);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xs font-mono tracking-[0.2em] text-violet-400 uppercase">
           AI Stylist
        </h2>
        <p className="text-white/30 text-xs mt-1">Color theory recommendations</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Color picker */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Select top color
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => handleColorPick(c)}
                title={c}
                className={`aspect-square rounded-lg border-2 transition-all duration-150 ${
                  selectedColor === c
                    ? "border-violet-400 scale-110 shadow-lg shadow-violet-900/40"
                    : "border-transparent hover:border-white/30 hover:scale-105"
                }`}
                style={{ backgroundColor: COLOR_HEX[c] || c }}
              />
            ))}
          </div>
          {selectedColor && (
            <p className="text-xs text-white/40 mt-2 capitalize">
              Selected: <span className="text-violet-300">{selectedColor}</span>
            </p>
          )}
        </section>

        {/* AI Output */}
        <section>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
            Suggested bottoms
          </h3>

          {loadingAI ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-sm text-white/40 font-mono">Analyzing color theory...</span>
            </div>
          ) : aiSuggestions.length > 0 ? (
            <div className="space-y-2">
              {aiSuggestions.map((color) => (
                <div
                  key={color}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-900/10 transition-all"
                >
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0"
                    style={{ backgroundColor: COLOR_HEX[color] || color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-white/80 capitalize">{color}</p>
                    <p className="text-[10px] text-white/30">bottom color</p>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedColor ? (
            <p className="text-sm text-white/30 italic py-2">No suggestions found. Check AI service.</p>
          ) : (
            <p className="text-sm text-white/30 italic py-2">Pick a top color above to get suggestions.</p>
          )}
        </section>

        {/* Color theory explanation */}
        <section className="bg-white/5 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            Color Theory
          </h3>
          <div className="space-y-2 text-xs text-white/40 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">◆</span>
              <p><span className="text-white/60">Complementary</span> — colors opposite on the color wheel create bold contrast</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">◆</span>
              <p><span className="text-white/60">Analogous</span> — neighboring colors create harmonious outfits</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 mt-0.5">◆</span>
              <p><span className="text-white/60">Neutral</span> — white, black, grey, beige pair with almost anything</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
