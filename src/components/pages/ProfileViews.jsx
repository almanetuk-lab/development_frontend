import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import profileViewApi from "../services/profileViewApi";

const ProfileViews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("tab") || "overview";

  const [allViewers, setAllViewers] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    todayViews: 0,
    uniqueViewers: 0,
  });

  // Get user ID
  const getUserId = () => {
    try {
      const user = localStorage.getItem("currentUser");
      if (user) {
        const userData = JSON.parse(user);
        return userData.user_id || userData.id || "135";
      }
      const storedUserId = localStorage.getItem("userId");
      return storedUserId || "135";
    } catch {
      return "135";
    }
  };

  const userId = getUserId();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const dashboardData = await profileViewApi.getDashboardSummary(userId);

      setAllViewers(dashboardData.recent_viewers || []);
      setStats({
        totalViews: dashboardData.profile_views || 0,
        todayViews: dashboardData.today_viewers || 0,
        uniqueViewers:
          new Set(dashboardData.recent_viewers?.map((v) => v.viewer_id)).size ||
          0,
      });

      setUserProfile(dashboardData.user_profile || {});
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // Fallback
      try {
        const viewersResponse = profileViewApi.getRecentViewers(userId);

        if (viewersResponse.newViewers) {
          setAllViewers(viewersResponse.newViewers);

          const today = new Date().toDateString();
          const todayViews = viewersResponse.newViewers.filter((v) => {
            if (!v.viewed_at) return false;
            const viewDate = new Date(v.viewed_at).toDateString();
            return viewDate === today;
          }).length;

          const uniqueViewers = new Set(
            viewersResponse.newViewers.map((v) => v.viewer_id)
          ).size;

          setStats({
            totalViews:
              viewersResponse.newViewersCount ||
              viewersResponse.newViewers.length,
            todayViews: todayViews,
            uniqueViewers: uniqueViewers,
          });
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  

  // ProfileViews.jsx में
  const handleViewerClick = (viewerProfile) => {
    // viewerProfile = API से आया object
    // viewerProfile.user_id = जिस user ने मेरा profile देखा

    const viewerUserId = viewerProfile.user_id; // ✅ यही सही ID है

    console.log("Viewer User ID:", viewerUserId);
    console.log("Viewer Name:", viewerProfile.first_name);

    navigate(`/dashboard/profile/${viewerUserId}`, {
      state: {
        userProfile: viewerProfile, // ✅ यही key ProfilePage में check होगी
        from: "profile_views",
      },
    });
  };


  useEffect(() => {
    if (userId && userId !== "null") {
      fetchDashboardData();
    }
  }, [userId]);

  // Tabs
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "recent", label: "Recent Views" },
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profile Views Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Track who viewed your profile and when
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">Total Views</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {loading ? "..." : stats.totalViews}
            </p>
            <p className="text-sm text-gray-500 mt-1">All time profile views</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Today's Views
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {loading ? "..." : stats.todayViews}
            </p>
            <p className="text-sm text-gray-500 mt-1">Views in last 24 hours</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Unique Viewers
            </h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {loading ? "..." : stats.uniqueViewers}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Different people who viewed
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigate(`/profile-views?tab=${tab.id}`)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "recent" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Recent Viewers
                  </h3>
                  <span className="text-sm text-gray-500">
                    {loading ? "..." : `${allViewers.length} viewers`}
                  </span>
                </div>

                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : allViewers.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-gray-400 text-5xl mb-4">👀</div>
                    <p className="text-gray-500 text-lg">
                      No one has viewed your profile yet
                    </p>
                    <p className="text-gray-400 mt-2">
                      Share your profile to get more views!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allViewers.map((viewer, index) => {
                      // Get viewer name
                      const firstName =
                        viewer.first_name || viewer.name?.split(" ")[0] || "";
                      const lastName =
                        viewer.last_name || viewer.name?.split(" ")[1] || "";

                      const fullName =
                        firstName && lastName
                          ? `${firstName} ${lastName}`
                          : firstName ||
                            lastName ||
                            `User #${
                              viewer.viewer_id ||
                              viewer.id ||
                              viewer.user_id ||
                              index
                            }`;

                      const firstLetter = firstName
                        ? firstName.charAt(0).toUpperCase()
                        : lastName
                        ? lastName.charAt(0).toUpperCase()
                        : "U";

                      return (
                        <div
                          key={viewer.id || `viewer-${index}`}
                          onClick={() => handleViewerClick(viewer)}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-lg">
                                {firstLetter}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {fullName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Viewed {formatDate(viewer.viewed_at)}
                              </p>
                              {viewer.profession && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {viewer.profession}
                                </p>
                              )}
                              {/* Debug info */}
                              <p className="text-xs text-gray-400 mt-1">
                                ID:{" "}
                                {viewer.viewer_id ||
                                  viewer.id ||
                                  viewer.user_id}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => handleViewerClick(viewer)}
                              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition text-sm font-medium"
                            >
                              View Profile
                            </button>

                            {/* <span className="text-blue-600 font-medium hover:underline">
                             
                             View Profile →
                            </span> */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "overview" && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Overview
                </h3>
                {userProfile && Object.keys(userProfile).length > 0 ? (
                  <>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Your Profile Info
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {userProfile.email || "Not available"}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Status:</span>{" "}
                            {userProfile.status || "Active"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Member since:</span>{" "}
                            {userProfile.created_at
                              ? new Date(
                                  userProfile.created_at
                                ).toLocaleDateString("en-IN")
                              : "N/A"}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Last updated:</span>{" "}
                            {userProfile.updated_at
                              ? new Date(
                                  userProfile.updated_at
                                ).toLocaleDateString("en-IN")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        View Analytics
                      </h4>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-blue-700">
                          <span className="font-bold">{stats.todayViews}</span>{" "}
                          profile views today
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                          Your profile is getting attention! Keep your profile
                          updated for more views.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Loading profile information...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViews;






