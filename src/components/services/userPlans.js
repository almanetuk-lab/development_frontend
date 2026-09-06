import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
const BASE_URL = `${API_BASE}/api`;

// Axios instance with cookie-based auth — no manual headers needed
const plansApi = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Send httpOnly cookies with every request
});

/**
 * 📋 FETCH ALL PLANS
 * Loads all available subscription options from the database.
 * This is a public request (no token needed).
 */
export const fetchPlans = async () => {
    const res = await axios.get(`${BASE_URL}/plans`);
    return res.data;
};

/**
 * 🛒 ADD TO CART
 * Securely adds a plan to the logged-in user's database record.
 */
export const addToCart = async (planId) => {
    const res = await plansApi.post(`/api/cart`, {
        plan_id: planId
    });
    return res.data;
};

/**
 * 💳 BUY PLAN
 * Marks a plan as purchased for the current user.
 */
export const buyPlan = async (planId) => {
    const res = await plansApi.put(`/api/cart/buy/${planId}`, {});
    return res.data;
};