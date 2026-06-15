// src/components/common/StatCard.jsx
import React from "react";

export default function StatCard({ label, value, trend }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-md transition cursor-pointer">
      <p className="text-3xl font-bold text-indigo-600 mb-1">{value}</p>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      {trend && (
        <p className="text-xs text-green-500 font-medium">{trend}</p>
      )}
    </div>
  );
}