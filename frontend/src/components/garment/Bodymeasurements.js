/**
 * bodyMeasurements.js
 *
 * Scene-unit measurements derived from actual GLB bounding box analysis.
 * MannequinViewer uses: scale=[2.3, 2.3, 2.3], position y=-2.2
 *
 *   slim:   total height 4.076, width 2.019, front depth ~0.32
 *   medium: total height 3.871, width 1.987, front depth ~0.31
 *   curvy:  total height 3.811, width 2.063, front depth ~0.34
 *
 * Landmark ratios (% of total height from feet):
 *   ankles 4% | knee 26% | hips 42% | waist 57%
 *   underbust 65% | chest/bust 72% | shoulder 83% | neck 88%
 */

function makeMeasurements(feet, totalH, bodyW, depthZ) {
  const y = (ratio) => feet + totalH * ratio;
  return {
    // Y positions
    feetY:      feet,
    ankleY:     y(0.04),
    kneeY:      y(0.26),
    hipY:       y(0.42),
    waistY:     y(0.57),
    underBustY: y(0.65),
    chestY:     y(0.72),
    shoulderY:  y(0.83),
    neckY:      y(0.88),
    headY:      feet + totalH,

    // Half-widths at each zone
    ankleHW:    bodyW * 0.09,
    kneeHW:     bodyW * 0.13,
    hipHW:      bodyW * 0.48,
    waistHW:    bodyW * 0.30,
    chestHW:    bodyW * 0.44,
    shoulderHW: bodyW * 0.46,
    neckHW:     bodyW * 0.12,

    // Depth offsets (how far forward each zone protrudes)
    chestDepth: depthZ * 1.00,
    waistDepth: depthZ * 0.60,
    hipDepth:   depthZ * 0.82,
    legDepth:   depthZ * 0.50,

    totalHeight: totalH,
    bodyWidth:   bodyW,
  };
}

export const bodyMeasurements = {
  slim:   makeMeasurements(-2.2, 4.076, 2.019, 0.32),
  medium: makeMeasurements(-2.2, 3.871, 1.987, 0.31),
  curvy:  makeMeasurements(-2.2, 3.811, 2.063, 0.34),
};

/**
 * Returns the full garment config object for a given body type + category.
 * The config drives:
 *   - topY / bottomY  → where the garment starts and ends in scene space
 *   - widthProfile    → how wide the garment is at each vertical position
 *   - depthProfile    → how far forward it protrudes at each position
 *   - segX / segY     → mesh subdivision (more = smoother curves)
 */
export function getGarmentConfig(bodyType, category) {
  const m = bodyMeasurements[bodyType] || bodyMeasurements.medium;

  if (category === "top") {
    return {
      topY:    m.shoulderY,
      bottomY: m.waistY - 0.05,
      height:  m.shoulderY - (m.waistY - 0.05),
      segX: 12,
      segY: 20,
      widthProfile: [
        { t: 0.00, hw: m.waistHW    * 1.05 },
        { t: 0.28, hw: m.chestHW    * 1.04 },
        { t: 0.58, hw: m.chestHW    * 1.06 },
        { t: 0.82, hw: m.shoulderHW * 1.04 },
        { t: 1.00, hw: m.neckHW     * 1.80 },
      ],
      depthProfile: [
        { t: 0.00, d: m.waistDepth  },
        { t: 0.30, d: m.chestDepth  },
        { t: 0.62, d: m.chestDepth  },
        { t: 1.00, d: m.waistDepth  },
      ],
    };
  }

  if (category === "bottom") {
    return {
      topY:    m.waistY + 0.04,
      bottomY: m.ankleY,
      height:  (m.waistY + 0.04) - m.ankleY,
      segX: 12,
      segY: 28,
      widthProfile: [
        { t: 0.00, hw: m.ankleHW * 1.10 },
        { t: 0.22, hw: m.kneeHW  * 1.14 },
        { t: 0.52, hw: m.hipHW   * 1.06 },
        { t: 0.76, hw: m.hipHW   * 1.05 },
        { t: 1.00, hw: m.waistHW * 1.04 },
      ],
      depthProfile: [
        { t: 0.00, d: m.legDepth   },
        { t: 0.22, d: m.legDepth   },
        { t: 0.52, d: m.hipDepth   },
        { t: 1.00, d: m.waistDepth },
      ],
    };
  }

  // dress (default)
  return {
    topY:    m.shoulderY,
    bottomY: m.ankleY,
    height:  m.shoulderY - m.ankleY,
    segX: 14,
    segY: 36,
    widthProfile: [
      { t: 0.00, hw: m.ankleHW    * 1.10 },
      { t: 0.16, hw: m.kneeHW     * 1.14 },
      { t: 0.38, hw: m.hipHW      * 1.06 },
      { t: 0.52, hw: m.waistHW    * 1.05 },
      { t: 0.64, hw: m.chestHW    * 1.05 },
      { t: 0.76, hw: m.chestHW    * 1.07 },
      { t: 0.90, hw: m.shoulderHW * 1.04 },
      { t: 1.00, hw: m.neckHW     * 1.75 },
    ],
    depthProfile: [
      { t: 0.00, d: m.legDepth   },
      { t: 0.16, d: m.legDepth   },
      { t: 0.38, d: m.hipDepth   },
      { t: 0.52, d: m.waistDepth },
      { t: 0.64, d: m.chestDepth },
      { t: 0.80, d: m.chestDepth },
      { t: 1.00, d: m.waistDepth },
    ],
  };
}