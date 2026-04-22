/**
 * FittedGarment.jsx
 * ─────────────────
 * Renders an uploaded clothing image as a curved 3D garment mesh that
 * conforms to the mannequin's body shape — not a flat floating plane.
 *
 * ── File structure ─────────────────────────────────────────────────────────
 *  src/components/garment/
 *    FittedGarment.jsx      ← this file   (replace OutfitLayer.jsx usage)
 *    bodyMeasurements.js    ← measurements + getGarmentConfig()
 *    garmentUtils.js        ← buildGarmentGeometry() + removeBackground()
 *
 * ── How to connect ─────────────────────────────────────────────────────────
 *  In MannequinViewer.jsx, replace:
 *    import OutfitLayer from "./OutfitLayer";
 *    ...
 *    <OutfitLayer bodyType={bodyType} />
 *
 *  With:
 *    import { OutfitLayer } from "./garment/FittedGarment";
 *    ...
 *    <OutfitLayer bodyType={bodyType} />
 *
 *  Everything else in your app stays unchanged.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { buildGarmentGeometry, removeBackground } from "./garmentUtils";
import { getGarmentConfig }                       from "./bodyMeasurements";

// ─────────────────────────────────────────────────────────────────────────────
// FittedGarment — renders one clothing item as a curved mesh
// ─────────────────────────────────────────────────────────────────────────────

export default function FittedGarment({
  mannequinType = "medium",   // 'slim' | 'medium' | 'curvy'
  garmentType   = "dress",    // 'top'  | 'bottom' | 'dress'
  textureUrl,
}) {
  const meshRef = useRef();
  const matRef  = useRef();
  const [texture, setTexture] = useState(null);

  // ── Load + clean texture ────────────────────────────────────────────────
  useEffect(() => {
    if (!textureUrl) { setTexture(null); return; }

    let cancelled = false;
    setTexture(null);

    removeBackground(textureUrl).then((cleanUrl) => {
      if (cancelled) return;
      const loader = new THREE.TextureLoader();
      loader.load(cleanUrl, (tex) => {
        if (cancelled) return;
        tex.flipY       = true;
        tex.wrapS       = THREE.ClampToEdgeWrapping;
        tex.wrapT       = THREE.ClampToEdgeWrapping;
        tex.minFilter   = THREE.LinearMipmapLinearFilter;
        tex.magFilter   = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.needsUpdate = true;
        setTexture(tex);
      });
    });

    return () => { cancelled = true; };
  }, [textureUrl]);

  // ── Rebuild deformed geometry on body-type or category change ───────────
  const geometry = useMemo(() => {
    const config = getGarmentConfig(mannequinType, garmentType);
    return buildGarmentGeometry(config);
  }, [mannequinType, garmentType]);

  // ── Update material when texture arrives ────────────────────────────────
  useEffect(() => {
    if (matRef.current && texture) {
      matRef.current.map         = texture;
      matRef.current.needsUpdate = true;
    }
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh ref={meshRef} renderOrder={2} frustumCulled={false}>
      {/* Attach the pre-built deformed geometry */}
      <primitive object={geometry} attach="geometry" />

      {/*
       * meshStandardMaterial gives the cloth some lighting response
       * (subtle specular from the studio environment) for realism.
       * depthTest=false prevents z-fighting / holes with the mannequin mesh.
       */}
      <meshStandardMaterial
        ref={matRef}
        map={texture}
        transparent={true}
        alphaTest={0.02}
        depthTest={false}
        depthWrite={false}
        side={THREE.FrontSide}
        roughness={0.80}
        metalness={0.0}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OutfitLayer — drop-in replacement for the old OutfitLayer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reads from your existing OutfitContext — adjust the import path if needed.

import { useOutfit } from "../context/OutfitContext"; // ← adjust if your path differs

/**
 * Named export so you import as:
 *   import { OutfitLayer } from "./garment/FittedGarment";
 */
export function OutfitLayer({ bodyType }) {
  const { outfit } = useOutfit();

  return (
    <>
      {/* TOP ──────────────────────────────────────────────────────────── */}
      {outfit.top?.image_url && (
        <FittedGarment
          mannequinType={bodyType}
          garmentType="top"
          textureUrl={outfit.top.image_url}
        />
      )}

      {/* BOTTOM ───────────────────────────────────────────────────────── */}
      {outfit.bottom?.image_url && (
        <FittedGarment
          mannequinType={bodyType}
          garmentType="bottom"
          textureUrl={outfit.bottom.image_url}
        />
      )}

      {/* DRESS ────────────────────────────────────────────────────────── */}
      {outfit.dress?.image_url && (
        <FittedGarment
          mannequinType={bodyType}
          garmentType="dress"
          textureUrl={outfit.dress.image_url}
        />
      )}
    </>
  );
}