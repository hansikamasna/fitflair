import { create } from "zustand";

const useOutfitStore = create((set) => ({
  bodyType: "medium", // slim | medium | curvy
  skinTone: "medium", // light | medium | dark

  equipped: {
    top: null,
    bottom: null,
    dress: null,
  },

  setBodyType: (bodyType) => set({ bodyType }),
  setSkinTone: (skinTone) => set({ skinTone }),

  equipClothing: (item) =>
    set((state) => ({
      equipped: {
        ...state.equipped,
        [item.category]: item,
      },
    })),

  removeClothing: (category) =>
    set((state) => ({
      equipped: {
        ...state.equipped,
        [category]: null,
      },
    })),
}));

export default useOutfitStore;