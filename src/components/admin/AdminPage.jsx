
import { useState, useEffect } from "react";
import { adminAPI } from "../services/adminApi";
import AdminPlans from "./AdminAllPlan.jsx";
import AdminBlog from "../pages/AdminBlog.jsx";
import AdminFooter from "./AdminFooter.jsx";
import AdminReport from "../pages/AdminReport.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active section from URL
  const getActiveSectionFromURL = () => {
    const path = location.pathname;
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/settings")) return "settings";
    if (path.includes("/admin/logs")) return "logs";
    if (path.includes("/admin/plans")) return "plans";
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

  //We are getting Admin details from Localstorage :-
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
    <div className="flex h-screen bg-gray-100">
      {/* Use your new AdminSidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
                {activeSection}
              </h1>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
                Welcome, Admin
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminData");
                  window.location.href = "/#/";
                }}
                className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

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
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                User Management
              </h1>

              <div className="flex gap-4">
                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
                >
                  <option value="all">All Users</option>
                  <option value="in process">In Process</option>
                  <option value="approve">Approved</option>
                  <option value="on hold">On Hold</option>
                  <option value="deactivate">Deactivated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Mobile Cards View */}
                <div className="block sm:hidden">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.user_id || user.id}
                      className="p-4 border-b border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.first_name || user.last_name || "No Name"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {user.email}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                          ${
                            user.status === "approve"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : user.status === "in process"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : user.status === "on hold"
                                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                                  : user.status === "deactivate"
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {user.status
                            ? user.status.toUpperCase()
                            : "IN PROCESS"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        Profession: {user.profession || "Not specified"}
                      </div>
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profession
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.user_id || user.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.first_name || user.last_name || "No Name"}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.profession || "Not specified"}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              user.status === "approve"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : user.status === "in process"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  : user.status === "on hold"
                                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                                    : user.status === "deactivate"
                                      ? "bg-red-100 text-red-800 border border-red-200"
                                      : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {user.status
                              ? user.status.toUpperCase()
                              : "IN PROCESS"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
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
                    <p className="text-gray-500">No users found</p>
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                    System Security & Activity Logs
                  </h1>
                  <p className="text-slate-400 text-xs mt-1">
                    Real-time audit trail of user events, administrative actions, and API health
                  </p>
                </div>
                <button 
                  onClick={() => alert("Logs exported successfully!")}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-xs"
                >
                  <i className="fa-solid fa-download"></i>
                  Export Audit Log
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl shadow-lg border border-slate-900 font-mono text-[11px] overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                    live_terminal.log
                  </span>
                </div>

                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { timestamp: "2026-08-14 21:55:03", level: "INFO", category: "Auth", message: "User admin@intentionalconnection.com logged in successfully from 192.168.1.45" },
                    { timestamp: "2026-08-14 21:30:12", level: "WARN", category: "FaceAPI", message: "Face detection returned low confidence score (0.42) for image_id: 8931" },
                    { timestamp: "2026-08-14 21:04:45", level: "INFO", category: "Database", message: "Auto-cleanup of expired subscription tokens completed. 4 rows affected." },
                    { timestamp: "2026-08-14 20:45:22", level: "ERROR", category: "Payment", message: "Stripe webhook signature verification failed for event: evt_89412A" },
                    { timestamp: "2026-08-14 19:15:30", level: "INFO", category: "API", message: "GET /api/me/plan-status completed in 45ms for user: Shivam Likhar" },
                    { timestamp: "2026-08-14 18:22:11", level: "INFO", category: "System", message: "Auto-approve settings changed. Manual approval set to OFF." },
                    { timestamp: "2026-08-14 17:40:55", level: "WARN", category: "Chat", message: "WebSocket connection dropped unexpectedly by client: usr_77123" }
                  ].map((log, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 hover:bg-slate-900/60 p-1 rounded-lg transition duration-75">
                      <span className="text-slate-500 select-none shrink-0">{log.timestamp}</span>
                      <span className={`font-bold shrink-0 ${
                        log.level === "ERROR" ? "text-rose-500" :
                        log.level === "WARN" ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        [{log.level}]
                      </span>
                      <span className="text-slate-400 font-bold shrink-0">{log.category}:</span>
                      <span className="text-slate-300 break-all">{log.message}</span>
                    </div>
                  ))}
                </div>
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

        {activeSection === "reports" && (
          <div className="p-4 sm:p-6">
            <AdminReport />
          </div>
        )}
        
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminDashboard;































































