// src/components/Spotlight.jsx
import React from "react";

export default function Spotlight({ img }) {
  return (
    <section className="relative my-20 rounded-3xl overflow-hidden shadow-lg">
      <img
        src={img}
        alt="Spotlight"
        className="w-full h-96 object-cover transform transition-transform duration-700 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent flex items-end p-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Connect, Meet, and Explore
        </h2>
      </div>
    </section>
  );
}







