import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
//import UserActivityTable from "../components/UserActivityTable";
import UserActivityTable from "../charts/UserActivityTable";
import BackButton from "../charts/BackButton";
import { fetchNotRenewedUsers } from "../services/adminReport.api";
import { useAdminReport } from "../context/AdminReportContext";
const SubscriptionPay = () => {
  const { state } = useLocation();
  const tableData = state?.val ?? [];

  const { fromDate, toDate } = useAdminReport();

  const [expiredCount, setExpiredCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);

  useEffect(() => {
    const fetchExpiredCount = async () => {
      try {
        setCountLoading(true);
        const res = await fetchNotRenewedUsers(fromDate, toDate);
        const list = res?.data || [];
        setExpiredCount(list.length);
      } catch (e) {
        console.error("Failed to fetch not-renewed count:", e);
        setExpiredCount(0);
      } finally {
        setCountLoading(false);
      }
    };

    fetchExpiredCount();
  }, [fromDate, toDate]);

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 animate-fade-in">
        <div className="mb-6">
          <BackButton fallback="/admin/reports" label="← Back to Reports" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Plan & Payment Activity</h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Timeline of purchases, active plans, and transactional history</p>
          </div>
          <div className="px-3.5 py-2 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Expired (Not Renewed): {countLoading ? "..." : expiredCount}
          </div>
        </div>

        <UserActivityTable data={tableData} />
      </div>
    </div>
  );
};

export default SubscriptionPay;