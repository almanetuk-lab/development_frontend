import React, { useEffect, useState } from "react";
import CartItem from "./CartItem";
import PaymentHistory from "./PaymentHistory";
import { useLocation } from "react-router-dom";

/* ------------------------------------------------------------------
   OLD CODE REMOVED:
   export default function CartList({ cartItems, handleRemove, handleBuy }) {
     return (
       <div className="grid ...">
         <CartItem handleBuy={handleBuy} />
       </div>
     );
   }
   WHY REMOVED?
   Because handleBuy no longer comes from parent. It is now handled
   *inside CartItem.jsx*, so CartList should NOT accept handleBuy.
-------------------------------------------------------------------*/

export default function CartList({ cartItems, handleRemove }) {

  /* -------------------------------------------------------------
    
      New states & URL logic added for:
      ✔ Reading Stripe success/cancel URLs
      ✔ Showing temporary payment message
      ✔ Opening payment history popup
  --------------------------------------------------------------*/
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("success") === "true") {
      setPaymentStatus("success");
    } 
    else if (params.get("cancel") === "true") {
      setPaymentStatus("failed");
    }
  }, [location]);
  

  return (
    <div className="relative p-4">

      {/* -------------------------------------------------------------
       
          Payment History Button added
          Reason: User can view past payment transactions
      --------------------------------------------------------------*/}
      <button
        onClick={() => setShowHistory(true)}
        className="absolute d-flex justify-start z-30 right-0 top-0 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Payment History
      </button>
   

      {/* Cart Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mb-8">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            handleRemove={handleRemove}
            // OLD: handleBuy={handleBuy}
            // NEW: handleBuy removed (handled inside CartItem now)
          />
        ))}
      </div>

      {/* -------------------------------------------------------------
    
          Payment History Popup Modal
      --------------------------------------------------------------*/}
      {showHistory && (
        <PaymentHistory onClose={() => setShowHistory(false)} />
      )}
    
    </div>
  );
}


