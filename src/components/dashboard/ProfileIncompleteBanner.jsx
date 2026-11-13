// src/components/dashboard/ProfileIncompleteBanner.jsx
// Shown on the dashboard until the profile is ready (visible in suggestions).
import React from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { useUserProfile } from "../context/UseProfileContext";

export default function ProfileIncompleteBanner() {
  const { completeness, isProfileReady } = useUserProfile();
  if (!completeness || isProfileReady) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50">
      <FiAlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">Complete your profile to appear in suggestions</p>
        <p className="text-xs text-slate-600 mt-0.5">
          Your profile is {completeness.percent}% complete. Until it's finished, you won't appear in other members'
          AI suggestions or get suggestions of your own.
        </p>
      </div>
      <Link
        to="/dashboard/edit-profile"
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#002060] text-white text-xs font-bold hover:bg-[#001a4d] transition-colors shrink-0"
      >
        Complete profile <FiArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
