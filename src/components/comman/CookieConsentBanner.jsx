import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytical: false,
    marketing: false,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay for smooth entry animation
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = async (prefs) => {
    localStorage.setItem("cookieConsent", JSON.stringify(prefs));
    setIsVisible(false);

    // If user is logged in, log to backend security audit logs
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/privacy/consent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ consentDetails: prefs }),
        });
      } catch (err) {
        console.warn("Could not sync consent status with server:", err);
      }
    }
  };

  const handleAcceptAll = () => {
    const allPrefs = { essential: true, analytical: true, marketing: true };
    setPreferences(allPrefs);
    saveConsent(allPrefs);
  };

  const handleRejectNonEssential = () => {
    const minPrefs = { essential: true, analytical: false, marketing: false };
    setPreferences(minPrefs);
    saveConsent(minPrefs);
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white p-5 rounded-2xl shadow-2xl z-50 animate-fade-in-up transition-all duration-300">
      <div className="space-y-4">
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <h4 className="text-sm font-bold tracking-wide uppercase text-indigo-400">Cookie & Privacy Consent</h4>
        </div>

        {/* Description */}
        {!isCustomizing ? (
          <p className="text-xs text-slate-300 leading-relaxed">
            We use cookies to secure authentication, analyze network performance, and deliver personalized matches in compliance with UK GDPR rules. Read our{" "}
            <Link to="/privacy-policy" className="underline text-indigo-400 hover:text-indigo-300">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        ) : (
          <div className="space-y-3 pt-1">
            <p className="text-[11px] text-slate-400">Customize your tracking preference settings:</p>
            
            {/* Essential */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Essential (Secure Session & DB Routing)</span>
              <span className="text-[10px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded font-semibold uppercase">Active</span>
            </div>

            {/* Analytical */}
            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
              <label htmlFor="consent-analytical" className="text-slate-300 cursor-pointer">
                Analytics & Matching Performance
              </label>
              <input
                id="consent-analytical"
                type="checkbox"
                checked={preferences.analytical}
                onChange={(e) => setPreferences({ ...preferences, analytical: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
              <label htmlFor="consent-marketing" className="text-slate-300 cursor-pointer">
                Personalization Heuristics
              </label>
              <input
                id="consent-marketing"
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="h-4 w-4 rounded text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {!isCustomizing ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="flex-1 min-w-[120px] py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Accept All
              </button>
              <button
                onClick={() => setIsCustomizing(true)}
                className="flex-1 min-w-[120px] py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
              >
                Customize
              </button>
              <button
                onClick={handleRejectNonEssential}
                className="w-full py-1 px-3 text-slate-400 hover:text-slate-200 text-[10px] text-center transition"
              >
                Reject Non-Essential Cookies
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveCustom}
                className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setIsCustomizing(false)}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
