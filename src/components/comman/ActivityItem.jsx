// src/components/comman/ActivityItem.jsx
import React from "react";
import { FiActivity } from "react-icons/fi";

export default function ActivityItem({
  icon: Icon,
  iconBg = "bg-indigo-50",
  iconColor = "text-indigo-600",
  text,
  time
}) {
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50/50 hover:bg-slate-100/60 border border-slate-100 hover:border-slate-200/80 transition-all duration-200 cursor-pointer group">
      {Icon ? (
        <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      ) : (
        <div className="w-10 h-10 bg-indigo-50 text-[#002060] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
          <FiActivity className="w-4.5 h-4.5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-slate-800 font-semibold text-sm leading-snug group-hover:text-[#002060] transition-colors">{text}</p>
        <span className="inline-block text-[11px] text-slate-400 font-medium mt-0.5">{time}</span>
      </div>
    </div>
  );
}