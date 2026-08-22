import React from "react";
import { useNavigate } from "react-router-dom";

const FEATURE_DETAILS = {
  messaging: {
    title: "Direct Messaging Required",
    icon: "fa-solid fa-comment-dots",
    color: "from-pink-500 to-rose-500",
    textColor: "text-pink-500",
    bgLight: "bg-pink-50",
    benefits: [
      "Send unlimited text messages to any member",
      "Share photos, files, and links securely",
      "Receive real-time chat updates and status",
      "Connect with highly aligned candidates instantly"
    ]
  },
  search: {
    title: "Advanced Search Features",
    icon: "fa-solid fa-sliders",
    color: "from-indigo-500 to-violet-500",
    textColor: "text-indigo-500",
    bgLight: "bg-indigo-50",
    benefits: [
      "Filter by detailed life pace and rhythm combinations",
      "Search within a precise geographic radius (Near Me)",
      "Enjoy unlimited daily queries",
      "Search by professions, education, and specific interest tags"
    ]
  },
  matches: {
    title: "Unlock Mutual Matches",
    icon: "fa-solid fa-heart",
    color: "from-rose-500 to-red-500",
    textColor: "text-rose-500",
    bgLight: "bg-rose-50",
    benefits: [
      "Access daily hand-picked compatibility recommendations",
      "See affinity scores based on lifestyle and values",
      "Unlock detailed breakdown of matching elements",
      "Connect directly from the matches dashboard"
    ]
  },
  suggestions: {
    title: "Unlock AI Recommendations",
    icon: "fa-solid fa-wand-magic-sparkles",
    color: "from-violet-600 to-indigo-600",
    textColor: "text-violet-600",
    bgLight: "bg-violet-50",
    benefits: [
      "Get bespoke AI affinity insights for every member",
      "Unlock communication recommendations and conversation starters",
      "Refine matches dynamically using natural language prompts",
      "Visualize compatibility matrices instantly"
    ]
  },
  members: {
    title: "Browse All Members",
    icon: "fa-solid fa-users",
    color: "from-blue-600 to-indigo-600",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
    benefits: [
      "Explore the entire intentional connection directory",
      "View high-resolution profile photos",
      "Access detailed lifestyle rhythm statistics",
      "Communicate directly with users of interest"
    ]
  },
  profiles: {
    title: "Unlock Detailed Profiles",
    icon: "fa-solid fa-user-lock",
    color: "from-purple-500 to-indigo-500",
    textColor: "text-purple-600",
    bgLight: "bg-purple-50",
    benefits: [
      "Reveal full questionnaire and prompt responses",
      "Unlock detailed compatibility indexes",
      "Check love languages and relationship values",
      "Access complete lifestyle alignment reports"
    ]
  }
};

export default function PlanRestrictionModal({ feature = "members", onClose }) {
  const navigate = useNavigate();
  const details = FEATURE_DETAILS[feature] || FEATURE_DETAILS.members;

  const handleUpgrade = () => {
    navigate("/dashboard/plans");
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center backdrop-blur-md px-4 py-6 transition-all duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col justify-between transform scale-100 transition-transform duration-300">
        
        {/* Glow backdrop blob */}
        <div className={`absolute -top-16 -left-16 w-36 h-36 bg-gradient-to-br ${details.color} opacity-10 rounded-full blur-2xl pointer-events-none`}></div>
        <div className={`absolute -bottom-16 -right-16 w-36 h-36 bg-gradient-to-br ${details.color} opacity-10 rounded-full blur-2xl pointer-events-none`}></div>
        
        <div className="space-y-6 relative z-10 flex-grow">
          {/* Animated Lock Icon Container */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            {/* Pulsing glow ring */}
            <div className={`absolute inset-0 bg-gradient-to-br ${details.color} opacity-20 rounded-full animate-ping w-full h-full`}></div>
            {/* Main icon holder */}
            <div className={`w-16 h-16 bg-gradient-to-br ${details.color} text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300`}>
              <i className={`${details.icon} text-2xl`}></i>
            </div>
            {/* Small secure lock badge */}
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow text-[10px]">
              <i className="fa-solid fa-lock"></i>
            </div>
          </div>

          <div className="space-y-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${details.textColor || "text-slate-500"} ${details.bgLight} border border-current/10`}>
              Premium Feature
            </span>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {details.title}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Upgrade your membership to unlock full access to this feature.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4.5 text-left space-y-3.5 shadow-inner">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 font-semibold">
              What's Included in Premium:
            </p>
            <ul className="space-y-2.5">
              {details.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold leading-snug">
                  <span className={`w-5 h-5 rounded-full ${details.bgLight} ${details.textColor || "text-slate-500"} flex items-center justify-center shrink-0 text-[10px]`}>
                    <i className="fa-solid fa-check"></i>
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="mt-8 space-y-3 relative z-10 w-full">
          <button
            onClick={handleUpgrade}
            className={`w-full py-3.5 bg-gradient-to-r ${details.color} text-white rounded-xl text-xs uppercase tracking-wider font-extrabold transition shadow-md hover:shadow-lg hover:opacity-95 cursor-pointer transform hover:-translate-y-0.5 duration-200`}
          >
            Upgrade Membership
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full py-3 text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            <span>Go Back</span>
          </button>
        </div>

      </div>
    </div>
  );
}
