import React, { useState, useEffect, useCallback } from "react";
import {
  HiBriefcase,
  HiChatAlt,
  HiShieldCheck,
  HiCheckCircle,
  HiShieldExclamation,
  HiX,
  HiClock,
  HiAdjustments,
} from "react-icons/hi";
import api from "../services/api";

// Window events so pages (e.g. the AI Suggestions trust card) can talk to the
// single modal mounted in UserDashboard without sharing state.
export const GHOSTING_OPEN_EVENT = "ghosting-alert:open";
export const GHOSTING_RESOLVED_EVENT = "ghosting-alert:resolved";

const REASONS = [
  { label: "Busy with Work", icon: HiBriefcase },
  { label: "Wrong Timing", icon: HiClock },
  { label: "Not Interested", icon: HiX },
  { label: "Already Talking", icon: HiChatAlt },
  { label: "Other", icon: HiAdjustments },
];

/**
 * Module 8 — Anti-Ghosting alert. Mounted once for every /dashboard/* page.
 * The backend remembers answered and dismissed alerts, so the modal only
 * appears again when there is a new unanswered message.
 */
export default function GhostingAlertModal() {
  const [trustStatus, setTrustStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const fetchTrustStatus = useCallback(async ({ openIfAlert = true } = {}) => {
    try {
      const res = await api.get("/api/handshake/trust-status");
      const data = res.data?.data;
      if (!data) return null;
      setTrustStatus(data);
      if (openIfAlert && data.ghostingAlert) setOpen(true);
      return data;
    } catch (err) {
      console.warn("[Module 8] Trust status fetch failed:", err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchTrustStatus();
    const onOpen = () => fetchTrustStatus();
    window.addEventListener(GHOSTING_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(GHOSTING_OPEN_EVENT, onOpen);
  }, [fetchTrustStatus]);

  const reset = () => {
    setOpen(false);
    setSuccess(false);
    setReason("");
    setCustomReason("");
    setError("");
  };

  const notifyResolved = () => window.dispatchEvent(new Event(GHOSTING_RESOLVED_EVENT));

  const handleRespond = async () => {
    if (!reason) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/api/handshake/ghosting-respond", {
        reason,
        customReason: reason === "Other" ? customReason : undefined,
      });
      setSuccess(true);
      await fetchTrustStatus({ openIfAlert: false });
      notifyResolved();
      setTimeout(reset, 2000);
    } catch (err) {
      console.error("[Module 8] Ghosting respond failed:", err.message);
      setError(err?.response?.data?.message || "Could not save your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Closing without a reason counts as ignoring the prompt; the server marks the
  // alert resolved so it does not come back on refresh.
  const handleDismiss = async () => {
    reset();
    try {
      await api.post("/api/handshake/ghosting-dismiss");
    } catch (err) {
      console.warn("[Module 8] Ghosting dismiss failed:", err.message);
    }
    await fetchTrustStatus({ openIfAlert: false });
    notifyResolved();
  };

  if (!open || !trustStatus?.ghostingAlert) return null;

  const timeoutHours = import.meta.env.VITE_GHOSTING_TIMEOUT_HOURS || 48;
  const score = trustStatus?.trustScore ?? 100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl animate-modal-in">
        <div className="relative p-6 sm:p-8 space-y-5">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <HiCheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-slate-900 text-lg font-bold">Response Registered</h3>
                <p className="text-slate-500 text-xs sm:text-sm">Your digital twin has been sync'd to protect your Trust Level.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 border border-rose-100 text-rose-700">
                    <HiShieldExclamation className="w-3.5 h-3.5 text-rose-600" />
                    <span>GHOSTING ALIGNMENT CHECK</span>
                  </div>
                  <h3 className="text-slate-900 text-base sm:text-lg font-bold leading-tight">
                    Unanswered message from<br />
                    <span className="text-indigo-655">{trustStatus.ghostingAlert.partnerName || "Your Match"}</span>
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Over {timeoutHours} hours elapsed. Protecting your Trust rating requires inputting alignment state.
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  aria-label="Dismiss alert"
                  className="text-slate-400 hover:text-slate-655 transition text-2xl leading-none flex-shrink-0"
                >
                  <HiX className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Trust Score Preview Indicator */}
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <HiShieldCheck className="w-7 h-7 text-indigo-600 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Current Rating</span>
                    <span className="text-slate-800">{score}/100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-rose-600 text-[10px] font-bold">⚠️ Warning: Ignoring this prompt will deduct 20 points.</p>
                </div>
              </div>

              {/* Response Reasons */}
              <div className="space-y-3">
                <p className="text-slate-700 text-xs font-bold uppercase tracking-wider">Select Alignment Reason:</p>
                <div className="grid grid-cols-2 gap-2">
                  {REASONS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setReason(item.label)}
                      className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-left border"
                      style={{
                        background: reason === item.label ? "rgba(79, 70, 229, 0.08)" : "rgba(248, 250, 252, 0.9)",
                        borderColor: reason === item.label ? "#4f46e5" : "#e2e8f0",
                        color: reason === item.label ? "#4f46e5" : "#334155",
                        gridColumn: item.label === "Other" ? "span 2" : "span 1",
                      }}
                    >
                      {React.createElement(item.icon, { className: `w-4 h-4 ${reason === item.label ? "text-indigo-655" : "text-slate-400"}` })}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea for Other */}
              {reason === "Other" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Briefly explain details to tune your twin..."
                  rows={2.5}
                  className="w-full rounded-2xl px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              )}

              {error && <p className="text-rose-600 text-xs font-semibold">{error}</p>}

              {/* Actions */}
              <button
                onClick={handleRespond}
                disabled={!reason || submitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 hover:scale-[1.01]"
              >
                {submitting ? "Syncing..." : "Register Response & Preserve Trust"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
