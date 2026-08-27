import React from "react";
import { FiClock, FiX } from "react-icons/fi";

export default function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center backdrop-blur-md px-4 py-6 transition-all duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col justify-between transform scale-100 transition-transform duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          <FiX size={20} />
        </button>

        {/* Glow backdrop blob */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-gradient-to-br from-[#FF2A6D] to-rose-500 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="space-y-6 relative z-10 flex-grow pt-4">
          {/* Animated Clock Icon Container */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            {/* Pulsing glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF2A6D] to-rose-500 opacity-20 rounded-full animate-ping w-full h-full"></div>
            {/* Main icon holder */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF2A6D] to-[#e0105a] text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <FiClock className="text-2xl" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#FF2A6D] bg-pink-50 border border-[#FF2A6D]/10">
              Coming Soon
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#002060] tracking-tight">
              Coming soon
            </h3>
            <p className="text-[#FF2A6D] text-sm font-bold tracking-wide">
              The future of meaningful connection
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              We are currently preparing the platform for launch. Registration is temporarily closed. Please check back soon.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 font-bold text-white bg-[#FF2A6D] hover:bg-[#e0105a] rounded-xl hover:shadow-lg transition-all duration-200 text-sm shadow-md"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
