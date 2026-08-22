import React, { useState } from "react";
import axios from "axios";
import { updatePlanStatus } from "../services/adminPlans.js";

export default function ManagePlanModal({ plan, onClose, onUpdated }) {
  const [isActive, setIsActive] = useState(plan.is_active === 1);

  const handleToggle = async () => {
    try {
      let updatePlanStatusApiCall = async (planId) => {
        let res = await updatePlanStatus(planId);
        const newStatus = res.data.is_active;
        setIsActive(newStatus === 1);
        onUpdated(); // refresh list
      };

      await updatePlanStatusApiCall(plan.id);
    } catch (err) {
      console.error("Error toggling plan:", err);
      alert("Failed to update plan status");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999]">
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-2xl p-7 w-[350px] text-center relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm transition"
        >
          ✕
        </button>

        <h3 className="text-base font-black text-slate-800 tracking-tight mb-5">Manage Plan Status</h3>
        
        <div className="mb-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{plan.name}</span>
          <span
            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xs ${
            isActive
              ? "bg-[#FF2A6D] hover:bg-[#e0105a] text-white"
              : "bg-[#002060] hover:bg-[#001740] text-white"
          }`}
        >
          {isActive ? "Deactivate Plan" : "Activate Plan"}
        </button>
      </div>
    </div>
  );
}
