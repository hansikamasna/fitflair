// utils/colorUtils.js
// Frontend helpers for color swatches and display

/** Map color name → hex for UI swatches */
export const COLOR_HEX = {
  red:     "#e05252",
  blue:    "#4a7fc1",
  green:   "#5aaa6e",
  yellow:  "#e8c94a",
  orange:  "#e08a3c",
  purple:  "#8a5ce0",
  pink:    "#d966a8",
  white:   "#f5f5f5",
  black:   "#1a1a1a",
  grey:    "#888888",
  gray:    "#888888",
  beige:   "#d4c4a8",
  brown:   "#8b6347",
  navy:    "#1e3a5f",
  teal:    "#3aada8",
  maroon:  "#800020",
  cream:   "#f2ead8",
  lavender:"#b39ddb",
  olive:   "#6b7c3a",
  coral:   "#e8795a",
};

/** Return a hex value for a given color name (fallback to muted) */
export const getHex = (colorName) =>
  COLOR_HEX[colorName?.toLowerCase()] || "#6b6b7a";

/** Return a CSS border-based style string for color dot */
export const colorDotStyle = (colorName) => ({
  backgroundColor: getHex(colorName),
  width: 12,
  height: 12,
  borderRadius: "50%",
  display: "inline-block",
  flexShrink: 0,
});

/** Body type → Three.js scale */
export const BODY_SCALE = {
  slim:   [0.82, 1.0, 0.82],
  medium: [1.0,  1.0, 1.0],
  curvy:  [1.18, 0.98, 1.18],
};

/** Skin tone → Three.js material color hex */
export const SKIN_COLOR = {
  light:  "#f5d5b8",
  medium: "#c8956c",
  dark:   "#6b3c1e",
};
