import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionSettings() {
  const navigate = useNavigate();
  const [planStatus, setPlanStatus] = useState({
    loading: true,
    active: false,
    daysLeft: 0,
    planName: "Free Plan",
  });
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
        
        const res = await fetch(`${API_BASE_URL}/api/me/plan-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setPlanStatus({
          loading: false,
          active: !!data?.active,
          daysLeft: data?.days_left || 0,
          planName: data?.plan_name || "Free Plan",
        });
      } catch (err) {
        console.error("Error fetching plan status:", err);
        setPlanStatus({ loading: false, active: false, daysLeft: 0, planName: "Free Plan" });
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        let user_id = localStorage.getItem("user_id");
        if (!user_id || user_id === "undefined" || user_id === "null") {
          const currentUserStr = localStorage.getItem("currentUser");
          if (currentUserStr) {
            try {
              const u = JSON.parse(currentUserStr);
              user_id = u.user_id || u.id;
            } catch (e) {}
          }
        }
        if (!user_id) {
          setPaymentsLoading(false);
          return;
        }

        const token = localStorage.getItem("accessToken");
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
        const res = await fetch(`${API_BASE_URL}/payments/${user_id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setPaymentsLoading(false);
      }
    };

    fetchPlanStatus();
    fetchPaymentHistory();
  }, []);

  if (planStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm">Loading your subscription data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-credit-card text-indigo-600"></i>
          Subscription & Plans
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your plan preferences, billing details, and view your transaction history.
        </p>
      </div>

      {/* Plan Details & Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                Current Plan
              </span>
              <h3 className="text-3xl font-black mt-1 tracking-tight text-slate-900">
                {planStatus.planName}
              </h3>
              
              <div className="mt-4 flex items-center gap-3">
                {planStatus.active ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Active Subscription
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-250 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    Expired / No Active Plan
                  </span>
                )}
                
                {planStatus.active && (
                  <span className="text-sm text-slate-500 font-medium">
                    {planStatus.daysLeft} day{planStatus.daysLeft !== 1 && "s"} remaining
                  </span>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate("/plans")}
                className="px-5 py-2.5 text-white hover:opacity-95 rounded-xl font-bold text-sm shadow-sm transition duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#002060" }}
              >
                {planStatus.active ? "Change Subscription" : "Upgrade Plan"}
              </button>
            </div>
          </div>
        </div>

        {/* Small Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[200px]">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Need Help?
            </span>
            <h4 className="font-bold text-slate-800 mt-1">Billing Support</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              If you have any questions about your charges, invoices, or need support with Stripe payment processing, our team is here.
            </p>
          </div>
          <button
            onClick={() => navigate("/contact")}
            className="mt-6 w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs tracking-wider uppercase transition duration-200"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Billing History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
            <i className="fa-solid fa-receipt text-slate-500"></i>
            Billing & Invoices
          </h3>
          <span className="text-xs text-slate-500">
            Powered securely by Stripe
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-200 text-xs tracking-wider uppercase bg-slate-50">
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Plan Details</th>
                <th className="px-6 py-3 font-semibold">Amount Paid</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentsLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span>Loading billing history...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-400 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {new Date(payment.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">{payment.plan_name}</td>
                    <td className="px-6 py-4 font-bold text-slate-950">
                      £{parseFloat(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "success"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            payment.status === "success" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          }`}
                        ></span>
                        {payment.status === "success" ? "Paid" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}