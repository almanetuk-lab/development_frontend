import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCartItems, removeFromCart } from "../services/cart.js";
import CartList from "../cart/CartList.jsx";
import { toast } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This runs as soon as the page opens
  useEffect(() => {
    loadCart();
  }, []);

  /**
   * 🔄 LOAD CART DATA
   * This function pulls the latest data directly from the database server.
   * By fetching from the server, we ensure that every user sees ONLY their own products.
   */
  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCartItems();
      setCartItems(data);

      // Update the local storage count so the Header shows the correct number
      localStorage.setItem("cart_count", data.length);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      // If the user isn't logged in, the server will error and we send them to login
      if (err.response?.status === 404 || err.response?.status === 500) {
        // This might happen if the token is missing or invalid
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🗑️ REMOVE ITEM
   * This handles the removal of a single item when the user clicks "Delete".
   */
  const handleRemove = async (cartItemId) => {
    try {
      // 1. Tell the server to delete the item from the database
      // This is the source of truth—it prevents "ghost items" or multiple deletions.
      await removeFromCart(cartItemId);

      // 2. Refresh the UI by removing it from our local state
      const updatedList = cartItems.filter((item) => item.id !== cartItemId);
      setCartItems(updatedList);

      // 3. Keep the shared counter in sync
      localStorage.setItem("cart_count", updatedList.length);
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("Successfully removed from your cart.");
    } catch (err) {
      console.error("❌ Error removing item:", err);
      toast.error("Could not remove the item. Please try again.");
    }
  };

  /**
   * 🎁 BUY ACTION
   * Simple placeholder for the checkout flow.
   */
  const handleBuy = async (item) => {
    console.log("Preparing to purchase plan:", item);
    // Real logic is handled inside individual CartItems now (refer to CartItem.jsx)
  };

  return (
    <div className="max-w-5xl mx-auto my-12 px-4 min-h-[50vh]">
      <h2 className="text-center font-bold text-3xl mb-8 flex items-center justify-center gap-2">
        <i className="fa-solid fa-cart-shopping text-blue-600"></i>
        My Individual Cart
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center mt-20 p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <h5 className="text-gray-500 text-xl font-medium">Your cart is empty currently. 🛒</h5>
          <button
            onClick={() => navigate("/plans")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Plans
          </button>
        </div>
      ) : (
        <CartList
          cartItems={cartItems}
          handleRemove={handleRemove}
          handleBuy={handleBuy}
        />
      )}
    </div>
  );
}
