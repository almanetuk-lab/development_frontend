// src/components/CTA.jsx
import React from "react";

export default function CTA() {
  return (
    <section className="bg-amber-50 py-20 rounded-3xl text-center shadow-inner">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to Join Intentional Connects?
      </h2>
      <p className="text-amber-800/90 mb-8">
        Start connecting today with like-minded people and explore new
        friendships!
      </p>
      <a
        href="/register"
        className="inline-block px-8 py-4 rounded-xl bg-amber-700 text-white font-semibold shadow-lg hover:scale-105 transform transition-all"
      >
        Join Free Today
      </a>
    </section>
  );
}
