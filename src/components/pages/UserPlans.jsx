import React, { useEffect, useState } from "react";
import {
  fetchPlans,
  addToCart as addToCartAPI,
} from "../services/userPlans";
import { userAPI } from "../services/userApi";
import PlansList from "../userPlans/PlansList";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState({ active: false, days_left: 0, plan_name: "Free Plan" });
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * 📥 FETCH AVAILABLE PLANS & ACTIVE PLAN STATUS
     */
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);
        // Load plans
        const data = await fetchPlans();
        setPlans(data);

        // Load active plan status
        const statusRes = await userAPI.getPlanStatus();
        if (statusRes.data) {
          setActivePlan(statusRes.data);
        }
      } catch (err) {
        console.error("❌ Error fetching plans or active status:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSubscriptionData();
  }, []);

  /**
   * 🛒 ADD TO INDIVIDUAL CART
   */
  const addToCart = async (plan) => {
    try {
      const response = await addToCartAPI(plan.id);
      toast.success(`${plan.name} has been added to your cart!`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.info(err.response.data.message);
      } else {
        toast.error("Oops! We couldn't add that to your cart. Please ensure you are logged in.");
      }
    }
  };

  /**
   * 💳 INITIATE DIRECT BUY (STRIPE CHECKOUT)
   */
  const handleBuy = async (plan) => {
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

      if (!user_id || user_id === "undefined") {
        toast.error("User not logged in — cannot process payment.");
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ plan, user_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        toast.error("No checkout URL returned from server");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      toast.error("Payment could not be processed. Please try again.");
    }
  };

  return (
    <div className="relative overflow-hidden min-h-[90vh]">
      {/* 🔮 Aesthetic blur blobs in the background */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header section with back nav and active status panel */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-[#002060] font-bold text-xs uppercase tracking-widest transition-colors duration-200 group cursor-pointer"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-colors">
                <i className="fa-solid fa-arrow-left text-[10px]"></i>
              </span>
              <span>Back</span>
            </button>
            
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#FF2A6D] bg-pink-50/50 border border-pink-100">
                <i className="fa-solid fa-gem"></i> Pricing Packages
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                Subscription Plans
              </h1>
              <p className="text-slate-500 text-xs md:text-sm max-w-xl font-medium">
                Unlock full direct communication options, audio/video call hours, and matching systems tailored for meaningful connections.
              </p>
            </div>
          </div>

          {/* Current Active Plan Badge / Panel */}
          {!loading && (
            <div className="bg-white/80 backdrop-blur-md border border-slate-100/80 rounded-2xl p-5 shadow-sm min-w-[285px] flex items-center gap-4 transition-all duration-300 hover:shadow-md">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base shrink-0 ${
                activePlan?.active 
                  ? "bg-emerald-50 text-emerald-500 border border-emerald-100" 
                  : "bg-slate-50 text-slate-500 border border-slate-100"
              }`}>
                <i className={activePlan?.active ? "fa-solid fa-circle-check" : "fa-solid fa-shield-halved"}></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  Your Current Membership
                </div>
                <div className="font-black text-slate-800 text-sm mt-0.5 truncate">
                  {activePlan?.plan_name || "Free Plan"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  {activePlan?.active && activePlan?.days_left > 0 ? (
                    <span className="text-emerald-600 font-bold">
                      Expires in {activePlan.days_left} {activePlan.days_left === 1 ? "day" : "days"}
                    </span>
                  ) : (
                    <span className="text-slate-400">No active paid plan</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-28 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#002060]"></div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest animate-pulse">Retrieving Premium Tiers...</span>
          </div>
        ) : (
          <div className="py-2">
            <PlansList
              plans={plans}
              config={config}
              activePlan={activePlan}
              addToCart={addToCart}
              handleBuy={handleBuy}
            />
          </div>
        )}
      </div>
    </div>
  );
}
