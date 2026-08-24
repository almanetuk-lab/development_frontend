
import { useState, useEffect } from "react";
import { adminAPI } from "../services/adminApi";
import AdminPlans from "./AdminAllPlan.jsx";
import AdminBlog from "../pages/AdminBlog.jsx";
import CreateArticle from "../pages/CreateArticle.jsx";
import EditArticle from "../pages/EditArticle.jsx";
import AdminFooter from "./AdminFooter.jsx";
import AdminReport from "../pages/AdminReport.jsx";
import UsersList from "../pages/UsersList.jsx";
import NotRenewedUsers from "../pages/NotRenewedUsers.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader.jsx";
import AdminModelDetails from "./AdminModelDetails.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Determine active section from URL
  const getActiveSectionFromURL = () => {
    const path = location.pathname;
    if (path.includes("/admin/users/")) {
      if (path.includes("/admin/users/not-renewed")) return "not_renewed";
      const parts = path.split("/");
      const param = parts[parts.length - 1];
      if (isNaN(Number(param))) {
        return "users_by_type";
      } else {
        return "user_details";
      }
    }
    if (path.includes("/admin/models/")) return "user_details";
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/settings")) return "settings";
    if (path.includes("/admin/logs")) return "logs";
    if (path.includes("/admin/plans")) return "plans";
    if (path.includes("/admin/blogs/create")) return "blogs_create";
    if (path.includes("/admin/blogs/edit")) return "blogs_edit";
    if (path.includes("/admin/blogs")) return "blogs";
    if (path.includes("/admin/reports")) return "reports";
    return "dashboard";
  };

  const [activeSection, setActiveSection] = useState(getActiveSectionFromURL());
  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [plans, setPlans] = useState([]);

  // for admin usestate//
  const [settingsLoading, setSettingsLoading] = useState(false);

  const [settings, setSettings] = useState({
    member_approval: 0,
    check_video_call_limit: 0,
    check_audio_call_limit: 0,
    check_search_limit: 0,
    check_message_limit: 0,
  });

  // Audit Logs States
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit] = useState(25);
  const [logFilterAction, setLogFilterAction] = useState("");
  const [logStartDate, setLogStartDate] = useState("");
  const [logEndDate, setLogEndDate] = useState("");
  const [logSearchUser, setLogSearchUser] = useState("");
  const [selectedLogDetails, setSelectedLogDetails] = useState(null);

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLogsLoading(true);
      const offset = (page - 1) * logsLimit;
      const params = {
        limit: logsLimit,
        offset,
        start_date: logStartDate || undefined,
        end_date: logEndDate || undefined,
        action: logFilterAction || undefined,
        user_id: logSearchUser || undefined,
      };
      const res = await adminAPI.getAuditLogs(params);
      if (res.data) {
        setLogs(res.data.logs || []);
        setLogsTotal(res.data.total || 0);
        setLogsPage(page);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleExportLogs = () => {
    try {
      const headers = ["Timestamp", "User ID", "User Email", "Action", "IP Address", "User Agent", "Details"];
      const rows = logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_id || "",
        log.user_email || "",
        log.action,
        log.ip_address || "",
        log.user_agent || "",
        log.details || ""
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `security_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export logs:", err);
    }
  };

  // We are getting Admin details from Localstorage :-
  let [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    let currUser = localStorage.getItem("adminData");
    currUser = JSON.parse(currUser);
    setLoggedInUser(currUser);
  }, []);

  // Update active section when URL changes
  useEffect(() => {
    setActiveSection(getActiveSectionFromURL());
  }, [location]);

  // autoapprove setting fetching here...
  useEffect(() => {
    if (activeSection === "settings") {
      fetchMemberApproval();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "logs") {
      fetchAuditLogs(1);
    }
  }, [activeSection, logFilterAction, logStartDate, logEndDate]);

  // Member_approval function end here ----

  //  FETCH CURRENT SETTING
  const fetchMemberApproval = async () => {
    try {
      const response = await adminAPI.getMemberApproval(); // GET API
      setSettings({
        member_approval: response.data.member_approval,
        check_video_call_limit: response.data.check_video_call_limit,
        check_audio_call_limit: response.data.check_audio_call_limit,
        check_search_limit: response.data.check_search_limit,
        check_message_limit: response.data.check_message_limit,
      });
    } catch (error) {
      console.error("Failed to fetch setting", error);
    }
  };

  //  UPDATE SETTING (ON / OFF)
  const updateSetting = async (key, value) => {
    try {
      setSettingsLoading(true);

      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);

      await adminAPI.updateMemberApproval(updatedSettings); // PUT API
    } catch (error) {
      console.error("Failed to update setting:", error);
      alert("Failed to update setting");
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();

      if (response.data.status === "success") {
        let dataToUse = [];

        if (response.data.userDetails && response.data.userDetails.length > 0) {
          dataToUse = response.data.userDetails;
        } else if (response.data.users && response.data.users.length > 0) {
          dataToUse = response.data.users;
        }

        // Normalize status to lowercase for consistency
        const usersWithNormalizedStatus = dataToUse.map((user) => ({
          ...user,
          status: (
            user.status ||
            user.current_status ||
            "in process"
          ).toLowerCase(),
          current_status: (
            user.current_status ||
            user.status ||
            "in process"
          ).toLowerCase(),
        }));

        setUsersData(usersWithNormalizedStatus);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(
        "Error fetching users: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      setUserDetailsLoading(true);
      const response = await adminAPI.getUserDetails(userId);

      if (response.data.status === "success") {
        const userData = response.data.user;
        // Normalize status for detailed user as well
        const normalizedUser = {
          ...userData,
          status: (
            userData.status ||
            userData.current_status ||
            "in process"
          ).toLowerCase(),
          current_status: (
            userData.current_status ||
            userData.status ||
            "in process"
          ).toLowerCase(),
        };
        setSelectedUser(normalizedUser);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert(
        "Error fetching user details: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // Filter users based on status
  const filteredUsers = usersData.filter((user) => {
    if (userStatusFilter === "all") return true;
    return user.status === userStatusFilter;
  });

  const handleViewDetails = (user) => {
    const userId = user.user_id || user.id;
    navigate(`/admin/models/${userId}`);
  };

  // Stats calculations
  const totalUsers = usersData.length;
  const inProcessUsers = usersData.filter(
    (u) => u.status === "in process",
  ).length;
  const approvedUsers = usersData.filter((u) => u.status === "approve").length;
  const onHoldUsers = usersData.filter((u) => u.status === "on hold").length;
  const deactivatedUsers = usersData.filter(
    (u) => u.status === "deactivate",
  ).length;

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Use your new AdminSidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 relative">
        <AdminHeader
          activeSection={activeSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-grow">

        {/* Main Content */}
        {activeSection === "dashboard" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-semibold">
                Overview of member onboarding status and system activity metrics
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
              {[
                { title: "Total Users", value: totalUsers, icon: "fa-solid fa-users", bg: "bg-blue-50 border-blue-100", iconColor: "text-[#002060]", valColor: "text-[#002060]" },
                { title: "In Process", value: inProcessUsers, icon: "fa-solid fa-hourglass-half", bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-600", valColor: "text-amber-700" },
                { title: "Approved", value: approvedUsers, icon: "fa-solid fa-circle-check", bg: "bg-emerald-50 border-emerald-100", iconColor: "text-emerald-600", valColor: "text-emerald-700" },
                { title: "On Hold", value: onHoldUsers, icon: "fa-solid fa-circle-pause", bg: "bg-orange-50 border-orange-100", iconColor: "text-orange-600", valColor: "text-orange-700" },
                { title: "Deactivated", value: deactivatedUsers, icon: "fa-solid fa-user-slash", bg: "bg-rose-50 border-rose-100", iconColor: "text-rose-600", valColor: "text-rose-700" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50/80 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="relative z-10">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {stat.title}
                    </h3>
                    <p className={`text-3xl font-black ${stat.valColor}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`relative z-10 w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center text-base ${stat.iconColor}`}>
                    <i className={stat.icon}></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Lower Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity Feed */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-[#002060]"></i>
                    Recent Platform Events
                  </h3>
                  <span className="px-2.5 py-1 bg-blue-50 text-[#002060] text-[9px] font-black rounded-full uppercase tracking-wider">
                    Live Feed
                  </span>
                </div>
                
                <div className="space-y-4">
                  {[
                    { type: "user", text: "New member registration pending approval", time: "Just now", icon: "fa-user-plus", color: "bg-blue-50 text-blue-600" },
                    { type: "approve", text: "Approved profile: Shivam Likhar", time: "2 hours ago", icon: "fa-check", color: "bg-emerald-50 text-emerald-600" },
                    { type: "plan", text: "Subscription plan 'Platinum Elite' updated", time: "4 hours ago", icon: "fa-gem", color: "bg-pink-50 text-pink-600" },
                    { type: "system", text: "Member approval auto-approve mode enabled", time: "1 day ago", icon: "fa-gear", color: "bg-slate-50 text-slate-600" }
                  ].map((act, idx) => (
                    <div key={idx} className="flex gap-4 p-3 hover:bg-slate-50/60 rounded-xl transition duration-150">
                      <div className={`w-9 h-9 rounded-lg ${act.color} flex items-center justify-center text-xs shrink-0`}>
                        <i className={`fa-solid ${act.icon}`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-700">{act.text}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-[#FF2A6D]"></i>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => navigate("/admin/plans")}
                    className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition"
                  >
                    <span>Manage Subscription Plans</span>
                    <i className="fa-solid fa-chevron-right text-slate-400"></i>
                  </button>
                  <button 
                    onClick={() => navigate("/admin/users")}
                    className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition"
                  >
                    <span>Pending User Reviews</span>
                    <i className="fa-solid fa-chevron-right text-slate-400"></i>
                  </button>
                  <button 
                    onClick={() => navigate("/admin/settings")}
                    className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition"
                  >
                    <span>Adjust Approval Settings</span>
                    <i className="fa-solid fa-chevron-right text-slate-400"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "users" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800">
                  User Management
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-semibold">
                  Review and verify registered user profiles and set approval statuses
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Status Filter:</label>
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D] focus:border-transparent text-xs font-bold text-slate-700 w-full sm:w-auto shadow-sm outline-none transition-all cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="in process">In Process</option>
                  <option value="approve">Approved</option>
                  <option value="on hold">On Hold</option>
                  <option value="deactivate">Deactivated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-[#FF2A6D]"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                {/* Mobile Cards View */}
                <div className="block sm:hidden divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.user_id || user.id}
                      className="p-5 hover:bg-slate-50/50 transition duration-150"
                    >
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 select-none uppercase">
                            {user.first_name?.[0] || user.last_name?.[0] || "?"}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.first_name || user.last_name || "No Name"}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full border
                          ${
                            user.status === "approve"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : user.status === "in process"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : user.status === "on hold"
                                  ? "bg-orange-50 text-orange-700 border-orange-100"
                                  : user.status === "deactivate"
                                    ? "bg-rose-50 text-rose-700 border-rose-100"
                                    : "bg-slate-50 text-slate-700 border-slate-100"
                          }`}
                        >
                          {user.status || "IN PROCESS"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                        <span className="font-semibold text-slate-400">Profession:</span> {user.profession || "Not specified"}
                      </div>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="w-full bg-[#002060] text-white py-2.5 rounded-xl hover:bg-[#001740] transition font-bold text-xs uppercase tracking-wider"
                      >
                        View Profile Details
                      </button>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-400 text-xs font-semibold">No users found</p>
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <table className="hidden sm:table min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/70">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Name
                      </th>
                      <th className="px-6 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Email
                      </th>
                      <th className="px-6 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Profession
                      </th>
                      <th className="px-6 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.user_id || user.id}
                        className="hover:bg-slate-50/55 transition duration-100"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-xs font-bold text-slate-600 select-none uppercase">
                              {user.first_name?.[0] || user.last_name?.[0] || "?"}
                            </div>
                            <div className="text-sm font-bold text-slate-800">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.first_name || user.last_name || "No Name"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs font-semibold text-slate-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-slate-600 font-medium">
                            {user.profession || "Not specified"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-[9px] font-black uppercase tracking-wider rounded-full border
                            ${
                              user.status === "approve"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : user.status === "in process"
                                  ? "bg-amber-50 text-amber-700 border-amber-100"
                                  : user.status === "on hold"
                                    ? "bg-orange-50 text-orange-700 border-orange-100"
                                    : user.status === "deactivate"
                                      ? "bg-rose-50 text-rose-700 border-rose-100"
                                      : "bg-slate-50 text-slate-700 border-slate-100"
                            }`}
                          >
                            {user.status || "IN PROCESS"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="bg-[#002060] hover:bg-[#001740] text-white px-4 py-2 rounded-xl transition-all duration-150 font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="hidden sm:block text-center py-8">
                    <p className="text-slate-400 text-xs font-semibold">No users found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === "settings" && (
          <div className="p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                    System Control Settings
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Toggle feature limits and core platform manual/auto policies
                  </p>
                </div>
                {settingsLoading && (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-[#002060] rounded-xl text-xs font-semibold animate-pulse border border-blue-100">
                    <div className="w-3.5 h-3.5 border-2 border-[#002060] border-t-transparent rounded-full animate-spin"></div>
                    Saving Changes...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: "member_approval", label: "Manual Member Approval", desc: "Require manual administrator approval before new profiles go public", icon: "fa-solid fa-user-check" },
                  { key: "check_video_call_limit", label: "Video Call Limit", desc: "Enforce video call duration or count limits based on user subscription level", icon: "fa-solid fa-video" },
                  { key: "check_audio_call_limit", label: "Audio Call Limit", desc: "Enforce audio call limits and restrict access based on active plan", icon: "fa-solid fa-phone" },
                  { key: "check_search_limit", label: "People Search Limit", desc: "Apply limitations to search frequency and advanced filters search", icon: "fa-solid fa-magnifying-glass" },
                  { key: "check_message_limit", label: "People Message Limit", desc: "Limit the daily number of direct messages sent to new connections", icon: "fa-solid fa-envelope" },
                ].map((item) => (
                  <div key={item.key} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between hover:border-slate-200 transition duration-200">
                    <div className="flex gap-4 items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center text-sm shrink-0 border border-slate-100/50">
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">{item.label}</h3>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${settings[item.key] === 1 ? 'text-pink-600' : 'text-slate-400'}`}>
                        {settings[item.key] === 1 ? "Active" : "Bypassed"}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings[item.key] === 1}
                          onChange={(e) => updateSetting(item.key, e.target.checked ? 1 : 0)}
                          disabled={settingsLoading}
                        />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-[#FF2A6D] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "logs" && (
          <div className="p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                    System Security & Activity Logs
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Real-time audit trail of user events, administrative actions, and API health
                  </p>
                </div>
                <button 
                  onClick={handleExportLogs}
                  disabled={logs.length === 0}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <i className="fa-solid fa-download"></i>
                  Export Audit Log (CSV)
                </button>
              </div>

              {/* Filters Panel */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs mb-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={logStartDate}
                      onChange={(e) => setLogStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={logEndDate}
                      onChange={(e) => setLogEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Action Type
                    </label>
                    <select
                      value={logFilterAction}
                      onChange={(e) => setLogFilterAction(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition cursor-pointer"
                    >
                      <option value="">All Actions</option>
                      <option value="SEARCH_BASIC">Basic Search</option>
                      <option value="SEARCH_ADVANCED">Advanced Search</option>
                      <option value="SEARCH_NEARME">Near Me Search</option>
                      <option value="CHAT_SEND">Chat Message Sent</option>
                      <option value="CHAT_REACTION">Reaction Added</option>
                      <option value="CHAT_DELETE">Message Deleted</option>
                      <option value="PROFILE_VIEW">Profile Viewed</option>
                      <option value="PROFILE_EDIT">Profile Updated</option>
                      <option value="AI_AGENT_TOGGLE">AI Settings Updated</option>
                      <option value="AI_AGENT_RESPONSE">AI Twin Automated Chat</option>
                      <option value="PLAN_CREATE">Plan Created</option>
                      <option value="PLAN_UPDATE">Plan Updated</option>
                      <option value="PLAN_TOGGLE_STATUS">Plan Status Toggle</option>
                      <option value="USER_APPROVE">User Approved</option>
                      <option value="USER_HOLD">User Put on Hold</option>
                      <option value="USER_DEACTIVATE">User Deactivated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      User Search
                    </label>
                    <input
                      type="text"
                      placeholder="User ID..."
                      value={logSearchUser}
                      onChange={(e) => setLogSearchUser(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-slate-400 transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-1">
                  {(logStartDate || logEndDate || logFilterAction || logSearchUser) && (
                    <button
                      onClick={() => {
                        setLogStartDate("");
                        setLogEndDate("");
                        setLogFilterAction("");
                        setLogSearchUser("");
                        setTimeout(() => fetchAuditLogs(1), 0);
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                  <button
                    onClick={() => fetchAuditLogs(1)}
                    className="px-5 py-2.5 bg-[#002060] hover:bg-opacity-95 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Logs Table / Cards Wrapper */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
                {logsLoading ? (
                  <div className="p-12 text-center text-slate-500 font-semibold text-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002060] mx-auto mb-3"></div>
                    Loading audit trail...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 font-semibold text-sm">
                    <i className="fa-solid fa-terminal text-2xl block mb-2 text-slate-300"></i>
                    No audit logs found for the selected criteria.
                  </div>
                ) : (
                  <div>
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200/50">
                            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Date / Time</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client metadata</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition duration-75">
                              <td className="px-6 py-4.5 text-xs font-semibold text-slate-600">
                                {new Date(log.created_at).toLocaleString()}
                              </td>
                              <td className="px-6 py-4.5">
                                {log.user_id ? (
                                  <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700">
                                      {log.first_name ? `${log.first_name} ${log.last_name}` : `User #${log.user_id}`}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">{log.user_email}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs font-bold text-slate-400 italic">System / Public</span>
                                )}
                              </td>
                              <td className="px-6 py-4.5">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  log.action.startsWith("CHAT_") ? "bg-cyan-50 text-cyan-600 border border-cyan-100" :
                                  log.action.startsWith("PLAN_") ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                  log.action.startsWith("USER_") ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                  log.action.startsWith("AI_") ? "bg-violet-50 text-violet-600 border border-violet-100" :
                                  "bg-slate-50 text-slate-500 border border-slate-100"
                                }`}>
                                  {log.action.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="px-6 py-4.5">
                                <div className="flex flex-col gap-0.5 text-[10px] font-semibold text-slate-500 max-w-[180px] truncate">
                                  <span>IP: <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.2 rounded">{log.ip_address || "Localhost"}</code></span>
                                  <span className="truncate text-slate-400" title={log.user_agent}>{log.user_agent || "N/A"}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4.5 text-right">
                                {log.details ? (
                                  <button
                                    onClick={() => {
                                      try {
                                        setSelectedLogDetails(JSON.parse(log.details));
                                      } catch (e) {
                                        setSelectedLogDetails(log.details);
                                      }
                                    }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                                  >
                                    Inspect
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-350 italic">None</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE CARDS VIEW */}
                    <div className="block md:hidden divide-y divide-slate-100">
                      {logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-slate-50/50 transition duration-75">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                              log.action.startsWith("CHAT_") ? "bg-cyan-50 text-cyan-600 border border-cyan-100" :
                              log.action.startsWith("PLAN_") ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              log.action.startsWith("USER_") ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                              log.action.startsWith("AI_") ? "bg-violet-50 text-violet-600 border border-violet-100" :
                              "bg-slate-50 text-slate-500 border border-slate-100"
                            }`}>
                              {log.action.replace(/_/g, " ")}
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-400">
                              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wide">User:</span>
                              <span className="text-slate-800 font-bold text-right text-xs">
                                {log.user_id ? (log.first_name ? `${log.first_name} ${log.last_name}` : `User #${log.user_id}`) : "System / Public"}
                              </span>
                            </div>

                            {log.user_email && (
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wide">Email:</span>
                                <span className="text-slate-500 font-medium break-all text-right text-[11px]">{log.user_email}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center gap-4">
                              <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wide">IP Address:</span>
                              <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.2 rounded text-[10px]">{log.ip_address || "Localhost"}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-bold">
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                            {log.details ? (
                              <button
                                onClick={() => {
                                  try {
                                    setSelectedLogDetails(JSON.parse(log.details));
                                  } catch (e) {
                                    setSelectedLogDetails(log.details);
                                  }
                                }}
                                className="px-4.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                              >
                                Inspect Details
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-300 italic">No details</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {logsTotal > logsLimit && (
                      <div className="p-4 bg-slate-50 border-t border-slate-200/50 flex items-center justify-between">
                        <button
                          onClick={() => fetchAuditLogs(logsPage - 1)}
                          disabled={logsPage === 1 || logsLoading}
                          className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer bg-white"
                        >
                          Previous
                        </button>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest text-center px-2">
                          Page {logsPage} of {Math.ceil(logsTotal / logsLimit)} ({logsTotal} logs)
                        </span>
                        <button
                          onClick={() => fetchAuditLogs(logsPage + 1)}
                          disabled={logsPage === Math.ceil(logsTotal / logsLimit) || logsLoading}
                          className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer bg-white"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "plans" && (
          <AdminPlans
            editingId={editingId}
            setEditingId={setEditingId}
            plans={plans}
            setPlans={setPlans}
          />
        )}

        {activeSection === "blogs" && (
          <div className="p-4 sm:p-6">
            {loggedInUser && <AdminBlog user={loggedInUser} />}
          </div>
        )}

        {activeSection === "blogs_create" && (
          <div className="p-4 sm:p-6">
            <CreateArticle user={loggedInUser} />
          </div>
        )}

        {activeSection === "blogs_edit" && (
          <div className="p-4 sm:p-6">
            <EditArticle user={loggedInUser} />
          </div>
        )}

        {activeSection === "user_details" && (
          <div className="p-4 sm:p-6">
            <AdminModelDetails />
          </div>
        )}

        {activeSection === "users_by_type" && (
          <div className="p-4 sm:p-6">
            <UsersList />
          </div>
        )}

        {activeSection === "not_renewed" && (
          <div className="p-4 sm:p-6">
            <NotRenewedUsers />
          </div>
        )}

        {activeSection === "reports" && (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <AdminReport />
          </div>
        )}
          </div>
          <AdminFooter />
        </div>
      </div>
      {selectedLogDetails && (
        <div className="fixed inset-0 overflow-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-5 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 my-6 border border-slate-100/80">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-800 tracking-tight">Audit Log Details</h3>
              <button onClick={() => setSelectedLogDetails(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[300px]">
              <pre>{JSON.stringify(selectedLogDetails, null, 2)}</pre>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setSelectedLogDetails(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;































































