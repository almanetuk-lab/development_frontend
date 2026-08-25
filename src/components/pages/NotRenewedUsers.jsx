
import { useEffect, useState } from "react";
import BackButton from "../charts/BackButton";
import { fetchNotRenewedUsers } from "../services/adminReport.api";
import { useAdminReport } from "../context/AdminReportContext";

const NotRenewedUsers = () => {
  const { fromDate, toDate } = useAdminReport();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await fetchNotRenewedUsers(fromDate, toDate);
        setData(res?.data || []);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [fromDate, toDate]);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6 sm:p-8 animate-fade-in">
      <div className="mb-6">
        <BackButton fallback="/admin/reports" label="← Back to Reports" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Not Renewed Members</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Registered users whose subscription plans have expired without renewal</p>
        </div>
        <span className="px-3 py-1 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-700 uppercase tracking-wider">
          Expired Members: {loading ? "..." : data.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#FF2A6D]"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400 text-xs font-semibold">No expired users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">S. No.</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Name</th>
                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.map((u, index) => (
                <tr key={u.id || index} className="hover:bg-slate-50/40 transition">
                  <td className="px-4 py-4 font-bold text-slate-400">{index + 1}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">{u.name} {u.lname}</td>
                  <td className="px-4 py-4 font-semibold text-slate-500">{u.email}</td>
                  <td className="px-4 py-4 font-medium text-slate-600">{u.phone || "-"}</td>
                  <td className="px-4 py-4 font-medium text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 rounded-lg font-bold">
                      {u.plan_title || "Standard"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-rose-600 font-bold">
                    {u.last_expires_at
                      ? new Date(u.last_expires_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotRenewedUsers;