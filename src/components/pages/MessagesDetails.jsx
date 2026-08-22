import { useLocation } from "react-router-dom";
import BackButton from "../charts/BackButton";
const MessagesDetails = () => {
  const { state } = useLocation();
  const total = state?.total ?? 0;
  const data = state?.val ?? [];

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 animate-fade-in">
        <div className="mb-6">
          <BackButton fallback="/admin/reports" label="← Back to Reports" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Direct Messaging Logs</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Audit trail of messages exchanged between connections on the platform</p>
          </div>
          <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Messages: {total}
          </span>
        </div>

        {!data.length ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-xs font-semibold">No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full text-xs text-left divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-4 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">S. No.</th>
                  <th className="px-4 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                  <th className="px-4 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sender</th>
                  <th className="px-4 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Receiver</th>
                  <th className="px-4 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Content</th>
                  <th className="px-4 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attachment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((m, index) => (
                  <tr key={m.id ?? index} className="hover:bg-slate-50/40 transition">
                    <td className="px-4 py-4 font-bold text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4 text-slate-500 font-semibold">{new Date(m.created_at).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{m.sender_name}</div>
                      <div className="text-slate-400 font-semibold">{m.sender_email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{m.receiver_name || "N/A"}</div>
                      <div className="text-slate-400 font-semibold">{m.receiver_email || ""}</div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 max-w-xs truncate">{m.content || "-"}</td>
                    <td className="px-4 py-4">
                      {m.attachment_url ? (
                        <a className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-xl font-bold uppercase text-[9px] tracking-wider transition" href={m.attachment_url} target="_blank" rel="noreferrer">
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesDetails;