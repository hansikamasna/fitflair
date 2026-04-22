import { useOutfit } from "../context/OutfitContext";

const BODY_TYPES = [
  { id: "slim", label: "Slim" },
  { id: "medium", label: "Medium" },
  { id: "curvy", label: "Curvy" },
];

const SKIN_TONES = [
  { id: "light", label: "Light", color: "#f5d7c6" },
  { id: "medium", label: "Medium", color: "#d2a679" },
  { id: "dark", label: "Dark", color: "#8d5524" },
];

export default function CustomizationPanel() {
  const { bodyType, setBodyType, skinTone, setSkinTone } = useOutfit();

  return (
    <div className="w-72 bg-black/80 border-r border-white/10 text-white h-full p-5 flex flex-col gap-6">
      <div>
        <h2 className="text-xs font-mono tracking-[0.2em] text-violet-400 uppercase">
          Customize
        </h2>
        <p className="text-white/40 text-sm mt-2">Mannequin settings</p>
      </div>

      {/* Body Type */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">
          Body Type
        </h3>
        <div className="flex flex-col gap-3">
          {BODY_TYPES.map((bt) => (
            <button
              key={bt.id}
              onClick={() => setBodyType(bt.id)}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-4 border transition-all ${
                bodyType === bt.id
                  ? "bg-violet-700/30 border-violet-500 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              <span>{bt.label}</span>
              {bodyType === bt.id && (
                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Tone */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">
          Skin Tone
        </h3>
        <div className="flex flex-col gap-3">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setSkinTone(tone.id)}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-4 border transition-all ${
                skinTone === tone.id
                  ? "bg-violet-700/30 border-violet-500 text-white"
                  : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: tone.color }}
                />
                <span>{tone.label}</span>
              </div>

              {skinTone === tone.id && (
                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      
    </div>
  );
}