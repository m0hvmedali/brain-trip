import React from "react";

export default function SidePanel({ data, selected, onClose }) {
  if (!selected) return null;

  const type = selected.type;
  const content = data[type] || [];

  return (
    <div className="absolute right-4 top-4 w-80 max-w-[90vw]">
      <div className="bg-black/80 p-4 rounded-lg border border-gray-600 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">{type}</h3>
          <button onClick={onClose} className="text-sm text-gray-400">إغلاق</button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-auto">
          {content.map((item) => (
            <div key={item.id} className="p-2 bg-gray-900/60 rounded-md border border-gray-700">
              <div className="font-medium">{item.title || item.id}</div>
              <div className="text-sm text-gray-300 mt-1">
                {item.type === "image" ? (
                  <img src={item.content} alt={item.title} className="w-full rounded mt-2" />
                ) : (
                  <div>{item.content || item.desc || JSON.stringify(item)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
