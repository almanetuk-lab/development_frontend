import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
const BASE_URL = `${API_BASE}/api/cart`;

// Axios instance with cookie-based auth — no manual headers needed
const cartApi = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Send httpOnly cookies with every request
});

/**
 * 🛒 GET ALL CART ITEMS
 * Asks the server for a list of items that belong ONLY to the logged-in user.
 */
export const fetchCartItems = async () => {
    const res = await cartApi.get(`/api/cart/me`);
    return res.data;
};

/**
 * ➕ ADD TO CART
 * Tells the server to add a specific plan to the current person's cart.
 */
export const addToCart = async (planId) => {
    const res = await cartApi.post(`/api/cart`, {
        plan_id: planId
    });
    return res.data;
};

/**
 * ➖ REMOVE FROM CART
 * Tells the server to delete a specific item from the cart.
 */
export const removeFromCart = async (cartItemId) => {
    const res = await cartApi.delete(`/api/cart/${cartItemId}`);
    return res.data;
};

/**
 * 💳 BUY ITEM
 * Finalizes the purchase for an item in the cart.
 */
export const buyCartItem = async (cartItemId) => {
    const res = await cartApi.put(`/api/cart/buy/${cartItemId}`, {});
    return res.data;
}; 