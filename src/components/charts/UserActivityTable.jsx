
import { useState, useEffect } from "react";

const UserActivityTable = ({ data = [] }) => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setTotalAmount(total);
  }, [data]);

  if (!data.length) {
    return (
      <p className="text-slate-400 text-xs font-semibold text-center py-10">
        No user activity found
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
      <table className="min-w-full text-xs text-left divide-y divide-slate-100">
        <thead className="bg-slate-50/70">
          <tr>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">S. No.</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Date</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-slate-50/40 transition">
              <td className="px-6 py-4 font-bold text-slate-400">{index + 1}</td>
              <td className="px-6 py-4 font-bold text-slate-800">{item.user_name}</td>
              <td className="px-6 py-4 font-semibold text-slate-500">{item.email}</td>
              <td className="px-6 py-4 font-medium text-slate-600">{item.plan_name}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    String(item.plan_status).toLowerCase() === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}
                >
                  {item.plan_status}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800">
                {item.amount ? `£${item.amount} ${item.currency}` : "-"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    String(item.payment_status).toLowerCase() === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {item.payment_status || "PENDING"}
                </span>
              </td>
              <td className="px-6 py-4 font-medium text-slate-400">
                {item.plan_purchase_date
                  ? new Date(item.plan_purchase_date).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          Total Revenue Collected: <span className="text-[#FF2A6D] text-lg font-black">£{totalAmount.toFixed(2)}</span>
        </h3>
      </div>
    </div>
  );
};

export default UserActivityTable;