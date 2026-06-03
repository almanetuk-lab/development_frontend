import React from "react";
export default function PlanCard({ plan, config, theme, addToCart, handleBuy }) {
    return (
        <div className="w-full sm:w-[320px]">
            <div className={`rounded-xl p-6 shadow border ${theme?.text || ""} ${theme?.border || ""} bg-gradient-to-br ${theme?.bg || ""} ...`}>
                <h3 className="font-bold uppercase text-center mb-4 flex justify-center items-center gap-2">
                    <span>{plan.name}</span>
                    <span className="text-blue-600 font-semibold text-lg">£{plan.price}</span>
                </h3>

                <p>{plan.description}</p>

              <ul className="text-gray-700 text-sm mb-4">
                    {plan.duration && <li>Duration: {plan.duration} Days</li>}
                    {plan.video_call_limit > 0 && (
                        <li>Video Calls: {plan.video_call_limit}</li>
                    )}
                    {plan.audio_call_limit > 0 && (
                        <li>Audio Calls: {plan.audio_call_limit}</li>
                    )}
                    {plan.people_search_limit > 0 && (
                        <li>Search Limit: {plan.people_search_limit}</li>
                    )}
                    {plan.people_message_limit > 0 && (
                        <li>Message Limit: {plan.people_message_limit}</li>
                    )}
                    {plan.billing_info && (
                        <li>Billing Info: {plan.billing_info}</li>
                    )}
                </ul>


                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => addToCart(plan)}
                        className={`rounded-xl p-6 shadow border ${theme?.text || ""} ${theme?.border || ""} bg-gradient-to-br ${theme?.bg || ""} ...`}
                    >
                        <i className="fa-solid fa-cart-shopping mr-2"></i> Add to Cart
                    </button>

                    <button
                        onClick={() => handleBuy(plan)}
                        className={`py-2 rounded-lg font-medium transition-transform duration-300 hover:-translate-y-1 hover:shadow-md ${theme.selectBtn}`}
                    >
                        Select
                    </button>
                </div>
            </div>
        </div >
    );
}