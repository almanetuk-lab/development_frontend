// src/components/comman/StatCard.jsx
import React from "react";
import { FiTrendingUp } from "react-icons/fi";

export default function StatCard({
  label,
  value,
  trend,
  icon: Icon,
  iconBg = "bg-indigo-50",
  iconColor = "text-[#002060]"
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-2xs shrink-0`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight group-hover:text-[#002060] transition-colors">
          {value}
        </p>
        {trend && (
          <p className="text-[11px] text-emerald-600 font-bold mt-1 inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
            <FiTrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </p>
        )}
      </div>
    </div>
  );
}