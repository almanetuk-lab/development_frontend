// src/components/dashboard/ProfileCompletionModal.jsx
// One popup per login while the profile isn't ready. Closing it hides it for the
// rest of the session; logout clears the flag so it shows again next login.
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useUserProfile } from "../context/UseProfileContext";
import { PROFILE_POPUP_DISMISSED_KEY } from "../../utils/profilePopup";
import ProfileCompletenessBar from "../comman/ProfileCompletenessBar";

const wasDismissed = () => {
  try {
    return sessionStorage.getItem(PROFILE_POPUP_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};

const markDismissed = () => {
  try {
    sessionStorage.setItem(PROFILE_POPUP_DISMISSED_KEY, "1");
  } catch {
    /* storage unavailable — popup just won't be remembered */
  }
};

export default function ProfileCompletionModal() {
  const { completeness, isProfileReady, loading } = useUserProfile();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(wasDismissed);

  // Not on the edit page itself — they're already doing what the popup asks.
  const onEditPage = pathname.includes("edit-profile");
  const open = !loading && !onEditPage && !!completeness && !isProfileReady && !dismissed;

  const close = () => {
    markDismissed();
    setDismissed(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-completion-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 id="profile-completion-title" className="text-lg font-black text-[#002060]">
            Finish your profile to get discovered
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Only complete profiles appear in AI suggestions, and you'll get your own suggestions once yours is done. It takes a couple of minutes.
        </p>

        <ProfileCompletenessBar showAction={false} />

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end mt-5">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            Later
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              navigate("/dashboard/edit-profile");
            }}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-[#FF2A6D] text-white hover:bg-[#e0105a]"
          >
            Complete profile
          </button>
        </div>
      </div>
    </div>
  );
}
