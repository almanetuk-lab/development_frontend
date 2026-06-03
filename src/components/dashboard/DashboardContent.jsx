// src/components/dashboard/DashboardHome.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "../comman/StatCard";
import ActivityItem from "../comman/ActivityItem";
import QuickAction from "../comman/QuickAction";
import SuggestedMatches from "../MatchSystem/SuggetionMatches";
import { chatApi } from "../services/chatApi";
import { getSuggestedMatches } from "../services/chatApi";
import profileViewApi from "../services/profileViewApi";

export default function DashboardHome({ profile }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for dynamic data
  const [profileViews, setProfileViews] = useState(0);
  const [recentViewers, setRecentViewers] = useState([]);
  const [totalViewers, setTotalViewers] = useState(0);
  const [matchesCount, setMatchesCount] = useState();
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);

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

  // // Fetch dashboard data
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     const dashboardSummary = await profileViewApi.getDashboardSummary(userId);

  //     console.log("📊 Dashboard summary:", dashboardSummary);

  //     setProfileViews(dashboardSummary.profile_views || 0);
  //     setRecentViewers(dashboardSummary.recent_viewers || []);
  //     setTotalViewers(dashboardSummary.today_viewers || 0);
  //     setMessagesCount(dashboardSummary.messages_count || 0);

  //     if (dashboardSummary.matches_count !== undefined) {
  //       setMatchesCount(dashboardSummary.matches_count);
  //     }
  //     if (dashboardSummary.connections_count !== undefined) {
  //       setConnectionsCount(dashboardSummary.connections_count);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //  UPDATED: Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("📊 Fetching dashboard data...");

      // First, fetch matches count (important)
      await fetchMatchesCount();

      // Then fetch dashboard summary
      try {
        const dashboardSummary =
          await profileViewApi.getDashboardSummary(userId);
        console.log("📊 Dashboard summary:", dashboardSummary);

        setProfileViews(dashboardSummary.profile_views || 0);
        setRecentViewers(dashboardSummary.recent_viewers || []);
        setTotalViewers(dashboardSummary.today_viewers || 0);
        setMessagesCount(dashboardSummary.messages_count || 0);

        //  Override with dashboard matches count if available
        if (
          dashboardSummary.matches_count !== undefined &&
          dashboardSummary.matches_count !== null &&
          dashboardSummary.matches_count > 0
        ) {
          console.log(
            `📊 Using matches count from dashboard: ${dashboardSummary.matches_count}`,
          );
          setMatchesCount(dashboardSummary.matches_count);
        }

        if (dashboardSummary.connections_count !== undefined) {
          setConnectionsCount(dashboardSummary.connections_count);
        }
      } catch (dashboardError) {
        console.error("❌ Dashboard summary error:", dashboardError);
        // Continue with matches count from fetchMatchesCount
      }
    } catch (error) {
      console.error("❌ Error in fetchDashboardData:", error);
    } finally {
      setLoading(false);
    }
  };

  // Separate function for real-time messages update
  const fetchUnreadMessages = async () => {
    try {
      const count = await profileViewApi.getUnreadMessagesCount(userId);
      setMessagesCount(count);
      console.log("📩 Unread messages count:", count);
    } catch (error) {
      console.error("Failed to fetch unread messages:", error);
      setMessagesCount(0);
    }
  };

  // Handle clicks
  const handleProfileViewsClick = () => {
    navigate("/profile-views");
  };

  const handleRecentActivityClick = () => {
    navigate("/profile-views?tab=recent");
  };

  // Calculate time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";

    const now = new Date();
    const viewTime = new Date(timestamp);
    const diffMs = now - viewTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return viewTime.toLocaleDateString();
  };

  // Handle viewer click
  const handleViewerClick = (viewerId) => {
    if (viewerId) {
      navigate(`/user-profile/${viewerId}`);
    }
  };

  useEffect(() => {
    if (userId && userId !== "null") {
      fetchDashboardData();

      // Refresh messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadMessages();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  // // Fetch matches
  // useEffect(() => {
  //   fetchMatches();
  // }, []);

  // const fetchMatches = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getSuggestedMatches();

  //     let matchesArray = [];
  //     if (Array.isArray(data)) {
  //       matchesArray = data;
  //     } else if (data && typeof data === "object") {
  //       if (data.id) {
  //         matchesArray = [data];
  //       } else if (data.data) {
  //         matchesArray = Array.isArray(data.data) ? data.data : [data.data];
  //       }
  //     }

  //     const limitedMatches = matchesArray.slice(0, 5);
  //     setSuggestedMatches(limitedMatches);
  //   } catch (err) {
  //     console.error("Error fetching matches:", err);
  //     setError("Failed to load matches. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Retry button ke liye
  // const handleRetry = () => {
  //   fetchMatches();
  // };

  //  NEW FUNCTION: Fetch matches count from getSuggestedMatches
  const fetchMatchesCount = async () => {
    try {
      console.log("🔄 Fetching matches count from getSuggestedMatches...");

      // Get matches data
      const matchesData = await getSuggestedMatches();
      console.log("📊 Matches data for count:", matchesData);

      let matchesArray = [];

      // Handle different response formats
      if (Array.isArray(matchesData)) {
        matchesArray = matchesData;
      } else if (
        matchesData &&
        matchesData.data &&
        Array.isArray(matchesData.data)
      ) {
        matchesArray = matchesData.data;
      } else if (
        matchesData &&
        matchesData.matches &&
        Array.isArray(matchesData.matches)
      ) {
        matchesArray = matchesData.matches;
      } else if (
        matchesData &&
        matchesData.users &&
        Array.isArray(matchesData.users)
      ) {
        matchesArray = matchesData.users;
      }

      const count = matchesArray.length;
      console.log(`✅ Found ${count} matches`);

      // Update state
      setMatchesCount(count);
      return count;
    } catch (error) {
      console.error("❌ Error fetching matches count:", error);
      // Fallback to default 20
      setMatchesCount();
      return;
    }
  };

  // Search users function
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await chatApi.searchUsers(query);
      console.log("Search results:", response.data);
      // console.log("Search API Response:", response.data);

      const currentUserId = profile?.id || profile?.user_id;
      const filteredResults = (response.data || []).filter(
        (user) => user.id !== currentUserId,
      );

      setSearchResults(filteredResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Search effect with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // // Handle user selection from search
  // const handleUserSelectFromSearch = (user) => {
  //   console.log("Selected user from search:", user);
  //   navigate("/dashboard/messages");
  //   setSearchQuery("");
  //   setShowSearchResults(false);
  // };

  // // Close search results when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (!event.target.closest(".search-container")) {
  //       setShowSearchResults(false);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => document.removeEventListener("click", handleClickOutside);
  // }, []);

  // Handle user selection from search
  const handleUserSelectFromSearch = (user) => {
    console.log("Selected user from search:", user);

    // ✅ State ke through user data pass karein
    navigate("/dashboard/messages", {
      state: {
        selectedUser: {
          id: user.id,
          name:
            user.name ||
            `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email,
          // Additional fields agar chahiye
          city: user.city,
          profession: user.profession,
        },
      },
    });

    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header */}
        <header className="hidden lg:block bg-white shadow-sm p-6 border-b border-gray-200 mb-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 truncate">
                Welcome back,{" "}
                <span className="text-[#FF66CC]">
                  {profile?.first_name ||
                    profile?.last_name?.split(" ")[0] ||
                    profile?.name?.split(" ")[0] ||
                    "User"}
                  !
                </span>
              </h1>
              <p className="text-gray-600 text-sm lg:text-base">
                Ready to find your perfect match?
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full lg:w-96 flex-shrink-0 search-container">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by User Name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim() && searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  className="w-full px-4 lg:px-5 py-3 lg:py-4 pl-10 lg:pl-12 pr-10 border border-gray-300 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition text-sm lg:text-base"
                />
                <span className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                  🔍
                </span>

                {searchLoading && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  </div>
                )}

                {searchQuery && !searchLoading && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    ✕
                  </button>
                )}

                {/* Search Results Dropdown with Profile Images */}
                {showSearchResults && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((user) => (
                          <div
                            key={user.id || user.user_id}
                            onClick={() => handleUserSelectFromSearch(user)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-b-0"
                          >
                            {/* Profile Image with Fallback */}
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  user.image_url && user.image_url !== ""
                                    ? user.image_url.startsWith("http")
                                      ? user.image_url
                                      : `${import.meta.env.VITE_API_BASE_URL}${user.image_url}`
                                    : `https://ui-avatars.com/api/?name=${
                                        user.name || user.first_name || "User"
                                      }+${
                                        user.last_name || ""
                                      }&background=6366f1&color=fff&bold=true`
                                }
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${
                                    user.name || user.first_name || "User"
                                  }+${
                                    user.last_name || ""
                                  }&background=6366f1&color=fff&bold=true`;
                                }}
                                alt="profile"
                                className="w-10 h-10 rounded-xl object-cover"
                              />
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate text-sm">
                                {user.name ||
                                  `${user.first_name || ""} ${
                                    user.last_name || ""
                                  }`.trim() ||
                                  "User"}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {user.profession || user.email || "No info"}
                              </p>
                              {user.city && (
                                <p className="text-xs text-gray-500 truncate">
                                  📍 {user.city}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No users found</p>
                        <p className="text-xs mt-1">
                          Try different search terms
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200 mb-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800 mb-1 truncate">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {profile?.full_name?.split(" ")[0] ||
                    profile?.name?.split(" ")[0] ||
                    "User"}
                  !
                </span>
              </h1>
              <p className="text-gray-600 text-sm">Find your perfect match</p>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="relative search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => {
                if (searchQuery.trim() && searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
              className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition text-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>

            {searchLoading && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {searchQuery && !searchLoading && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            )}

            {/* Mobile Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelectFromSearch(user)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {user.name?.charAt(0)?.toUpperCase() ||
                            user.first_name?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate text-sm">
                            {user.name ||
                              `${user.first_name || ""} ${
                                user.last_name || ""
                              }`.trim() ||
                              "User"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user.profession || user.email || "No info"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No users found</p>
                    <p className="text-xs mt-1">Try different search terms</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Your Profile
                </h2>
                <div className="flex gap-2">
                  <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-600 text-xs sm:text-sm rounded-full font-medium">
                    Active
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 text-xs sm:text-sm rounded-full font-medium">
                    Verified
                  </span>
                </div>
              </div>

              {/* Profile Header */}
              <div className="flex flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {profile?.image_url ? (
                    <img
                      src={profile.image_url}
                      alt="Profile"
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover border-4 border-white shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-col">
                      {profile?.first_name?.charAt(0)}
                      {profile?.last_name?.charAt(0)}
                      <span className="text-xs mt-1 text-white/80">
                        Profile Pic
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 w-full min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 truncate">
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : profile?.name || "User"}
                      </h1>
                      <p className="text-gray-600 text-base sm:text-lg mb-1 truncate">
                        {profile?.profession ||
                          profile?.occupation ||
                          profile?.headline ||
                          "Software Engineer"}
                      </p>
                      <p className="text-gray-500 text-sm sm:text-base flex items-center gap-1 truncate">
                        📍 {profile?.city || profile?.location || "Location"} •
                        {profile?.age ? ` ${profile.age} years` : " Age"}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate("/dashboard/profile")}
                        className="px-3 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-all duration-200 font-medium text-xs sm:text-sm border border-green-300 flex items-center gap-1 hover:shadow-md whitespace-nowrap"
                      >
                        <span className="text-xs">👁️</span>
                        <span className="hidden sm:inline">View Profile</span>
                        <span className="sm:hidden">View</span>
                      </button>

                      <button
                        onClick={() => navigate("/dashboard/edit-profile")}
                        className="px-3 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all duration-200 font-medium text-xs sm:text-sm border border-blue-300 flex items-center gap-1 hover:shadow-md whitespace-nowrap"
                      >
                        <span className="text-xs">✏️</span>
                        <span className="hidden sm:inline">Edit Profile</span>
                        <span className="sm:hidden">Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div
                  onClick={handleProfileViewsClick}
                  className="cursor-pointer"
                >
                  <StatCard
                    label="Profile Views"
                    value={loading ? "..." : profileViews.toString()}
                    // trend="+12%"
                  />
                </div>
                {/* <div onClick={() => navigate("/dashboard/matches")}>
                  <StatCard
                    label="Matches"
                    // value={loading ? "..." : matchesCount.toString()}
                    value={loading ? "..." : matchesCount.toString()}
                    // trend="+5%"
                  />
                </div> */}

                <div onClick={() => navigate("/dashboard/matches")}>
                  <StatCard
                    label="Matches"
                    value={
                      loading
                        ? "..."
                        : matchesCount === 0
                          ? "0"
                          : matchesCount.toString()
                    }
                    // Optional: Add icon or badge
                    icon="💖"
                  />
                </div>
                <div>
                  <StatCard
                    label="Connections"
                    value={loading ? "..." : connectionsCount.toString()}
                    // trend="+8%"
                  />
                </div>
                <div onClick={() => navigate("/dashboard/messages")}>
                  <StatCard
                    label="Messages"
                    value={loading ? "..." : messagesCount.toString()}
                    // trend="+3%"
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {/* Profile views */}
                <div
                  onClick={handleRecentActivityClick}
                  className="cursor-pointer"
                >
                  <ActivityItem
                    icon="👀"
                    text={`Your profile was viewed by ${
                      loading ? "..." : profileViews
                    } ${
                      profileViews === 1 ? "person" : "people"
                    } in Last 90 Days`}
                    time={
                      loading
                        ? "Loading..."
                        : recentViewers.length > 0
                          ? `Last viewed ${getTimeAgo(
                              recentViewers[0]?.viewed_at,
                            )}`
                          : "No views yet"
                    }
                  />
                </div>

                <div
                  onClick={() => navigate("/dashboard/matches")}
                  className="cursor-pointer"
                >
                  {/* New matches */}
                  <ActivityItem
                    icon="💖"
                    text={`You have ${
                      loading ? "..." : matchesCount || 200
                    } new match${matchesCount !== 1 ? "es" : ""} waiting`}
                    time="Today"
                  />
                </div>

                <div
                  onClick={() => navigate("/dashboard/messages")}
                  className="cursor-pointer"
                >
                  <ActivityItem
                    icon="💬"
                    text={`You received ${
                      loading ? "..." : messagesCount
                    } new message${messagesCount !== 1 ? "s" : ""}`}
                    time="Today"
                  />
                </div>

                {/* <ActivityItem
                  icon="💬"
                  text={`You received ${
                    loading ? "..." : messagesCount
                  } new message${messagesCount !== 1 ? "s" : ""}`}
                  time="Today"
                /> */}
              </div>
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <Link rel="stylesheet" href="/coming-soon">
                    <QuickAction icon="⚡" label="Boost Profile" />
                  </Link>
                  <QuickAction icon="⭐" label="Go Premium" />
                  <QuickAction icon="🔔" label="Notifications" />
                  <QuickAction icon="🛡️" label="Privacy Settings" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Use SuggestedMatches Component */}
            <SuggestedMatches
              suggestedMatches={suggestedMatches}
              loading={loading}
              error={error}
              // onRetry={handleRetry}
              onViewAll={() => navigate("/dashboard/matches")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
