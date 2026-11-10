import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminApi";

// Deleted accounts waiting for permanent erasure. Nothing is erased
// automatically: UK GDPR expects erasure within one month of the request, so
// each account shows a countdown that turns red in the last week.

const urgency = (daysLeft, warningDaysLeft) => {
  if (daysLeft <= 0) return { label: "Overdue", style: "bg-rose-600 text-white border-rose-600" };
  if (daysLeft <= warningDaysLeft) return { label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`, style: "bg-rose-50 text-rose-700 border-rose-200" };
  return { label: `${daysLeft} days left`, style: "bg-slate-50 text-slate-600 border-slate-200" };
};

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

export default function AdminPendingErasure({ onCountChange }) {
  const [accounts, setAccounts] = useState([]);
  const [warningDaysLeft, setWarningDaysLeft] = useState(7);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  // Erase confirmation: the admin retypes the user id
  const [eraseTarget, setEraseTarget] = useState(null);
  const [confirmId, setConfirmId] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getDeletedAccounts();
      setAccounts(data.accounts || []);
      setWarningDaysLeft(data.warning_days_left ?? 7);
      onCountChange?.(data.accounts || [], data.warning_days_left ?? 7);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load deleted accounts");
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRestore = async (account) => {
    if (!window.confirm(`Restore account #${account.id}? The user can log in again straight away.`)) return;
    setBusyId(account.id);
    try {
      await adminAPI.restoreDeletedAccount(account.id);
      toast.success("Account restored");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to restore account");
    } finally {
      setBusyId(null);
    }
  };

  const closeErase = () => {
    setEraseTarget(null);
    setConfirmId("");
    setReason("");
  };

  const handleErase = async (e) => {
    e.preventDefault();
    if (String(confirmId).trim() !== String(eraseTarget.id)) {
      toast.error("The ID you typed doesn't match this account.");
      return;
    }
    setBusyId(eraseTarget.id);
    try {
      await adminAPI.eraseAccount(eraseTarget.id, Number(confirmId), reason.trim() || null);
      toast.success("Account permanently erased");
      closeErase();
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to erase account");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-lg font-extrabold text-[#002060]">Pending erasure</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Accounts users have deleted. Their data is kept until you erase it here, and the law expects that
          within one month of the request. Erasing removes all personal data and content; payments, ban records
          and security logs are kept on a blank account record. This can't be undone.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-slate-400">Loading...</p>
        ) : accounts.length === 0 ? (
          <p className="p-6 text-sm text-slate-400">No deleted accounts are waiting for erasure.</p>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Deleted</th>
                <th className="px-4 py-3">Erase by</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((account) => {
                const due = urgency(account.days_left, warningDaysLeft);
                const name = [account.first_name, account.last_name].filter(Boolean).join(" ") || account.username || "-";
                return (
                  <tr key={account.id}>
                    <td className="px-4 py-3 font-mono text-slate-500">#{account.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-700">{name}</p>
                      <p className="text-slate-400">{account.archived_at ? "Email freed (user started fresh)" : account.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(account.deleted_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${due.style}`}>{due.label}</span>
                      <p className="text-slate-400 mt-1">{formatDate(account.erase_due_at)}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {account.deleted_was_banned && <span className="block text-rose-600 font-semibold">Banned when deleted</span>}
                      {account.archived_at && <span className="block">Started fresh</span>}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      {!account.archived_at && (
                        <button
                          onClick={() => handleRestore(account)}
                          disabled={busyId === account.id}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        onClick={() => setEraseTarget(account)}
                        disabled={busyId === account.id}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 font-semibold text-white disabled:opacity-50"
                      >
                        Erase permanently
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {eraseTarget && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center px-4">
          <form onSubmit={handleErase} className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div>
              <h3 className="text-lg font-extrabold text-[#002060]">Erase account #{eraseTarget.id} permanently?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Profile, photos, messages (both sides), match and AI data are deleted for good. Payments, ban
                records and security logs are kept without personal details.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type <span className="font-mono">{eraseTarget.id}</span> to confirm
              </label>
              <input
                value={confirmId}
                onChange={(e) => setConfirmId(e.target.value)}
                inputMode="numeric"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason (optional)</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeErase} className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={busyId === eraseTarget.id}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
              >
                {busyId === eraseTarget.id ? "Erasing..." : "Erase permanently"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
