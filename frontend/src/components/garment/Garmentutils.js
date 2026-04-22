/**
 * garmentUtils.js
 *
 * Core mesh-deformation engine.
 *
 * How it works:
 *  1. Create a subdivided PlaneGeometry (segX × segY quads).
 *  2. Loop every vertex. Each vertex has a normalised position:
 *       tY  = 0 (bottom of garment) → 1 (top of garment)
 *       uX  = -1 (left edge)        → +1 (right edge)
 *  3. Using the garment config's widthProfile and depthProfile,
 *     sample the half-width and forward-depth at that tY.
 *  4. Set:
 *       x = uX  * halfWidth          ← horizontal spread matching body contour
 *       y = bottomY + tY * height    ← exact scene-space Y (shoulder → ankle)
 *       z = depthFwd * cos(uX·π/2)  ← cosine bulge: max at centre, zero at edges
 *
 * The result is a curved cloth shell that hugs the mannequin silhouette.
 */

import * as THREE from "three";

// ─── Profile sampling ─────────────────────────────────────────────────────────

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Sample a piecewise-linear profile at t ∈ [0, 1].
 * profile: [{ t, hw }] or [{ t, d }]
 */
export function sampleProfile(profile, t, key) {
  if (t <= profile[0].t)              return profile[0][key];
  if (t >= profile[profile.length - 1].t) return profile[profile.length - 1][key];

  for (let i = 0; i < profile.length - 1; i++) {
    const a = profile[i];
    const b = profile[i + 1];
    if (t >= a.t && t <= b.t) {
      const frac = (t - a.t) / (b.t - a.t);
      return lerp(a[key], b[key], frac);
    }
  }
  return profile[profile.length - 1][key];
}

// ─── Geometry builder ─────────────────────────────────────────────────────────

/**
 * Build a deformed BufferGeometry shaped to the garment contour.
 *
 * @param {object} config  result of getGarmentConfig()
 * @returns {THREE.BufferGeometry}
 */
export function buildGarmentGeometry(config) {
  const {
    topY, bottomY, height, segX, segY,
    widthProfile, depthProfile,
  } = config;

  // Use the max width in the profile as the base plane width
  const maxHW = Math.max(...widthProfile.map((p) => p.hw));
  const planeW = maxHW * 2;

  const geo = new THREE.PlaneGeometry(planeW, height, segX, segY);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const rawX = pos.getX(i);
    const rawY = pos.getY(i);

    // Normalized vertical position: 0 = bottom (ankle/waist), 1 = top (shoulder)
    const tY = (rawY + height / 2) / height;

    // Normalized horizontal position: -1 = left edge, +1 = right edge
    const uX = rawX / (planeW / 2);

    // Sample profiles
    const halfWidth = sampleProfile(widthProfile, tY, "hw");
    const depthFwd  = sampleProfile(depthProfile, tY, "d");

    // ── Deform ──────────────────────────────────────────────────
    // X: scale to body width at this height
    const newX = uX * halfWidth;

    // Y: map to scene-space Y
    const newY = bottomY + tY * height;

    // Z: cosine bulge — centre protrudes, edges lie flat
    // cos(uX · π/2) = 1 at uX=0, = 0 at uX=±1
    const bulgeFactor = Math.cos((uX * Math.PI) / 2);
    const newZ = depthFwd * bulgeFactor;

    pos.setXYZ(i, newX, newY, newZ);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  return geo;
}

// ─── Background removal ───────────────────────────────────────────────────────

/**
 * Remove white / near-white / light-grey backgrounds from a clothing image.
 * Works by sampling every pixel and making light, low-saturation pixels transparent.
 *
 * @param   {string}  imageUrl
 * @returns {Promise<string>}  object URL of a processed PNG
 */
export function removeBackground(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = img.height;

      const ctx  = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const brightness  = (r + g + b) / 3;
        const saturation  = Math.max(r, g, b) - Math.min(r, g, b);

        // White / near-white
        if (r > 215 && g > 215 && b > 215) {
          d[i + 3] = 0;
          continue;
        }
        // Light grey (unsaturated)
        if (brightness > 200 && saturation < 20) {
          d[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(
        (blob) => resolve(URL.createObjectURL(blob)),
        "image/png"
      );
    };

    img.onerror = () => resolve(imageUrl); // graceful fallback
    img.src = imageUrl;
  });
}