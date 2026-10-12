import { useState } from "react";

const PRESETS = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "custom", label: "Custom" },
  { key: "permanent", label: "Permanent" },
];

const MAX_DAYS = 3650;

const formatDate = (date) =>
  date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

/**
 * Suspend (ban) a member: required reason + duration (preset, custom days, or permanent).
 * onConfirm receives { reason, durationDays, permanent }.
 */
export default function BanUserModal({ isOpen, userName, onClose, onConfirm, submitting = false }) {
  const [reason, setReason] = useState("");
  const [choice, setChoice] = useState("7");
  const [customDays, setCustomDays] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const permanent = choice === "permanent";
  const days = choice === "custom" ? Number(customDays) : PRESETS.find((p) => p.key === choice)?.days;
  const daysValid = permanent || (Number.isInteger(days) && days >= 1 && days <= MAX_DAYS);
  const endDate = !permanent && daysValid ? new Date(Date.now() + days * 86400000) : null;

  const handleClose = () => {
    setReason("");
    setChoice("7");
    setCustomDays("");
    setError("");
    onClose();
  };

  const handleSubmit = () => {
    if (!reason.trim()) return setError("Please enter a reason.");
    if (!daysValid) return setError(`Enter a whole number of days between 1 and ${MAX_DAYS}.`);
    setError("");
    onConfirm({ reason: reason.trim(), durationDays: permanent ? null : days, permanent });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-[999] p-5 overflow-y-auto">
      <div role="dialog" aria-modal="true" className="bg-white p-7 rounded-2xl w-[460px] max-w-full border border-slate-200/60 shadow-2xl animate-fade-in">
        <h3 className="text-base font-black text-slate-800 tracking-tight mb-1">Suspend member</h3>
        <p className="text-xs text-slate-500 font-semibold mb-5">
          {userName ? <strong className="text-slate-700">{userName}</strong> : "This member"} will be logged out
          everywhere, hidden from other members, and emailed the reason. Their plan keeps running.
        </p>

        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reason (shown to the member)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]/30"
        />

        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-1.5">Duration</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setChoice(p.key)}
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition cursor-pointer ${
                choice === p.key
                  ? p.key === "permanent"
                    ? "bg-slate-950 text-white border-slate-950"
                    : "bg-[#FF2A6D] text-white border-[#FF2A6D]"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {choice === "custom" && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={MAX_DAYS}
              step={1}
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="Days"
              className="w-28 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]/30"
            />
            <span className="text-xs text-slate-500 font-semibold">days</span>
          </div>
        )}

        <p className="mt-3 text-xs font-semibold text-slate-500">
          {permanent
            ? "Permanent — lifted only when an admin reactivates the account."
            : endDate
              ? <>Access returns automatically on <strong className="text-slate-700">{formatDate(endDate)}</strong>.</>
              : "Choose a duration."}
        </p>

        {error && <p className="mt-3 text-xs font-bold text-rose-600">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Suspending..." : "Suspend Member"}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleClose}
            className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/** Confirm reactivation with an optional internal note. onConfirm receives the note. */
export function ReactivateUserModal({ isOpen, userName, onClose, onConfirm, submitting = false }) {
  const [note, setNote] = useState("");
  if (!isOpen) return null;

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-[999] p-5 overflow-y-auto">
      <div role="dialog" aria-modal="true" className="bg-white p-7 rounded-2xl w-[420px] max-w-full border border-slate-200/60 shadow-2xl animate-fade-in">
        <h3 className="text-base font-black text-slate-800 tracking-tight mb-1">Reactivate member</h3>
        <p className="text-xs text-slate-500 font-semibold mb-5">
          {userName ? <strong className="text-slate-700">{userName}</strong> : "This member"} gets access back immediately,
          becomes visible again, and is notified by email.
        </p>
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Internal note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        />
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onConfirm(note.trim() || undefined)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Reactivating..." : "Reactivate"}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleClose}
            className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
