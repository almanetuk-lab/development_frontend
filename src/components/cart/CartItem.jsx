import React from "react";

/* -------------------------------------------------------------
   BUY BUTTON LOGIC
--------------------------------------------------------------*/

export default function CartItem({ item, handleRemove /* OLD: , handleBuy */ }) {

  /* -------------------------------------------------------------
   
      handleBuy moved inside component
      Reason: Parent was not sending handleBuy. Payment requires
      access to user_id stored in localStorage.
  --------------------------------------------------------------*/
  const handleBuy = async (item) => {
    try {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        alert("User not logged in — cannot process payment.");
        return;
      }

      console.log("Testing payment with user_id:", user_id, "plan:", item.plan);

      const response = await fetch(
        "https://backend-q0wc.onrender.com/payments/create-checkout-session",
      
      // const response = await fetch(
      //   `${VITE_API_BASE_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: item.plan, user_id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment could not be processed. Please try again.");
    }
  };
  

  /* -------------------------------------------------------------
     DYNAMIC THEME COLOR (unchanged)
  --------------------------------------------------------------*/
  const theme =
    item.name === "pro"
      ? "bg-gradient-to-br from-gray-900 via-purple-900 to-amber-900 text-white border-yellow-400"
      : item.name === "advance"
      ? "bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-400 text-gray-800"
      : item.name === "basic"
      ? "bg-gradient-to-br from-sky-100 to-sky-200 border-sky-400 text-gray-800"
      : "bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-800";

  return (
    <div className="w-full sm:w-[340px]">
      <div
        className={`border-2 rounded-xl p-5 m-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${theme}`}
      >
        {/* Header */}
        <h4 className="uppercase font-bold mb-4">{item.plan.name}</h4>

        {/* Details */}
        
 <ul className="text-start text-sm space-y-2 mb-5">
          <li className="flex items-center gap-2">
            Price:  £{item.plan.price}
          </li>
          {item.plan.description &&
            <>
              <li className="flex items-center gap-2">
               Description : {item.plan.description}
              </li>
            </>
          }

          {item.plan.duration &&
            <>
              <li className="flex items-center gap-2">
                 Duration : {item.plan.duration} Days
              </li>
            </>
          }

          {item.plan.video_call_limit > 0 &&
            <>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-video text-blue-500"></i>
                Video Call Limit: {item.plan.video_call_limit}
              </li>
            </>
          }
          {item.plan.audio_call_limit > 0 &&
            <>
              <li className="flex items-center gap-2">
               <i className="fa-solid fa-headphones text-blue-500"></i>
               Audio Call Limit: {item.plan.audio_call_limit}
              </li>
            </>
          }
          {item.plan.people_search_limit > 0 &&
            <>
              <li className="flex items-center gap-2">
           <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
           People Search Limit: {item.plan.people_search_limit}
              </li>
            </>
          }
          {item.plan.people_message_limit > 0 &&
            <>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-message text-blue-500"></i>
                Message Limit: {item.plan.people_message_limit}
              </li>
            </>
          }
         {item.plan.billing_info &&
            <>
              <li className="flex items-center gap-2">
                 Billing Info: {item.plan.billing_info}
              </li>
            </>
          }
        </ul>



        {/* Buttons */}
        <div className="flex gap-3">
          
          {/* Remove Button (unchanged) */}
          <button
            onClick={() => handleRemove(item.id)}
            className="flex-1 border border-red-500 text-red-500 rounded-lg py-2 font-semibold hover:bg-red-500 hover:text-white transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <i className="fa-solid fa-trash mr-2"></i> Remove
          </button>

          {/* Buy Button */}
          {/* OLD: handleBuy came from parent */}
          
          {/* -------------------------------------------------------------
             
              Buy button now uses internal handleBuy
              Reason: payment logic must run here inside component
          --------------------------------------------------------------*/}
          <button
            onClick={() => handleBuy(item)}
            className={`flex-1 rounded-lg py-2 font-semibold transition duration-300 hover:-translate-y-1 hover:shadow-md ${
              item.name === "pro"
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            <i className="fa-solid fa-bag-shopping mr-2"></i> Buy Now
          </button>
       
        </div>
      </div>
    </div>
  );
}
























