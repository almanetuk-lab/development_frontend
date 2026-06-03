// src/components/settings/SubscriptionSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionSettings({ userData }) {
  const navigate = useNavigate();
  const [planStatus, setPlanStatus] = useState({
    loading: true,
    active: false,
    daysLeft: 0,
  });

  // PLAN STATUS FETCH USEEFFECT - Aapke wala exact code
  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";
        
        const res = await fetch(`${API_BASE_URL}/api/me/plan-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setPlanStatus({
          loading: false,
          active: !!data?.active,
          daysLeft: data?.days_left || 0,
        });
      } catch {
        setPlanStatus({ loading: false, active: false, daysLeft: 0 });
      }
    };

    fetchPlanStatus();
  }, []);

  if (planStatus.loading) {
    return <div className="text-center py-8">Loading subscription data...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Subscription & Plans
      </h2>

      {/* Current Plan - Aapke banner jaisa style */}
      <div className="mb-6">
        <div
          className={`p-4 text-center rounded-lg border ${
            planStatus.active
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {planStatus.active ? (
            <p className="text-lg">
              ✅ <strong>Plan Active</strong> — {planStatus.daysLeft} day
              {planStatus.daysLeft !== 1 && "s"} remaining
            </p>
          ) : (
            <p className="text-lg">
              ❌ <strong>Plan Expired</strong> — Upgrade to continue
            </p>
          )}
        </div>
      </div>

      {/* Plan Details Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
        <h3 className="text-lg font-medium mb-2">Current Plan</h3>
        <p className="text-3xl font-bold mb-2">
          {planStatus.active ? "Premium Plan" : "Free Plan"}
        </p>
        {planStatus.active && (
          <p className="opacity-90">{planStatus.daysLeft} days remaining</p>
        )}
        <button
          onClick={() => navigate("/dashboard/plans")}
          className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100"
        >
          {planStatus.active ? "Manage Plan" : "Upgrade Plan"}
        </button>
      </div>

      {/* Billing History */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium text-gray-800">Billing History</h3>
        </div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">Date</th>
                <th className="pb-2">Plan</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Mar 1, 2024</td>
                <td className="py-2">Premium</td>
                <td className="py-2">$19.99</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}