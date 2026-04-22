import { createContext, useContext, useState, useCallback } from "react";

// Outfit context manages global state
const OutfitContext = createContext(null);

export function OutfitProvider({ children }) {
  // Body customization
  const [bodyType, setBodyType] = useState("medium");
  const [skinTone, setSkinTone] = useState("medium");

  // Outfit layers
  const [outfit, setOutfit] = useState({
    top: null,
    bottom: null,
    dress: null,
  });

  // AI stylist
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // ===================================================
  // EQUIP CLOTHING
  // ===================================================
  const equipClothing = useCallback((item) => {
    setOutfit((prev) => ({
      ...prev,
      [item.category]: item,

      // dress removes top + bottom
      ...(item.category === "dress"
        ? { top: null, bottom: null }
        : {}),

      // top/bottom removes dress
      ...(item.category !== "dress"
        ? { dress: null }
        : {}),
    }));
  }, []);

  // ===================================================
  // REMOVE CLOTHING
  // ===================================================
  const removeClothing = useCallback((category) => {
    setOutfit((prev) => ({
      ...prev,
      [category]: null,
    }));
  }, []);

  // ===================================================
  // RESET
  // ===================================================
  const resetOutfit = useCallback(() => {
    setOutfit({
      top: null,
      bottom: null,
      dress: null,
    });
  }, []);

  // ===================================================
  // AI COLOR SUGGESTIONS (FIXED)
  // ===================================================
  const fetchAISuggestions = useCallback(async (topColor) => {
    if (!topColor) return;

    setLoadingAI(true);

    try {
      const res = await fetch(
        `http://localhost:8000/recommend/${topColor}`
      );

      const data = await res.json();

      if (data.success) {
        setAiSuggestions(
          data.data?.suggested_bottoms || []
        );
      } else {
        setAiSuggestions([]);
      }
    } catch (err) {
      console.error("AI service error:", err);
      setAiSuggestions([]);
    } finally {
      setLoadingAI(false);
    }
  }, []);

  return (
    <OutfitContext.Provider
      value={{
        bodyType,
        setBodyType,

        skinTone,
        setSkinTone,

        outfit,
        equipClothing,
        removeClothing,
        resetOutfit,

        aiSuggestions,
        loadingAI,
        fetchAISuggestions,
      }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfit() {
  const ctx = useContext(OutfitContext);

  if (!ctx) {
    throw new Error(
      "useOutfit must be used within OutfitProvider"
    );
  }

  return ctx;
}
