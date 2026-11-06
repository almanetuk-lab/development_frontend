import React, { useEffect, useState } from "react";
import { FiRotateCcw, FiX } from "react-icons/fi";
import { requestRecoveryCode, restoreDeletedAccount, startFreshAccount } from "../services/api";

// Shown when someone logs in or signs up with the email of a deleted account.
// They prove the email with a 6-digit code, then restore the old account or
// set it aside and start fresh (not offered when the account was banned).
//
// Props:
//   isOpen, onClose
//   email          full email to send the code to
//   emailMasked    shown to the user
//   canStartFresh  false for accounts that were banned when deleted
//   onRestored(user)  account is back and the session cookies are set
//   onStartFresh()    old account set aside; continue the new sign-up

const COPY = {
  restore: {
    title: "Restore your account",
    action: "Restore account",
    busy: "Restoring...",
  },
  start_fresh: {
    title: "Start a new account",
    action: "Start fresh",
    busy: "Setting up...",
  },
};

const errorMessage = (err, fallback) =>
  err?.response?.data?.error || err?.response?.data?.message || fallback;

export default function AccountRecoveryModal({
  isOpen,
  onClose,
  email,
  emailMasked,
  canStartFresh,
  onRestored,
  onStartFresh,
}) {
  const [purpose, setPurpose] = useState(null); // null = choosing
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // Each time the popup opens, start from the choice screen
  useEffect(() => {
    if (isOpen) {
      setPurpose(null);
      setCode("");
      setError("");
      setInfo("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sendCode = async (chosen) => {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await requestRecoveryCode(email, chosen);
      setPurpose(chosen);
      setInfo(`We've emailed a 6-digit code to ${emailMasked || "your email"}.`);
    } catch (err) {
      setError(errorMessage(err, "We couldn't send the code. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the 6-digit code from the email.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (purpose === "restore") {
        const { user } = await restoreDeletedAccount(email, code.trim());
        onRestored?.(user);
      } else {
        await startFreshAccount(email, code.trim());
        onStartFresh?.();
      }
    } catch (err) {
      setError(errorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center backdrop-blur-md px-4 py-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-recovery-title"
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
            <FiRotateCcw className="text-2xl" />
          </div>

          {!purpose ? (
            <>
              <div className="space-y-3">
                <h3 id="account-recovery-title" className="text-xl sm:text-2xl font-extrabold text-[#002060] tracking-tight">
                  This account was deleted
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {emailMasked ? <strong className="text-slate-700">{emailMasked}</strong> : "This email"} belongs to an
                  account that was deleted. You can bring it back with everything as it was
                  {canStartFresh ? ", or start over with a new, empty account." : "."}
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => sendCode("restore")}
                  disabled={loading}
                  className="w-full py-3 px-4 font-bold text-white bg-[#FF2A6D] hover:bg-[#e0105a] disabled:opacity-60 rounded-xl transition-all duration-200 text-sm shadow-md"
                >
                  {loading ? "Sending code..." : "Restore my account"}
                </button>
                {canStartFresh && (
                  <button
                    onClick={() => sendCode("start_fresh")}
                    disabled={loading}
                    className="w-full py-3 px-4 font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-60 rounded-xl transition-all duration-200 text-sm"
                  >
                    Start fresh
                  </button>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <h3 id="account-recovery-title" className="text-xl sm:text-2xl font-extrabold text-[#002060] tracking-tight">
                  {COPY[purpose].title}
                </h3>
                {info && <p className="text-slate-500 text-sm leading-relaxed">{info}</p>}
                {purpose === "start_fresh" && (
                  <p className="text-xs text-slate-400">
                    Your old account will be set aside and can't be restored after this.
                  </p>
                )}
              </div>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit code"
                aria-label="6-digit code"
                className="w-full text-center tracking-[0.5em] text-lg font-bold px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]/40"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 font-bold text-white bg-[#FF2A6D] hover:bg-[#e0105a] disabled:opacity-60 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                {loading ? COPY[purpose].busy : COPY[purpose].action}
              </button>

              <div className="flex justify-between text-xs">
                <button type="button" onClick={() => setPurpose(null)} className="text-slate-500 hover:text-slate-700">
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => sendCode(purpose)}
                  disabled={loading}
                  className="text-[#FF2A6D] font-semibold hover:underline disabled:opacity-60"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
