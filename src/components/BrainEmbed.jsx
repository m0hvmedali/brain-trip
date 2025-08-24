import React from "react";

const HOTSPOTS = [
  { id: "ذكريات", top: "40%", left: "55%", label: "ذكريات" },
  { id: "مشاعر", top: "48%", left: "42%", label: "مشاعر" },
  { id: "وظائف", top: "25%", left: "50%", label: "وظائف" }
];

export default function BrainEmbed({ onSelect }) {
  return (
    <div className="w-full h-full relative">
      {/* iframe لعرض الموديل */}
      <iframe
        title="Central Brain of Mankind (CML)"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        className="w-full h-full"
        src="https://sketchfab.com/models/19552f5415644847a0b484b35e370c90/embed"
      ></iframe>

      {/* نقاط التفاعل */}
      {HOTSPOTS.map((spot) => (
        <button
          key={spot.id}
          onClick={() => onSelect({ type: spot.id })}
          className="absolute bg-purple-600/80 hover:bg-purple-400 text-white text-xs px-2 py-1 rounded-full shadow-lg transition-transform transform hover:scale-110"
          style={{ top: spot.top, left: spot.left }}
        >
          {spot.label}
        </button>
      ))}
    </div>
  );
}
