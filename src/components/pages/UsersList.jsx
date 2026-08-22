import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../charts/BackButton";
import { fetchUsersByType } from "../services/adminReport.api";
import { useAdminReport } from "../context/AdminReportContext";

const UsersList = () => {
  const { type } = useParams();
  const { fromDate, toDate } = useAdminReport(); //  selected dates from report

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, fromDate, toDate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsersByType(type, fromDate, toDate);
      setUsers(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 animate-fade-in">
        <div className="mb-6">
          <BackButton fallback="/admin/reports" label="← Back to Reports" />
        </div>

        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight capitalize">
              {type} Users
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold">List of members currently marked as {type}</p>
          </div>
          <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider">
            {loading ? "..." : `${users.length} registered`}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#FF2A6D]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-400 text-xs font-semibold">No users found in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">S. No.</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Profession</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Date</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user, index) => (
                  <tr key={user.id ?? index} className="hover:bg-slate-50/40 transition">
                    <td className="px-4 py-4 font-bold text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4 font-bold text-slate-800">{user.name} {user.lname}</td>
                    <td className="px-4 py-4 font-semibold text-slate-500">{user.email}</td>
                    <td className="px-4 py-4 font-medium text-slate-600">{user.age} yrs</td>
                    <td className="px-4 py-4 font-medium text-slate-600">{user.profession || "-"}</td>
                    <td className="px-4 py-4 font-medium text-slate-400">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          user.status === "Approve" || user.status === "approve"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {user.status}
                      </span>
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

export default UsersList;