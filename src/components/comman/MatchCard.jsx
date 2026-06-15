// src/components/common/MatchCard.jsx
import React from "react";

export default function MatchCard({ user }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition group">
      <div className="relative">
        <img
          src={user.photo}
          alt={user.name}
          className="w-12 h-12 rounded-xl object-cover"
        />
        {user.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{user.name}</p>
        <p className="text-sm text-gray-600 truncate">{user.profession}</p>
        <p className="text-xs text-gray-500">{user.city} • {user.age} yrs</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition shadow-sm">
        💬
      </button>
    </div>
  );
}