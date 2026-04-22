// utils/api.js
// Centralised API helpers — all fetch calls go through here
import axios from "axios";

const NODE_API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const AI_API   = process.env.REACT_APP_AI_URL  || "http://localhost:8000";

const nodeClient = axios.create({ baseURL: NODE_API, timeout: 8000 });
const aiClient   = axios.create({ baseURL: AI_API,   timeout: 8000 });

/* ── Clothing endpoints ─────────────────────────────────────── */

/** Fetch all clothing items */
export const fetchAllClothes = () =>
  nodeClient.get("/clothes").then((r) => r.data);

/** Fetch clothes by category: tops | bottoms | dresses */
export const fetchByCategory = (category) =>
  nodeClient.get(`/clothes/${category}`).then((r) => r.data);

/* ── Outfit endpoints ───────────────────────────────────────── */

/** Save the current outfit to the database */
export const saveOutfit = (payload) =>
  nodeClient.post("/outfit/save", payload).then((r) => r.data);

/** Fetch saved outfit suggestions (saved combinations) */
export const fetchSavedSuggestions = () =>
  nodeClient.get("/outfit/suggestions").then((r) => r.data);

/* ── AI service endpoint ────────────────────────────────────── */

/**
 * Get AI-powered color-theory recommendations.
 * @param {string} topColor  - e.g. "blue"
 * @param {string} category  - "bottom" | "dress"
 */
export const getAiRecommendations = (topColor, category = "bottom") =>
  aiClient
    .post("/recommend", { top_color: topColor, category })
    .then((r) => r.data);

export default { fetchAllClothes, fetchByCategory, saveOutfit, fetchSavedSuggestions, getAiRecommendations };
