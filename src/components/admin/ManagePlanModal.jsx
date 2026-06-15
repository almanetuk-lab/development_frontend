import React, { useState } from "react";
import axios from "axios";
import { updatePlanStatus } from "../services/adminPlans.js";

export default function ManagePlanModal({ plan, onClose, onUpdated }) {
  const [isActive, setIsActive] = useState(plan.is_active === 1);

  const handleToggle = async () => {
    try {
      let updatePlanStatusApiCall = async (planId) => {
        let res = await updatePlanStatus(planId);
        const newStatus = res.data.newStatus;
        setIsActive(newStatus === 1);
        onUpdated(); // refresh list
      };

      updatePlanStatusApiCall(plan.id);
    } catch (err) {
      console.error("Error toggling plan:", err);
      alert("Failed to update plan status");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[350px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4">Manage Plan</h3>
        <p className="mb-4 text-gray-700 font-medium">
          {plan.name} —{" "}
          <span
            className={
              isActive
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </p>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`px-5 py-2 rounded-lg font-semibold transition-all shadow ${
            isActive
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
}
