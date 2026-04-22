"""
color_recommender.py
────────────────────
Color Theory-based outfit recommendation engine.

Three recommendation strategies:
  1. Complementary  — opposite on the color wheel (high contrast)
  2. Analogous      — adjacent on the color wheel (harmonious)
  3. Neutral        — universally safe pairs (black, white, grey, beige)

References:
  - https://www.colormatters.com/color-and-design/basic-color-theory
"""

# ── Color wheel positions (hue groups) ──────────────────────────────────────
# Each color is assigned a "family" for wheel-based logic

COLOR_WHEEL = {
    "red":      0,
    "coral":    20,
    "orange":   30,
    "yellow":   60,
    "green":    120,
    "teal":     165,
    "blue":     210,
    "navy":     230,
    "purple":   270,
    "lavender": 280,
    "pink":     330,
}

NEUTRALS = ["white", "black", "grey", "beige"]

# ── Hand-crafted complementary map ──────────────────────────────────────────
# Based on traditional color theory (complementary = ~180° apart)

COMPLEMENTARY_MAP = {
    "red":      ["green", "teal"],
    "coral":    ["teal", "green"],
    "orange":   ["blue", "navy"],
    "yellow":   ["purple", "lavender"],
    "green":    ["red", "pink", "coral"],
    "teal":     ["coral", "red", "orange"],
    "blue":     ["orange", "coral"],
    "navy":     ["orange", "beige", "coral"],
    "purple":   ["yellow", "green"],
    "lavender": ["yellow", "green"],
    "pink":     ["green", "teal"],
    "white":    ["black", "navy", "red", "blue"],
    "black":    ["white", "yellow", "red"],
    "grey":     ["red", "blue", "purple"],
    "beige":    ["navy", "teal", "brown"],
}

# ── Analogous map ────────────────────────────────────────────────────────────
# Colors that sit beside each other → harmonious, blended looks

ANALOGOUS_MAP = {
    "red":      ["coral", "orange", "pink"],
    "coral":    ["red", "orange", "pink"],
    "orange":   ["yellow", "coral", "red"],
    "yellow":   ["orange", "green"],
    "green":    ["teal", "yellow"],
    "teal":     ["green", "blue"],
    "blue":     ["teal", "navy", "purple"],
    "navy":     ["blue", "purple"],
    "purple":   ["navy", "lavender", "pink"],
    "lavender": ["purple", "pink"],
    "pink":     ["lavender", "coral", "red"],
    "white":    ["beige", "grey"],
    "black":    ["grey", "navy"],
    "grey":     ["white", "black", "navy"],
    "beige":    ["white", "grey"],
}


def get_complementary(color: str) -> list[str]:
    """Return complementary colors for the given color."""
    return COMPLEMENTARY_MAP.get(color.lower(), [])


def get_analogous(color: str) -> list[str]:
    """Return analogous colors for the given color."""
    return ANALOGOUS_MAP.get(color.lower(), [])


def get_neutrals() -> list[str]:
    """Neutral colors pair well with everything."""
    return NEUTRALS.copy()


def recommend_bottoms(top_color: str) -> dict:
    """
    Main recommendation function.
    Returns a structured dict of suggested bottom colors grouped by strategy.

    Args:
        top_color: The color name of the selected top (e.g. "blue")

    Returns:
        {
            "suggested_bottoms": ["white", "grey", ...],  # merged & deduplicated
            "complementary": [...],
            "analogous": [...],
            "neutral": [...]
        }
    """
    color = top_color.lower().strip()

    complementary = get_complementary(color)
    analogous     = get_analogous(color)
    neutral       = get_neutrals()

    # Merge all suggestions, deduplicate, preserve order
    seen = set()
    merged = []
    for c in complementary + analogous + neutral:
        if c not in seen and c != color:
            seen.add(c)
            merged.append(c)

    return {
        "top_color":        color,
        "suggested_bottoms": merged[:8],   # return top 8 suggestions
        "complementary":    complementary,
        "analogous":        analogous,
        "neutral":          neutral,
    }


# ── Quick test ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import json
    for test_color in ["blue", "red", "yellow", "black", "coral"]:
        result = recommend_bottoms(test_color)
        print(f"\n{test_color.upper()} top →")
        print(f"  Suggested: {result['suggested_bottoms']}")
