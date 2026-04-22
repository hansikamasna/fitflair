import { useState } from "react";
import { useOutfit } from "../context/OutfitContext";

/**
 * Top navigation bar with:
 * - Branding
 * - AI toggle
 * - Screenshot
 * - Save outfit
 * - Reset
 */
export default function TopBar({ onToggleAI, showAI }) {
  const { outfit, resetOutfit } = useOutfit();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasOutfit =
    outfit.top || outfit.bottom || outfit.dress;

  /* ===================================
     SAVE OUTFIT
  =================================== */
  const handleSave = async () => {
    if (!hasOutfit) return;

    setSaving(true);

    try {
      const res = await fetch(
        "http://localhost:4000/outfit/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            top: outfit.top?._id || null,
            bottom: outfit.bottom?._id || null,
            dress: outfit.dress?._id || null,
            savedAt: new Date().toISOString(),
          }),
        }
      );

      if (res.ok) {
        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  /* ===================================
     SCREENSHOT FIXED
  =================================== */
  const handleScreenshot = () => {
    try {
      const canvas =
        document.querySelector("canvas");

      if (!canvas) {
        alert("Canvas not found");
        return;
      }

      // small delay so frame fully renders
      requestAnimationFrame(() => {
        const image =
          canvas.toDataURL("image/png");

        const link =
          document.createElement("a");

        link.href = image;
        link.download = `fitflair-${Date.now()}.png`;
        link.click();
      });
    } catch (err) {
      console.error("Screenshot error:", err);
      alert("Screenshot failed");
    }
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-violet-500/10 bg-[#0d0d0f] flex-shrink-0 z-20">

      {/* LEFT BRAND */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <span className="text-white text-xs">
            ✦
          </span>
        </div>

        <div>
          <h1
            className="text-sm font-bold text-white"
            style={{
              fontFamily:
                "Orbitron, sans-serif",
              letterSpacing: "2px",
            }}
          >
            FITFLAIR
          </h1>

          <p className="text-[10px] text-white/30 font-mono leading-none mt-0.5">
            3D Fashion Studio
          </p>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-2">

        {/* AI BUTTON */}
        <button
          onClick={onToggleAI}
          className={`px-3 py-1.5 rounded-lg text-xs tracking-wider border transition-all ${
            showAI
              ? "bg-violet-600 border-violet-500 text-white"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
          style={{
            fontFamily:
              "Orbitron, sans-serif",
          }}
        >
          AI Stylist
        </button>

        {/* SCREENSHOT */}
        <button
          onClick={handleScreenshot}
          className="px-3 py-1.5 rounded-lg text-xs border bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          style={{
            fontFamily:
              "Orbitron, sans-serif",
          }}
        >
          📸 Screenshot
        </button>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={!hasOutfit || saving}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
            saved
              ? "bg-green-600 border border-green-500 text-white"
              : hasOutfit
              ? "bg-violet-600 hover:bg-violet-500 border border-violet-500 text-white"
              : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
          }`}
          style={{
            fontFamily:
              "Orbitron, sans-serif",
          }}
        >
          {saving
            ? "Saving..."
            : saved
            ? "✓ Saved!"
            : "Save Outfit"}
        </button>

        {/* RESET */}
        {hasOutfit && (
          <button
            onClick={resetOutfit}
            className="px-3 py-1.5 rounded-lg text-xs border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 transition-all"
            style={{
              fontFamily:
                "Orbitron, sans-serif",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
