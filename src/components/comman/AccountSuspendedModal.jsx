import React from "react";
import { FiSlash, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

const daysLeft = (value) => Math.max(1, Math.ceil((new Date(value).getTime() - Date.now()) / 86400000));

export default function AccountSuspendedModal({ isOpen, onClose, reason, bannedUntil, isPermanent }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const permanent = isPermanent || !bannedUntil;

  const handleContact = () => {
    onClose?.();
    navigate("/contact");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center backdrop-blur-md px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-suspended-title"
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          <FiX size={20} />
        </button>

        <div className="space-y-5 relative z-10 pt-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#FF2A6D] to-[#e0105a] text-white rounded-2xl flex items-center justify-center shadow-lg">
            <FiSlash className="text-2xl" />
          </div>

          <div className="space-y-3">
            <h3 id="account-suspended-title" className="text-xl sm:text-2xl font-extrabold text-[#002060] tracking-tight">
              Your account has been suspended
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your account has been suspended for violating our community guidelines.
            </p>

            {reason && (
              <div className="bg-pink-50 border border-[#FF2A6D]/15 rounded-xl px-4 py-3 text-left">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2A6D] mb-1">Reason</p>
                <p className="text-sm text-slate-700 break-words">{reason}</p>
              </div>
            )}

            <p className="text-sm text-slate-600">
              {permanent ? (
                "This suspension is permanent."
              ) : (
                <>
                  You can access your account again on <strong>{formatDate(bannedUntil)}</strong>{" "}
                  <span className="text-slate-400">({daysLeft(bannedUntil)} day{daysLeft(bannedUntil) === 1 ? "" : "s"} left)</span>.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleContact}
              className="flex-1 py-3 px-4 font-bold text-white bg-[#FF2A6D] hover:bg-[#e0105a] rounded-xl transition-all duration-200 text-sm shadow-md"
            >
              Contact us
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all duration-200 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
