import axios from "axios";

// Our backend address
const BASE_URL = "https://backend-q0wc.onrender.com/api";

/**
 * 🛠️ AUTHENTICATION HELPER
 * Ensures the security token (JWT) is attached to every private request.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

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
    // We send only plan_id; the server identifies the user by the token in the headers.
    const res = await axios.post(`${BASE_URL}/cart`, {
        plan_id: planId
    }, getAuthHeaders());
    return res.data;
};

/**
 * 💳 BUY PLAN
 * Marks a plan as purchased for the current user.
 */
export const buyPlan = async (planId) => {
    const res = await axios.put(`${BASE_URL}/cart/buy/${planId}`, {}, getAuthHeaders());
    return res.data;
};