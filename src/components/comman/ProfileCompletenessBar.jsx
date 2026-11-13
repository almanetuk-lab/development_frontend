// src/components/comman/ProfileCompletenessBar.jsx
// Profile progress toward "ready" (= visible in AI suggestions).
//
//   variant="full"    → card with bar, counts and what's missing (Dashboard, My Profile, Edit Profile)
//   variant="compact" → small ring with % (Header avatar)
//
// Reads completeness from the profile context unless one is passed in
// (Edit Profile passes a live value computed from the form).
import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useUserProfile } from "../context/UseProfileContext";

const EDIT_PROFILE_PATH = "/dashboard/edit-profile";

function CompactRing({ percent, isReady }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, percent)) / 100) * c;
  return (
    <Link
      to={EDIT_PROFILE_PATH}
      title={isReady ? "Profile complete" : `Profile ${percent}% complete — finish it to appear in suggestions`}
      aria-label={`Profile ${percent}% complete`}
      className="relative inline-flex items-center justify-center w-9 h-9 shrink-0"
    >
      <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#E2E8F0" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={isReady ? "#10B981" : "#FF2A6D"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <span className="absolute text-[9px] font-black text-[#002060]">{percent}%</span>
    </Link>
  );
}

export default function ProfileCompletenessBar({
  completeness: completenessProp,
  variant = "full",
  showAction = true,
  className = "",
}) {
  const { completeness: fromContext } = useUserProfile();
  const completeness = completenessProp || fromContext;
  if (!completeness) return null;

  const { percent, isReady, mustHaves, extras } = completeness;

  if (variant === "compact") return <CompactRing percent={percent} isReady={isReady} />;

  const extrasLeft = Math.max(0, extras.required - extras.done);

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Profile completeness</p>
          <p className="text-sm font-bold text-slate-800 mt-0.5">
            {isReady ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600">
                <FiCheckCircle className="w-4 h-4" /> You're visible in suggestions
              </span>
            ) : (
              "Complete your profile to appear in suggestions"
            )}
          </p>
        </div>
        <span className={`text-2xl font-black tracking-tight ${isReady ? "text-emerald-600" : "text-[#002060]"}`}>
          {percent}%
        </span>
      </div>

      <div
        className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${isReady ? "bg-emerald-500" : "bg-[#FF2A6D]"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {!isReady && (
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          <p className="font-semibold">
            {mustHaves.done} of {mustHaves.total} required · {Math.min(extras.done, extras.required)} of{" "}
            {extras.required} extra questions
          </p>

          {mustHaves.missing.length > 0 && (
            <div>
              <p className="text-slate-500 mb-1">Required:</p>
              <div className="flex flex-wrap gap-1.5">
                {mustHaves.missing.map((m) => (
                  <span key={m.key} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold">
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {extrasLeft > 0 && (
            <div>
              <p className="text-slate-500 mb-1">
                Answer {extrasLeft} more of:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {extras.missing.map((m) => (
                  <span key={m.key} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showAction && (
            <Link
              to={EDIT_PROFILE_PATH}
              className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-xl bg-[#002060] text-white font-bold hover:bg-[#001a4d] transition-colors"
            >
              Complete profile <FiArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
