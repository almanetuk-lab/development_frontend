// src/components/FeatureCard.jsx
import React from "react";

export default function FeatureCard({ title, desc, icon, img }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all">
      <div className="overflow-hidden h-48">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="text-xl font-semibold text-amber-900 mb-2">{title}</h3>
        <p className="text-amber-800/90">{desc}</p>
      </div>
    </div>
  );
}
