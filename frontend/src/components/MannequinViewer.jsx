import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { useOutfit } from "../context/OutfitContext";
import OutfitLayer from "./OutfitLayer";

function Loader() {
  return (
    <Html center>
      <div style={{ color: "#a78bfa", fontFamily: "monospace" }}>
        Loading Model...
      </div>
    </Html>
  );
}

function MannequinMesh({ bodyType, skinTone }) {
  const path = `/models/${bodyType}-${skinTone}.glb`;
  const { scene } = useGLTF(path);

  const fixedScene = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();

    box.getCenter(center);

    clone.position.x -= center.x;
    clone.position.y -= box.min.y;
    clone.position.y -= 0.75;
    clone.position.z -= center.z;

    return clone;
  }, [scene]);

  return (
    <primitive
      object={fixedScene}
      scale={[2.4, 2.4, 2.4]}
    />
  );
}

/* PREMIUM SHOWROOM */
function FashionRoom() {
  const texture = useTexture("/textures/check-wall.jpg");

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/* BACK WALL */}
      <mesh position={[0, 2.2, -4]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* FLOOR */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* LEFT WALL */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-7, 2.2, 0]}
      >
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>

      {/* RIGHT WALL */}
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[7, 2.2, 0]}
      >
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f5f1e8" />
      </mesh>
    </>
  );
}

export default function MannequinViewer() {
  const { bodyType, skinTone, equipClothing } = useOutfit();

  const handleDrop = (e) => {
    e.preventDefault();

    const itemJson = e.dataTransfer.getData("clothing-item");

    if (!itemJson) return;

    try {
      const item = JSON.parse(itemJson);
      equipClothing(item);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="w-full h-full rounded-3xl overflow-hidden bg-[#f7f2e8] border border-white/10"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Canvas camera={{ position: [0, 1.2, 7], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={<Loader />}>
          {/* LIGHTS */}
          <ambientLight intensity={1.4} />

          

          
          

          {/* ROOM */}
          <FashionRoom />

          {/* MODEL */}
          <MannequinMesh
            bodyType={bodyType}
            skinTone={skinTone}
          />

          <OutfitLayer />

          {/* SHADOW */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.35}
            scale={5}
            blur={2.5}
            far={5}
          />

          {/* CAMERA */}
          <OrbitControls
            enablePan={false}
            target={[0, 1.1, 0]}
            minDistance={5}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

[
  "slim-light",
  "slim-medium",
  "slim-dark",
  "medium-light",
  "medium-medium",
  "medium-dark",
  "curvy-light",
  "curvy-medium",
  "curvy-dark",
].forEach((name) => useGLTF.preload(`/models/${name}.glb`));