// src/components/dashboard/DashboardHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../comman/StatCard";
import ActivityItem from "../comman/ActivityItem";
import SuggestedMatches from "../MatchSystem/SuggetionMatches";
import { chatApi, getSuggestedMatches } from "../services/chatApi";
import profileViewApi from "../services/profileViewApi";
import ImageModal from "../comman/ImageModal";
import {
  FiEye,
  FiHeart,
  FiUsers,
  FiMessageSquare,
  FiSearch,
  FiUserCheck,
  FiEdit3,
  FiCheckCircle,
  FiMapPin,
  FiX,
  FiActivity
} from "react-icons/fi";

export default function DashboardHome({ profile }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State for viewing image in big mode
  const [modalImage, setModalImage] = useState({ isOpen: false, url: "", title: "" });

  // State for dynamic data
  const [profileViews, setProfileViews] = useState(0);
  const [recentViewers, setRecentViewers] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
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

  // Fetch dashboard summary data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await fetchMatchesCount();

      try {
        const dashboardSummary = await profileViewApi.getDashboardSummary(userId);

        setProfileViews(dashboardSummary.profile_views || 0);
        setRecentViewers(dashboardSummary.recent_viewers || []);
        setMessagesCount(dashboardSummary.messages_count || 0);

        if (
          dashboardSummary.matches_count !== undefined &&
          dashboardSummary.matches_count !== null &&
          dashboardSummary.matches_count > 0
        ) {
          setMatchesCount(dashboardSummary.matches_count);
        }

        if (dashboardSummary.connections_count !== undefined) {
          setConnectionsCount(dashboardSummary.connections_count);
        }
      } catch (dashboardError) {
        console.error("❌ Dashboard summary error:", dashboardError);
      }
    } catch (error) {
      console.error("❌ Error in fetchDashboardData:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread messages
  const fetchUnreadMessages = async () => {
    try {
      const count = await profileViewApi.getUnreadMessagesCount(userId);
      setMessagesCount(count);
    } catch (error) {
      console.error("Failed to fetch unread messages:", error);
      setMessagesCount(0);
    }
  };

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

  useEffect(() => {
    if (userId && userId !== "null") {
      fetchDashboardData();

      const interval = setInterval(() => {
        fetchUnreadMessages();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchMatchesCount = async () => {
    try {
      const matchesData = await getSuggestedMatches();
      let matchesArray = [];

      if (Array.isArray(matchesData)) {
        matchesArray = matchesData;
      } else if (matchesData && matchesData.data && Array.isArray(matchesData.data)) {
        matchesArray = matchesData.data;
      } else if (matchesData && matchesData.matches && Array.isArray(matchesData.matches)) {
        matchesArray = matchesData.matches;
      } else if (matchesData && matchesData.users && Array.isArray(matchesData.users)) {
        matchesArray = matchesData.users;
      }

      const count = matchesArray.length;
      setMatchesCount(count);
      return count;
    } catch (error) {
      console.error("❌ Error fetching matches count:", error);
      setMatchesCount(0);
      return 0;
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
      const currentUserId = profile?.id || profile?.user_id;
      const filteredResults = (response.data || []).filter(
        (user) => user.id !== currentUserId
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

  const handleUserSelectFromSearch = (user) => {
    navigate("/dashboard/messages", {
      state: {
        selectedUser: {
          id: user.id,
          name: user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email,
          city: user.city,
          profession: user.profession,
        },
      },
    });

    setSearchQuery("");
    setShowSearchResults(false);
  };

  const userFirstName = profile?.first_name || profile?.last_name?.split(" ")[0] || profile?.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-slate-50/60 py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        
        {/* SECTION 1: Top Header Banner */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-100/90 shadow-sm relative z-20">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002060]/5 text-[#002060] text-xs font-bold uppercase tracking-wider border border-[#002060]/10 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FF2A6D]"></span>
                <span>Dashboard Overview</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Welcome back, <span className="text-[#002060] font-black">{userFirstName}</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm lg:text-base font-medium">
                Here is a summary of your profile performance, activity, and member interactions.
              </p>
            </div>

            {/* Professional Search Bar */}
            <div className="w-full lg:w-96 flex-shrink-0 search-container relative z-40">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members by name..."
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
                  className="w-full px-4 py-3 sm:py-3.5 pl-11 pr-10 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] focus:bg-white outline-none shadow-2xs transition-all text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <FiSearch className="w-4 h-4" />
                </span>

                {searchLoading && (
                  <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#002060] border-t-transparent"></div>
                  </div>
                )}

                {searchQuery && !searchLoading && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 py-2">
                  {searchLoading ? (
                    <div className="p-4 text-center text-slate-400 text-sm">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#002060] border-t-transparent mx-auto mb-2"></div>
                      Searching members...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id || user.user_id}
                        onClick={() => handleUserSelectFromSearch(user)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition border-b border-slate-50 last:border-b-0"
                      >
                        <img
                          src={
                            user.image_url && user.image_url !== ""
                              ? user.image_url.startsWith("http")
                                ? user.image_url
                                : `${import.meta.env.VITE_API_BASE_URL}${user.image_url}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.first_name || "User")}&background=002060&color=fff&bold=true`
                          }
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.first_name || "User")}&background=002060&color=fff&bold=true`;
                          }}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 truncate text-sm">
                            {user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User"}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {user.profession || user.email || "No details provided"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs font-medium">
                      No members found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Dashboard Content Grid (Profile, Stats & Activity | Suggested Matches) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Main Left Column (Profile Summary & Activity) */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            
            {/* Profile Overview Card (Contains Stat Cards inside) */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 sm:p-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <FiUserCheck className="text-[#002060] w-5 h-5" />
                  <span>Profile Overview</span>
                </h2>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 text-xs rounded-full font-bold">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              {/* Profile Details Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                {/* Profile Avatar */}
                <div className="shrink-0">
                  {profile?.image_url ? (
                    <div
                      className="relative cursor-pointer group"
                      onClick={() =>
                        setModalImage({
                          isOpen: true,
                          url: profile.image_url,
                          title: profile.first_name
                            ? `${profile.first_name} ${profile.last_name || ""}`
                            : "My Profile Picture",
                        })
                      }
                    >
                      <img
                        src={profile.image_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-md group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          View
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-[#002060] flex flex-col items-center justify-center text-white font-bold shadow-md">
                      <span className="text-2xl">
                        {profile?.first_name?.charAt(0) || "U"}
                        {profile?.last_name?.charAt(0) || ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Profile Information & Actions */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.name || "User"}
                    </h3>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5 truncate">
                      {profile?.profession || profile?.occupation || profile?.headline || "Member"}
                    </p>
                    <p className="text-slate-400 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1 font-medium">
                      <FiMapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{profile?.city || profile?.location || "Location set"}</span>
                      {profile?.age && <span>• {profile.age} yrs</span>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                    <button
                      onClick={() => navigate("/dashboard/profile")}
                      className="px-4 py-2 bg-[#002060] hover:bg-[#001848] text-white rounded-xl text-xs font-semibold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-1.5 h-9"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => navigate("/dashboard/edit-profile")}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-1.5 h-9"
                    >
                      <FiEdit3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Cards Grid (Inside Profile Overview) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 pt-2 border-t border-slate-100/80">
                <div onClick={handleProfileViewsClick}>
                  <StatCard
                    label="Profile Views"
                    value={loading ? "..." : profileViews.toString()}
                    icon={FiEye}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                  />
                </div>
                <div onClick={() => navigate("/dashboard/matches")}>
                  <StatCard
                    label="Matches"
                    value={loading ? "..." : matchesCount.toString()}
                    icon={FiHeart}
                    iconBg="bg-pink-50"
                    iconColor="text-[#FF2A6D]"
                  />
                </div>
                <div>
                  <StatCard
                    label="Connections"
                    value={loading ? "..." : connectionsCount.toString()}
                    icon={FiUsers}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                  />
                </div>
                <div onClick={() => navigate("/dashboard/messages")}>
                  <StatCard
                    label="Messages"
                    value={loading ? "..." : messagesCount.toString()}
                    icon={FiMessageSquare}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <FiActivity className="text-[#002060] w-5 h-5" />
                  <span>Recent Activity</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">Live Updates</span>
              </div>

              <div className="space-y-2.5">
                <div onClick={handleRecentActivityClick}>
                  <ActivityItem
                    icon={FiEye}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    text={`Your profile was viewed by ${loading ? "..." : profileViews} ${profileViews === 1 ? "person" : "people"}`}
                    time={
                      loading
                        ? "Loading..."
                        : recentViewers.length > 0
                        ? `Last viewed ${getTimeAgo(recentViewers[0]?.viewed_at)}`
                        : "No views yet"
                    }
                  />
                </div>

                <div onClick={() => navigate("/dashboard/matches")}>
                  <ActivityItem
                    icon={FiHeart}
                    iconBg="bg-pink-50"
                    iconColor="text-[#FF2A6D]"
                    text={`You have ${loading ? "..." : matchesCount} match recommendations available`}
                    time="Updated today"
                  />
                </div>

                <div onClick={() => navigate("/dashboard/messages")}>
                  <ActivityItem
                    icon={FiMessageSquare}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    text={`You have ${loading ? "..." : messagesCount} unread message${messagesCount !== 1 ? "s" : ""}`}
                    time="Updated today"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Suggested Matches */}
          <div className="space-y-6">
            <SuggestedMatches />
          </div>

        </div>
      </div>

      {/* Image Modal for profile picture preview */}
      <ImageModal
        isOpen={modalImage.isOpen}
        imageUrl={modalImage.url}
        title={modalImage.title}
        onClose={() => setModalImage({ isOpen: false, url: "", title: "" })}
      />
    </div>
  );
}
