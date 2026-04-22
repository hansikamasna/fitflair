import { useState } from "react";
import { useOutfit } from "../context/OutfitContext";

/**
 * Individual draggable clothing card.
 * Sets dataTransfer on dragStart, which MannequinViewer reads on drop.
 * Also supports click-to-equip.
 */
export default function DragDropClothing({ item, colorDot, onAIRequest }) {
  const { equipClothing, outfit } = useOutfit();
  const [dragging, setDragging] = useState(false);

  // Check if this item is currently equipped
  const isEquipped = outfit[item.category]?._id === item._id;

  const handleDragStart = (e) => {
    // Embed item data in drag transfer
    e.dataTransfer.setData("clothing-item", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
    setDragging(true);
  };

  const handleDragEnd = () => setDragging(false);

  const handleClick = () => {
    equipClothing(item);
    if (onAIRequest) onAIRequest();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      title={`Click or drag to wear: ${item.name}`}
      className={`
        relative group cursor-grab active:cursor-grabbing
        rounded-xl border transition-all duration-200 select-none overflow-hidden
        ${isEquipped
          ? "border-violet-500/60 bg-violet-600/20 shadow-lg shadow-violet-900/30"
          : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
        }
        ${dragging ? "opacity-50 scale-95" : ""}
      `}
    >
      {/* Clothing preview */}
      <div
        className="h-20 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${colorDot}33, transparent 70%)`,
        }}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-contain p-2"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          // Color swatch fallback
          <div
            className="w-10 h-10 rounded-lg shadow-inner border border-white/10 flex items-center justify-center"
            style={{ backgroundColor: colorDot }}
          >
            <span className="text-xs opacity-50">
              {item.category === "top" ? "👕" : item.category === "bottom" ? "👖" : "👗"}
            </span>
          </div>
        )}

        {/* Equipped badge */}
        {isEquipped && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
            <span className="text-[8px] text-white">✓</span>
          </div>
        )}

        {/* Drag handle hint */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-xl" />
      </div>

      {/* Item info */}
      <div className="px-2 py-1.5">
        <p className="text-xs text-white/70 truncate leading-tight">{item.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/20"
            style={{ backgroundColor: colorDot }}
          />
          <span className="text-[10px] text-white/30 capitalize">{item.color}</span>
        </div>
      </div>
    </div>
  );
}
