import { useState } from "react";
import { useOutfit } from "../context/OutfitContext";

export default function UploadClothing() {
  const [loading, setLoading] = useState(false);
  const { equipClothing } = useOutfit();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const name = file.name.toLowerCase();

    setLoading(true);

    setTimeout(() => {
      // DEMO TOP
      if (
        name.includes("download") ||
        name.includes("top") ||
        name.includes("87")
      ) {
        equipClothing({
          _id: Date.now(),
          name: "Demo Top",
          category: "top",
          image_url: "/tops/black-top.png",
        });
      }

      // DEMO DRESS
      else if (
        name.includes("dress") ||
        name.includes("gown") ||
        name.includes("futuristic")
      ) {
        equipClothing({
          _id: Date.now(),
          name: "Demo Dress",
          category: "dress",
          image_url: "/dresses/dress.png",
        });
      }

      // DEMO JEANS
      else if (
        name.includes("jeans") ||
        name.includes("wdj") ||
        name.includes("deal")
      ) {
        equipClothing({
          _id: Date.now(),
          name: "Demo Bottom",
          category: "bottom",
          image_url: "/bottoms/beige-jeans.png",
        });
      }

      else {
        alert("Demo supports selected showcase files only.");
      }

      setLoading(false);
      e.target.value = "";
    }, 1200);
  };

  return (
    <div className="px-3 py-3 border-b border-white/10">
      <label className="cursor-pointer w-full block text-center bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-3 rounded-2xl">
        {loading ? "Processing..." : "Upload Clothing"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </label>
    </div>
  );
}