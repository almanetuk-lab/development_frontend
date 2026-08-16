import React from "react";

export default function PlanCard({ plan, config, activePlan, addToCart, handleBuy }) {
  const isCurrentActive = activePlan?.active && activePlan?.plan_name === plan.name;

  // Determine design elements based on plan tier name
  const getThemeDetails = (planName) => {
    const name = (planName || "").toLowerCase();
    
    if (name.includes("platinum") || name.includes("premium") || name.includes("vip")) {
      return {
        cardBg: "bg-slate-950 border-slate-800 text-white relative shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 hover:border-indigo-500/40",
        floatingTag: (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-indigo-400/20 whitespace-nowrap">
            <i className="fa-solid fa-gem text-indigo-300"></i> Elite Tier
          </div>
        ),
        priceColor: "text-indigo-400",
        textColor: "text-slate-400",
        buyBtn: "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 active:scale-98",
        cartBtn: "border border-slate-800 hover:bg-slate-900 text-slate-200",
        badgeBg: "bg-slate-900 border border-slate-800"
      };
    }
    
    if (name.includes("gold") || name.includes("standard") || name.includes("pro")) {
      return {
        cardBg: "bg-white border-[#FF2A6D]/20 text-slate-800 relative shadow-md hover:shadow-xl hover:border-[#FF2A6D]/40",
        floatingTag: (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF2A6D] to-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <i className="fa-solid fa-crown text-amber-300"></i> Most Popular
          </div>
        ),
        priceColor: "text-[#FF2A6D]",
        textColor: "text-slate-500",
        buyBtn: "bg-gradient-to-r from-[#FF2A6D] to-rose-600 hover:from-[#e0105a] hover:to-[#FF2A6D] text-white shadow-lg shadow-pink-500/20 active:scale-98",
        cartBtn: "border border-slate-200 hover:bg-slate-50 text-slate-700",
        badgeBg: "bg-slate-50 border border-slate-100"
      };
    }

    // Basic / Default Plan
    return {
      cardBg: "bg-white border-slate-200/80 text-slate-800 relative shadow-sm hover:shadow-md hover:border-slate-300",
      floatingTag: (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <i className="fa-solid fa-star text-amber-400"></i> Starter Option
        </div>
      ),
      priceColor: "text-[#002060]",
      textColor: "text-slate-500",
      buyBtn: "bg-gradient-to-r from-[#002060] to-blue-900 hover:from-[#001848] hover:to-[#002060] text-white shadow-lg shadow-[#002060]/10 active:scale-98",
      cartBtn: "border border-slate-200 hover:bg-slate-50 text-slate-700",
      badgeBg: "bg-slate-50 border border-slate-100"
    };
  };

  const theme = getThemeDetails(plan.name);

  return (
    <div className={`flex flex-col justify-between rounded-3xl p-7 md:p-8 border transition-all duration-300 hover:-translate-y-2 min-w-[290px] max-w-[360px] w-full group mx-auto ${theme.cardBg}`}>
      {/* Floating Tier Header Tag */}
      {theme.floatingTag}

      <div>
        {/* Plan Header Info */}
        <div className="mb-6 mt-2">
          <h3 className="text-xl font-extrabold tracking-tight">{plan.name}</h3>
          
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className={`text-4xl font-black ${theme.priceColor}`}>£{plan.price}</span>
            <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">
              / {plan.duration || 30} Days
            </span>
          </div>

          {plan.description && (
            <p className={`text-xs mt-3.5 leading-relaxed font-medium ${theme.textColor}`}>
              {plan.description}
            </p>
          )}
        </div>

        {/* Features Checklist */}
        <div className="border-t border-slate-100/10 pt-6 mb-8">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4.5">
            Included Capabilities
          </h4>
          <ul className="space-y-4">
            {plan.duration && (
              <li className="flex items-center gap-3 text-xs font-semibold">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${theme.badgeBg}`}>
                  <i className="fa-solid fa-calendar-days text-[11px] text-slate-500"></i>
                </span>
                <span>Active duration: <strong className="font-extrabold">{plan.duration} Days</strong></span>
              </li>
            )}
            
            <li className="flex items-center gap-3 text-xs font-semibold">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${theme.badgeBg}`}>
                <i className="fa-solid fa-video text-[11px] text-slate-500"></i>
              </span>
              <span>
                Video Calls:{" "}
                <strong className="font-extrabold">
                  {plan.video_call_limit > 0 ? `${plan.video_call_limit} / month` : "Not included"}
                </strong>
              </span>
            </li>

            <li className="flex items-center gap-3 text-xs font-semibold">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${theme.badgeBg}`}>
                <i className="fa-solid fa-phone text-[11px] text-slate-500"></i>
              </span>
              <span>
                Audio Calls:{" "}
                <strong className="font-extrabold">
                  {plan.audio_call_limit > 0 ? `${plan.audio_call_limit} / month` : "Not included"}
                </strong>
              </span>
            </li>

            <li className="flex items-center gap-3 text-xs font-semibold">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${theme.badgeBg}`}>
                <i className="fa-solid fa-magnifying-glass text-[11px] text-slate-500"></i>
              </span>
              <span>
                Search Limit:{" "}
                <strong className="font-extrabold">
                  {plan.people_search_limit > 0 ? `${plan.people_search_limit} profiles` : "Unlimited searches"}
                </strong>
              </span>
            </li>

            <li className="flex items-center gap-3 text-xs font-semibold">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${theme.badgeBg}`}>
                <i className="fa-solid fa-comment-dots text-[11px] text-slate-500"></i>
              </span>
              <span>
                Message Limit:{" "}
                <strong className="font-extrabold">
                  {plan.people_message_limit > 0 ? `${plan.people_message_limit} members` : "Unlimited chat"}
                </strong>
              </span>
            </li>

            {plan.billing_info && (
              <li className="flex items-start gap-3 text-xs font-semibold">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${theme.badgeBg}`}>
                  <i className="fa-solid fa-credit-card text-[10px] text-slate-500"></i>
                </span>
                <span className="leading-snug">{plan.billing_info}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Button Actions Block */}
      <div className="mt-auto pt-6 border-t border-slate-100/10">
        {isCurrentActive ? (
          <button
            disabled
            className="w-full py-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <i className="fa-solid fa-circle-check text-emerald-500"></i>
            <span>Current Active Plan</span>
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Direct Stripe Buy Checkout */}
            <button
              onClick={() => handleBuy(plan)}
              className={`w-full py-3.5 font-extrabold text-xs uppercase tracking-widest rounded-2xl transition-all duration-200 cursor-pointer text-center ${theme.buyBtn}`}
            >
              Select & Proceed
            </button>

            {/* Add to Cart option */}
            <button
              onClick={() => addToCart(plan)}
              className={`w-full py-3 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${theme.cartBtn}`}
            >
              <i className="fa-solid fa-cart-shopping text-xs"></i>
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}