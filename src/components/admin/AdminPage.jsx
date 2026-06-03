
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
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              Admin Dashboard
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                { title: "Total Users", value: totalUsers, color: "blue" },
                { title: "In Process", value: inProcessUsers, color: "yellow" },
                { title: "Approved", value: approvedUsers, color: "green" },
                { title: "On Hold", value: onHoldUsers, color: "orange" },
                { title: "Deactivated", value: deactivatedUsers, color: "red" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-700">
                    {stat.title}
                  </h3>
                  <p
                    className={`text-2xl sm:text-3xl font-bold text-${stat.color}-600 mt-1 sm:mt-2`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Recent Activity
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Welcome to Admin Panel
              </p>
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
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                System Settings
              </h3>
              {/* MEMBER APPROVAL TOGGLE */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Member Approval</p>
                  <p className="text-sm text-gray-500">
                    Enable or disable manual member approval
                  </p>
                </div>

                {/* TOGGLE BUTTON */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.member_approval === 1}
                    onChange={(e) =>
                      updateSetting("member_approval", e.target.checked ? 1 : 0)
                    }
                    disabled={settingsLoading}
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:bg-white after:rounded-full after:h-5 after:w-5 
              after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>

              {/* LOADING TEXT */}
              {settingsLoading && (
                <p className="text-sm text-gray-400 mt-2">
                  Updating setting...
                </p>
              )}

              <hr className="my-6" />

              {/* VIDEO CALL LIMIT */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Video Call Limit</p>
                  <p className="text-sm text-gray-500">
                    Enable or disable video call limit
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.check_video_call_limit === 1}
                    onChange={(e) =>
                      updateSetting(
                        "check_video_call_limit",
                        e.target.checked ? 1 : 0,
                      )
                    }
                    disabled={settingsLoading}
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 
      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
      after:bg-white after:rounded-full after:h-5 after:w-5 
      after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>

              <hr className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    People Search Limit
                  </p>
                  <p className="text-sm text-gray-500">
                    Enable or disable people search limit
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.check_search_limit === 1}
                    onChange={(e) =>
                      updateSetting(
                        "check_search_limit",
                        e.target.checked ? 1 : 0,
                      )
                    }
                    disabled={settingsLoading}
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>

              <hr className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">
                    People Message Limit
                  </p>
                  <p className="text-sm text-gray-500">
                    Enable or disable people message limit
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.check_message_limit === 1}
                    onChange={(e) =>
                      updateSetting(
                        "check_message_limit",
                        e.target.checked ? 1 : 0,
                      )
                    }
                    disabled={settingsLoading}
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>

              <hr className="my-6" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Audio Call Limit</p>
                  <p className="text-sm text-gray-500">
                    Enable or disable audio call limit
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.check_audio_call_limit === 1}
                    onChange={(e) =>
                      updateSetting(
                        "check_audio_call_limit",
                        e.target.checked ? 1 : 0,
                      )
                    }
                    disabled={settingsLoading}
                  />
                  <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600
      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
      after:bg-white after:rounded-full after:h-5 after:w-5
      after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeSection === "logs" && (
          <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              System Logs
            </h1>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                Activity Logs
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                System logs and activities will be displayed here.
              </p>
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































































