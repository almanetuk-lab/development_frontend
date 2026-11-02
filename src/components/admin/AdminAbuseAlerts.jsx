import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminApi";
import BanUserModal from "./BanUserModal";

const STATUS_TABS = [
  { key: "pending", label: "Pending" },
  { key: "warned", label: "Warned" },
  { key: "deleted", label: "Removed" },
  { key: "dismissed", label: "Dismissed" },
  { key: "all", label: "All" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  warned: "bg-orange-50 text-orange-600 border-orange-100",
  deleted: "bg-rose-50 text-rose-600 border-rose-100",
  dismissed: "bg-slate-100 text-slate-500 border-slate-200",
};

const PAGE_LIMIT = 20;

const CONFIRM_COPY = {
  warn: {
    title: "Warn sender",
    body: "The sender gets a Community Guidelines warning notification. The receiver is never named.",
    inputLabel: "Note to the user (optional)",
    confirm: "Send Warning",
    required: false,
    tone: "bg-orange-500 hover:bg-orange-600",
  },
  delete: {
    title: "Remove message",
    body: "The message is replaced with \"[Removed by moderator]\" for both users. The original stays in this alert for the record.",
    inputLabel: "Internal note (optional)",
    confirm: "Remove Message",
    required: false,
    tone: "bg-rose-600 hover:bg-rose-700",
  },
};

// Mirrors decideAutoAction in the backend's utils/moderationRules.js (5+ strikes → ban review).
const BAN_REVIEW_STRIKES = 5;

const isDeactivated = (status) => String(status || "").toLowerCase().startsWith("deactiv");

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Highlights matched words using React text nodes only (no innerHTML).
const HighlightedContent = ({ text, words }) => {
  if (!text) return null;
  const terms = (words || []).filter(Boolean);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const lowered = new Set(terms.map((w) => w.toLowerCase()));
  return (
    <>
      {text.split(re).map((part, i) =>
        lowered.has(part.toLowerCase()) ? (
          <mark key={i} className="bg-rose-100 text-rose-700 rounded px-0.5 font-bold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};

const formatDate = (value) =>
  value
    ? `${new Date(value).toLocaleDateString()} at ${new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "";

export default function AdminAbuseAlerts({ subscribe, refreshCount }) {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { action, flag }
  const [confirmText, setConfirmText] = useState("");
  const [banTarget, setBanTarget] = useState(null); // flag whose sender is being suspended

  const fetchFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getFlaggedMessages({ status, page, limit: PAGE_LIMIT });
      setRows(res.data?.data || []);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      console.error("Failed to fetch flagged messages:", err);
      setError(err.response?.data?.message || "Failed to load abuse alerts.");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  // Live updates: debounce so a burst of alerts triggers a single refetch.
  const refetchTimerRef = useRef(null);
  useEffect(() => {
    if (!subscribe) return undefined;
    const unsubscribe = subscribe(() => {
      clearTimeout(refetchTimerRef.current);
      refetchTimerRef.current = setTimeout(fetchFlags, 1000);
    });
    return () => {
      unsubscribe();
      clearTimeout(refetchTimerRef.current);
    };
  }, [subscribe, fetchFlags]);

  const changeStatus = (key) => {
    setStatus(key);
    setPage(1);
  };

  const handleActionError = (err, fallback) => {
    const code = err.response?.status;
    const message = err.response?.data?.message;
    if (code === 409) {
      toast.info(message || "Already handled by another admin.");
      fetchFlags();
      refreshCount?.();
    } else if (code === 404) {
      toast.info("This alert no longer exists.");
      fetchFlags();
    } else {
      toast.error(message || fallback);
    }
  };

  const runFlagAction = async (flag, apiCall, successMessage, fallback) => {
    setBusyId(flag.id);
    try {
      await apiCall();
      toast.success(successMessage);
      await fetchFlags();
    } catch (err) {
      console.error(fallback, err);
      handleActionError(err, fallback);
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = (flag) =>
    runFlagAction(flag, () => adminAPI.dismissFlag(flag.id), "Alert dismissed", "Failed to dismiss alert");

  const openConfirm = (action, flag) => {
    if (action === "deactivate") {
      setBanTarget(flag);
      return;
    }
    setConfirm({ action, flag });
    setConfirmText("");
  };

  const submitConfirm = async () => {
    const { action, flag } = confirm;
    const text = confirmText.trim();
    if (CONFIRM_COPY[action].required && !text) {
      toast.error("Please enter a reason.");
      return;
    }
    setConfirm(null);

    if (action === "warn") {
      await runFlagAction(flag, () => adminAPI.warnFlag(flag.id, text || undefined), "Warning sent", "Failed to warn user");
    } else if (action === "delete") {
      await runFlagAction(
        flag,
        () => adminAPI.deleteFlaggedMessage(flag.id, text || undefined),
        "Message removed",
        "Failed to remove message",
      );
    }
  };

  // Suspend the sender; the ban is linked to this alert via flag_id
  const confirmBan = async ({ reason, durationDays, permanent }) => {
    const flag = banTarget;
    setBusyId(flag.id);
    try {
      await adminAPI.deactivateUser(flag.sender_id, { reason, durationDays, permanent, flagId: flag.id });
      setBanTarget(null);
      toast.success(permanent ? "Sender suspended permanently" : `Sender suspended for ${durationDays} day(s)`);
      // Reflect the new status on every alert from this sender.
      setRows((prev) =>
        prev.map((r) => (r.sender_id === flag.sender_id ? { ...r, sender_status: "Deactivate" } : r)),
      );
    } catch (err) {
      console.error("Failed to suspend user", err);
      toast.error(err.response?.data?.message || "Failed to suspend user");
    } finally {
      setBusyId(null);
    }
  };

  const renderBadges = (flag) => (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {flag.is_ai_generated && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-violet-50 text-violet-600 border-violet-100">
          AI-generated
        </span>
      )}
      {!flag.message_exists && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-slate-100 text-slate-500 border-slate-200">
          Deleted by sender
        </span>
      )}
      {isDeactivated(flag.sender_status) && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-slate-950 text-white border-slate-950">
          Sender deactivated
        </span>
      )}
      {flag.warning_count > 0 && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-orange-50 text-orange-600 border-orange-100">
          {flag.warning_count} prior warning{flag.warning_count === 1 ? "" : "s"}
        </span>
      )}
      {flag.severity === "severe" ? (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-rose-600 text-white border-rose-600">
          Severe{flag.is_strike ? " · strike" : ""}
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-slate-50 text-slate-500 border-slate-200">
          Mild
        </span>
      )}
      {flag.active_strikes > 0 && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-rose-50 text-rose-600 border-rose-100">
          {flag.active_strikes} strike{flag.active_strikes === 1 ? "" : "s"} / 30 days
        </span>
      )}
      {flag.auto_action === "warned" && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-100">
          Auto-warned
        </span>
      )}
      {flag.auto_action === "muted" && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-100">
          Auto-muted
        </span>
      )}
      {flag.sender_muted_until && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-indigo-50 text-indigo-600 border-indigo-100">
          Muted until {formatDate(flag.sender_muted_until)}
        </span>
      )}
      {flag.active_strikes >= BAN_REVIEW_STRIKES && !isDeactivated(flag.sender_status) && (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border bg-slate-950 text-rose-300 border-rose-500 animate-pulse">
          Ban review suggested
        </span>
      )}
      {flag.matched_words?.length > 0 && (
        <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-400">
          Matched: {flag.matched_words.join(", ")}
        </span>
      )}
    </div>
  );

  const renderActions = (flag) => {
    if (flag.status !== "pending") {
      return (
        <div className="text-[11px] text-slate-500 font-semibold">
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
              STATUS_STYLES[flag.status] || STATUS_STYLES.dismissed
            }`}
          >
            {flag.status}
          </span>
          <div className="mt-1.5">
            by {flag.reviewed_by_name || `admin #${flag.reviewed_by}`}
            <br />
            {formatDate(flag.reviewed_at)}
          </div>
          {flag.review_note && <div className="mt-1 italic text-slate-400">“{flag.review_note}”</div>}
          {!isDeactivated(flag.sender_status) && (
            <button
              type="button"
              disabled={busyId === flag.id}
              onClick={() => openConfirm("deactivate", flag)}
              className="mt-2 px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
            >
              Deactivate User
            </button>
          )}
        </div>
      );
    }

    const busy = busyId === flag.id;
    const btn =
      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
    return (
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <button type="button" disabled={busy} onClick={() => handleDismiss(flag)} className={`${btn} bg-slate-100 hover:bg-slate-200 text-slate-600`}>
          Dismiss
        </button>
        <button
          type="button"
          disabled={busy || flag.is_ai_generated}
          title={flag.is_ai_generated ? "Written by the user's AI agent — the user can't be warned for it" : "Warn the sender"}
          onClick={() => openConfirm("warn", flag)}
          className={`${btn} bg-orange-50 hover:bg-orange-100 text-orange-600`}
        >
          Warn
        </button>
        <button type="button" disabled={busy} onClick={() => openConfirm("delete", flag)} className={`${btn} bg-rose-50 hover:bg-rose-100 text-rose-600`}>
          Delete
        </button>
        <button
          type="button"
          disabled={busy || isDeactivated(flag.sender_status)}
          title={isDeactivated(flag.sender_status) ? "Sender is already deactivated" : "Deactivate the sender"}
          onClick={() => openConfirm("deactivate", flag)}
          className={`${btn} bg-slate-950 hover:bg-slate-900 text-white`}
        >
          Deactivate
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-5 sm:p-8">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Abuse Alerts</h1>
            <p className="text-xs text-slate-500 mt-1">
              Chat messages flagged by the automatic content filter. Flagged messages were still delivered.
            </p>
          </div>
          <button
            onClick={() => {
              fetchFlags();
              refreshCount?.();
            }}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <i className="fa-solid fa-rotate-right"></i>
            )}
            Refresh
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => changeStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition cursor-pointer ${
                status === tab.key
                  ? "bg-[#FF2A6D] text-white border-[#FF2A6D]"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF2A6D] mb-4"></div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading alerts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-rose-50 border border-rose-100 rounded-xl">
            <i className="fa-solid fa-circle-exclamation text-rose-300 text-4xl mb-3"></i>
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <button onClick={fetchFlags} className="mt-3 text-xs font-bold text-rose-600 underline cursor-pointer">
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-xl">
            <i className="fa-solid fa-shield-halved text-slate-300 text-4xl mb-3"></i>
            <p className="text-sm font-semibold text-slate-600">No {status === "all" ? "" : `${status} `}alerts</p>
            <p className="text-xs text-slate-400 mt-1">Messages caught by the content filter will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((flag) => (
              <div
                key={flag.id}
                className="border border-slate-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-slate-50/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500 font-semibold">
                    <span className="font-black text-slate-800">{flag.sender_name || `User #${flag.sender_id}`}</span>
                    {flag.sender_email && <span className="text-slate-400"> ({flag.sender_email})</span>}
                    <i className="fa-solid fa-arrow-right mx-2 text-slate-300"></i>
                    <span className="font-bold text-slate-700">{flag.receiver_name || `User #${flag.receiver_id}`}</span>
                    <span className="text-slate-400 ml-2">· {formatDate(flag.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap break-words bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <HighlightedContent text={flag.original_content} words={flag.matched_words} />
                  </p>
                  {renderBadges(flag)}
                </div>
                <div className="sm:w-72 shrink-0">{renderActions(flag)}</div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              disabled={!pagination.hasPrevPage || loading}
              onClick={() => setPage((p) => p - 1)}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer bg-white"
            >
              Prev
            </button>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={!pagination.hasNextPage || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <BanUserModal
        isOpen={!!banTarget}
        userName={banTarget?.sender_name || (banTarget ? `User #${banTarget.sender_id}` : "")}
        submitting={busyId === banTarget?.id}
        onClose={() => setBanTarget(null)}
        onConfirm={confirmBan}
      />

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-[999] p-5 overflow-y-auto">
          <div className="bg-white p-7 rounded-2xl w-[420px] max-w-full border border-slate-200/60 shadow-2xl animate-fade-in">
            <h3 className="text-base font-black text-slate-800 tracking-tight mb-2">{CONFIRM_COPY[confirm.action].title}</h3>
            <p className="text-xs text-slate-500 font-semibold mb-4">{CONFIRM_COPY[confirm.action].body}</p>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
              {CONFIRM_COPY[confirm.action].inputLabel}
            </label>
            <textarea
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2A6D]/30"
            />
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={submitConfirm}
                className={`flex-1 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${CONFIRM_COPY[confirm.action].tone}`}
              >
                {CONFIRM_COPY[confirm.action].confirm}
              </button>
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
