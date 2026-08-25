import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../charts/BackButton";
import { fetchUsersByType } from "../services/adminReport.api";
import { useAdminReport } from "../context/AdminReportContext";

const UsersList = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const activeType = type || "all";
  const { fromDate, toDate, report } = useAdminReport(); //  selected dates from report

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const getAccentClasses = (accent, isActive) => {
    if (!isActive) return "border-slate-200/70 hover:border-slate-350 hover:shadow-2xs";
    switch (accent) {
      case "indigo":
        return "border-t-4 border-t-indigo-500 bg-indigo-50/10 border-indigo-200 shadow-xs";
      case "emerald":
        return "border-t-4 border-t-emerald-500 bg-emerald-50/10 border-emerald-200 shadow-xs";
      case "amber":
        return "border-t-4 border-t-amber-500 bg-amber-50/10 border-amber-200 shadow-xs";
      case "blue":
        return "border-t-4 border-t-blue-500 bg-blue-50/10 border-blue-200 shadow-xs";
      case "rose":
        return "border-t-4 border-t-rose-500 bg-rose-50/10 border-rose-200 shadow-xs";
      default:
        return "border-t-4 border-t-slate-500 bg-slate-50/10 border-slate-200 shadow-xs";
    }
  };

  const getLabelColor = (accent, isActive) => {
    if (!isActive) return "text-slate-400";
    switch (accent) {
      case "indigo": return "text-indigo-700";
      case "emerald": return "text-emerald-700";
      case "amber": return "text-amber-700";
      case "blue": return "text-blue-700";
      case "rose": return "text-rose-700";
      default: return "text-slate-700";
    }
  };
  
  const getIconColorHover = (accent) => {
    switch (accent) {
      case "indigo": return "group-hover:text-indigo-600";
      case "emerald": return "group-hover:text-emerald-600";
      case "amber": return "group-hover:text-amber-600";
      case "blue": return "group-hover:text-blue-600";
      case "rose": return "group-hover:text-rose-600";
      default: return "group-hover:text-slate-600";
    }
  };

  const filterOptions = [
    {
      key: "all",
      label: "All Users",
      icon: "fa-users",
      accent: "indigo",
      count: report?.summary?.users?.total_users,
    },
    {
      key: "approved",
      label: "Approved",
      icon: "fa-circle-check",
      accent: "emerald",
      count: report?.summary?.users?.approved_users,
    },
    {
      key: "hold",
      label: "On Hold",
      icon: "fa-circle-pause",
      accent: "amber",
      count: report?.summary?.users?.hold_users,
    },
    {
      key: "process",
      label: "In Process",
      icon: "fa-arrows-spin",
      accent: "blue",
      count: report?.summary?.users?.in_process_users,
    },
    {
      key: "deactivated",
      label: "Deactivated",
      icon: "fa-user-slash",
      accent: "rose",
      count: report?.summary?.users?.deactivated_users,
    },
  ];

  useEffect(() => {
    setCurrentPage(1);
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

  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6 sm:p-8 animate-fade-in">
      <div className="mb-6">
        <BackButton fallback="/admin/reports" label="← Back to Reports" />
      </div>

      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight capitalize">
            {activeType} Users
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">List of members currently marked as {activeType}</p>
        </div>
        <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider">
          {loading ? "..." : `${users.length} registered`}
        </span>
      </div>

      {/* Cards Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {filterOptions.map((opt) => {
          const isActive = activeType === opt.key;
          return (
            <div
              key={opt.key}
              onClick={() => navigate(`/admin/users/${opt.key}`)}
              className={`bg-white rounded-xl border p-4 cursor-pointer select-none transition-all duration-200 group flex flex-col justify-between h-20 ${getAccentClasses(opt.accent, isActive)}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${getLabelColor(opt.accent, isActive)}`}>
                  {opt.label}
                </span>
                <i className={`fa-solid ${opt.icon} text-slate-400 ${getIconColorHover(opt.accent)} transition text-xs`}></i>
              </div>
              <h4 className="text-lg font-bold text-slate-800 tracking-tight">
                {isActive ? (loading ? "..." : users.length) : (opt.count ?? "-")}
              </h4>
            </div>
          );
        })}
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
        <>
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
                {paginatedUsers.map((user, index) => {
                  const actualIndex = startIndex + index + 1;
                  return (
                    <tr key={user.id ?? index} className="hover:bg-slate-50/40 transition">
                      <td className="px-4 py-4 font-bold text-slate-400">{actualIndex}</td>
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
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400">
                Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-700">{Math.min(endIndex, totalItems)}</span> of{" "}
                <span className="font-bold text-slate-700">{totalItems}</span> users
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition text-xs font-bold select-none cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-[11px] font-bold text-slate-600 px-2 select-none">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition text-xs font-bold select-none cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersList;