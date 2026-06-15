// src/components/common/QuickAction.jsx
import React from "react";

export default function QuickAction({ icon, label }) {
  return (
    <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition">
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}