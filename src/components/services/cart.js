import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
const BASE_URL = `${API_BASE}/api/cart`;

/**
 * 🛠️ CONFIGURATION HELPER
 * This function handles adding the user's "Login Pass" (JWT Token) to every request.
 * It ensures the server knows who is asking for the data.
 */
const getAuthHeaders = () => {
    // We retrieve the secret token saved when the user logged in
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

/**
 * 🛒 GET ALL CART ITEMS
 * Asks the server for a list of items that belong ONLY to the logged-in user.
 */
export const fetchCartItems = async () => {
    // Notice we no longer need to pass userId as a parameter because the token identifies the user.
    const res = await axios.get(`${BASE_URL}/me`, getAuthHeaders());
    return res.data;
};

/**
 * ➕ ADD TO CART
 * Tells the server to add a specific plan to the current person's cart.
 */
export const addToCart = async (planId) => {
    const res = await axios.post(`${BASE_URL}`, {
        plan_id: planId
    }, getAuthHeaders());
    return res.data;
};

/**
 * ➖ REMOVE FROM CART
 * Tells the server to delete a specific item from the cart.
 */
export const removeFromCart = async (cartItemId) => {
    // We use the unique ID of the cart record to make sure we remove the right item.
    const res = await axios.delete(`${BASE_URL}/${cartItemId}`, getAuthHeaders());
    return res.data;
};

/**
 * 💳 BUY ITEM
 * Finalizes the purchase for an item in the cart.
 */
export const buyCartItem = async (cartItemId) => {
    const res = await axios.put(`${BASE_URL}/buy/${cartItemId}`, {}, getAuthHeaders());
    return res.data;
}; 