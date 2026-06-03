import React, { useEffect, useState } from "react";
import {
  fetchPlans,
  addToCart as addToCartAPI,
} from "../services/userPlans";
import PlansList from "../userPlans/PlansList";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🎨 Themes for the different membership levels
  const planThemes = {
    // These colors make the plans look distinct and premium
  };

  useEffect(() => {
    /**
     * 📥 FETCH AVAILABLE PLANS
     * Loads the list of subscription options from our database.
     */
    const loadPlans = async () => {
      try {
        setLoading(true);
        let data = await fetchPlans();
        setPlans(data);
      } catch (err) {
        console.error("❌ Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  /**
   * 🛒 ADD TO INDIVIDUAL CART
   * This is the function triggered when a user clicks "Add to Cart".
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

  const handleBuy = async (plan) => {
    console.log("Direct purchase initiated for:", plan);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 min-h-[70vh]">
      {/* 🔙 Stylish Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-3 text-gray-500 hover:text-blue-600 font-semibold transition-all duration-300 group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <span className="text-sm tracking-wide uppercase">Back</span>
      </button>

      <div className="text-center mb-12">
        <h2 className="text-center font-bold text-3xl mb-8">
        ✨ Subscription Plans ✨
      </h2>
     </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <PlansList
          plans={plans}
          config={config}
          planThemes={planThemes}
          addToCart={addToCart}
          handleBuy={handleBuy}
        />
      )}
    </div>
  );
}
