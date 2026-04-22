import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useOutfit } from "../context/OutfitContext";

export default function OutfitLayer() {
  const { outfit, bodyType } = useOutfit();

  return (
    <>
      {/* TOP */}
      {outfit.top && (
        <ClothModel
          path="/models/clothes/knot-top.glb"
          category="top"
          bodyType={bodyType}
        />
      )}

      {/* BOTTOM */}
      {outfit.bottom && (
        <ClothModel
          path="/models/clothes/baggy-jeans.glb"
          category="bottom"
          bodyType={bodyType}
        />
      )}

      {/* DRESS */}
      {outfit.dress && (
        <ClothModel
          path="/models/clothes/dress.glb"
          category="dress"
          bodyType={bodyType}
        />
      )}
    </>
  );
}

function ClothModel({ path, category, bodyType }) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(), [scene]);

  const fits = {
    slim: {
      top: {
        pos: [0, 2.11, 0.03],
        scale: [0.94, 1.05, 0.82],
      },
      bottom: {
        pos: [0, -0.95, 0],
        scale: [1.0, 1.0, 1.0],
      },
      dress: {
        pos: [0, 2.11, 0.03],
        scale: [0.94, 1.05, 0.82],
      },
    },

    medium: {
      top: {
        pos: [0, 2.00, 0.01],
        scale: [0.90, 1.00, 0.78],
      },
      bottom: {
        pos: [0, -0.92, 0],
        scale: [1.08, 1.05, 1.05],
      },
      dress: {
        pos: [0, 2.00, 0.01],
        scale: [0.90, 1.00, 0.78],
      },
    },

    curvy: {
      top: {
        pos: [0, 1.91, 0.00],
        scale: [0.98, 1.01, 0.82],
      },
      bottom: {
        pos: [0, -0.88, 0],
        scale: [1.18, 1.12, 1.15],
      },
      dress: {
        pos: [0, 1.91, 0.00],
        scale: [0.98, 1.01, 0.82],
      },
    },
  };

  const fit = fits[bodyType]?.[category] || fits.medium[category];

  return (
    <primitive
      object={clone}
      position={fit.pos}
      scale={fit.scale}
    />
  );
}

useGLTF.preload("/models/clothes/knot-top.glb");
useGLTF.preload("/models/clothes/baggy-jeans.glb");
useGLTF.preload("/models/clothes/dress.glb");