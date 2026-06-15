// src/components/common/ActivityItem.jsx
import React from "react";

export default function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{text}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}