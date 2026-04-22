import { useState, useEffect } from "react";
import MannequinViewer from "./components/MannequinViewer";
import ClothingPanel from "./components/ClothingPanel";
import CustomizationPanel from "./components/CustomizationPanel";
import TopBar from "./components/TopBar";
import AISuggestionsPanel from "./components/AISuggestionsPanel";
import { OutfitProvider } from "./context/OutfitContext";

/* =========================================
   SPLASH SCREEN
========================================= */
function SplashScreen() {
  const fullText = "FITFLAIR";
  const [typed, setTyped] = useState("");
  const [showMascot, setShowMascot] = useState(false);

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTyped(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);

        setTimeout(() => {
          setShowMascot(true);
        }, 400);
      }
    }, 220);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#09090b] flex items-center justify-center overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-violet-600/20 blur-[150px] rounded-full" />

      {/* Mascot */}
      {showMascot && (
        <img
          src="/mascot.png"
          alt="Mascot"
          className="absolute bottom-10 right-16 w-44 animate-bounce z-20"
        />
      )}

      {/* Center Content */}
      <div className="text-center z-10">
        <p className="text-violet-400 tracking-[6px] text-sm mb-4">
          LOADING SHOWROOM
        </p>

        <h1
          className="text-7xl font-black text-white"
          style={{
            fontFamily: "Orbitron, sans-serif",
            letterSpacing: "8px",
            textShadow: "0 0 20px rgba(139,92,246,.6)",
          }}
        >
          {typed}
          <span className="animate-pulse text-violet-400">|</span>
        </h1>

        <p className="mt-4 text-zinc-400 tracking-[3px]">
          AI Fashion Studio
        </p>

        {/* Loading Bar */}
        <div className="mt-10 w-80 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-violet-500 animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
}

/* =========================================
   MAIN UI
========================================= */
function MainUI() {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#0b0b0d] text-white overflow-hidden">
      <TopBar
        onToggleAI={() => setShowAI((prev) => !prev)}
        showAI={showAI}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <aside className="w-72 flex-shrink-0 border-r border-violet-500/20 bg-[#111113] overflow-y-auto">
          <CustomizationPanel />
        </aside>

        {/* Center Viewer */}
        <main className="flex-1 relative bg-[#0a0a0c]">
          <MannequinViewer />
        </main>

        {/* Right Panel */}
        <aside className="w-80 flex-shrink-0 border-l border-violet-500/20 bg-[#111113] overflow-y-auto">
          {showAI ? <AISuggestionsPanel /> : <ClothingPanel />}
        </aside>
      </div>
    </div>
  );
}

/* =========================================
   APP ROOT
========================================= */
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <OutfitProvider>
      {loading ? <SplashScreen /> : <MainUI />}
    </OutfitProvider>
  );
}
