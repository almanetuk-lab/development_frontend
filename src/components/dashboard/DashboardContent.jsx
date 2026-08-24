// src/components/dashboard/DashboardHome.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../comman/StatCard";
import ActivityItem from "../comman/ActivityItem";
import SuggestedMatches from "../MatchSystem/SuggetionMatches";
import { chatApi, getSuggestedMatches } from "../services/chatApi";
import profileViewApi from "../services/profileViewApi";
import api, { updateUserLocation } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";
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
  FiActivity,
  FiShield
} from "react-icons/fi";

export default function DashboardHome({ profile }) {
  const [displayProfile, setDisplayProfile] = useState(null);
  const navigate = useNavigate();
  const { updateProfile } = useUserProfile();
  const isLocationSavingRef = useRef(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [trustStatus, setTrustStatus] = useState(null);
  const [showTrustTooltip, setShowTrustTooltip] = useState(false);

  const fetchTrustData = async (id) => {
    try {
      const res = await api.get(`/api/users/${id}/trust`);
      setTrustStatus(res.data);
    } catch (err) {
      console.warn("Failed to fetch user trust status on dashboard:", err);
    }
  };

  const renderTrustBadge = () => {
    const score = profile?.trust_score ?? 100;
    
    let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100/50";
    let textClass = "text-emerald-500";
    
    if (score < 50) {
      colorClass = "bg-rose-50 text-rose-700 border-rose-250 hover:bg-rose-100/50";
      textClass = "text-rose-500";
    } else if (score < 75) {
      colorClass = "bg-amber-50 text-amber-700 border-amber-250 hover:bg-amber-100/50";
      textClass = "text-amber-500";
    } else if (score < 90) {
      colorClass = "bg-blue-50 text-blue-700 border-blue-250 hover:bg-blue-100/50";
      textClass = "text-blue-500";
    }

    return (
      <div 
        className="relative inline-block align-middle"
        onMouseEnter={() => setShowTrustTooltip(true)}
        onMouseLeave={() => setShowTrustTooltip(false)}
      >
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black tracking-wide cursor-pointer transition ${colorClass} shadow-xs`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${textClass.replace('text', 'bg')}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${textClass.replace('text', 'bg')}`}></span>
          </span>
          <FiShield className="w-3.5 h-3.5" />
          <span>Trust Score: {score}</span>
        </div>

        {showTrustTooltip && trustStatus && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-3xl p-5 border border-slate-100 shadow-2xl z-50 text-left space-y-4 animate-scale-up font-sans">
            
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Integrity Check</h4>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">Anti-Ghosting Score</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${colorClass}`}>
                {trustStatus.trustLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-3 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Trust Rating</p>
                <p className="text-lg font-black text-slate-800 mt-1">{trustStatus.trustScore}%</p>
              </div>
              <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-3 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Ghost Risk</p>
                <p className={`text-xs font-black mt-2 ${trustStatus.ghostingRisk === "Low" ? "text-emerald-600" : trustStatus.ghostingRisk === "Moderate" ? "text-amber-600" : "text-rose-600"}`}>
                  {trustStatus.ghostingRisk} Risk
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex justify-between items-center text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Connections
                </span>
                <span className="font-extrabold text-slate-800">{trustStatus.successfulConversations}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Ghosted Chats
                </span>
                <span className="font-extrabold text-slate-800">{trustStatus.ghostedConversations}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Engagement Level
                </span>
                <span className="font-extrabold text-indigo-700 bg-indigo-50/50 border border-indigo-100 px-2 py-0.5 rounded-md text-[9px] uppercase">
                  {trustStatus.engagementStatus}
                </span>
              </div>
            </div>

            <p className="text-[10px] leading-relaxed text-slate-400 font-semibold border-t border-slate-100 pt-3 flex items-start gap-1">
              <FiShield className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>Points are deducted automatically when messages are left unanswered for more than 48 hours.</span>
            </p>

          </div>
        )}
      </div>
    );
  };

  const autoDetectAndSaveLocation = async () => {
    if (isLocationSavingRef.current) return;
    try {
      isLocationSavingRef.current = true;
      setLocationError("");
      const { getUserLocation } = await import("../services/geolocationService");
      const coords = await getUserLocation();
      const lat = Number(coords.latitude.toFixed(6));
      const lon = Number(coords.longitude.toFixed(6));

      // Check if coordinates are different or not set yet to avoid redundant API calls
      if (
        profile.latitude === null ||
        profile.longitude === null ||
        profile.latitude === "" ||
        profile.longitude === "" ||
        Number(profile.latitude).toFixed(6) !== coords.latitude.toFixed(6) ||
        Number(profile.longitude).toFixed(6) !== coords.longitude.toFixed(6)
      ) {
        console.log("📍 Dashboard auto-detect: Saving new coordinates:", { lat, lon });
        await updateUserLocation(lat, lon);
        
        if (updateProfile) {
          updateProfile({
            latitude: lat,
            longitude: lon
          });
        }
      }
      setShowLocationModal(false);
      setLocationError("");
      return true;
    } catch (err) {
      console.warn("Dashboard location auto-save failed:", err.message);
      setLocationError(err.message);
      setShowLocationModal(true);
      return false;
    } finally {
      isLocationSavingRef.current = false;
    }
  };

  useEffect(() => {
    if (profile) {
      const checkPermissionAndLocation = async () => {
        try {
          if (navigator.permissions && navigator.permissions.query) {
            const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
            if (permissionStatus.state === "granted") {
              // Silently update in background if already granted
              await autoDetectAndSaveLocation();
            } else {
              // Show modal to prompt user
              setShowLocationModal(true);
              if (permissionStatus.state === "denied") {
                setLocationError("Location permission is currently blocked in your browser. Please allow it in settings.");
              }
            }

            // Listen for permission change
            permissionStatus.onchange = () => {
              if (permissionStatus.state === "granted") {
                setShowLocationModal(false);
                setLocationError("");
                autoDetectAndSaveLocation();
              } else if (permissionStatus.state === "denied") {
                setShowLocationModal(true);
                setLocationError("Location permission is currently blocked in your browser. Please allow it in settings.");
              }
            };
          } else {
            // Fallback for browsers that don't support permissions API
            setShowLocationModal(true);
          }
        } catch (err) {
          setShowLocationModal(true);
        }
      };

      checkPermissionAndLocation();
    }
  }, [profile?.id, profile?.user_id]);
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
      fetchTrustData(userId);

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
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight flex flex-wrap items-center gap-3">
                <span>Welcome back, <span className="text-[#002060] font-black">{userFirstName}</span></span>
                {renderTrustBadge()}
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

      {/* Geolocation Lock Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 max-w-[440px] w-full flex flex-col items-center text-center animate-scale-up">
            
            {/* Pulsing Pin Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping duration-1000"></div>
              <div className="relative w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Location Services Required</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Intentional Connection requires location access to show matches near you, calculate distance profiles, and verify active proximity.
            </p>

            {/* Check points */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-3 border border-slate-100/50">
              <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">✓</span>
                Discover local members near you
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">✓</span>
                Accurate matches by distance
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 font-bold">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">✓</span>
                Required for safety compliance
              </div>
            </div>

            {/* Error alerts */}
            {locationError && (
              <div className="w-full bg-rose-50/70 border border-rose-100 rounded-2xl p-4 mb-6 flex gap-3 text-xs text-rose-800 text-left">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <p className="font-extrabold mb-1">Permission Required</p>
                  <p className="leading-normal font-medium text-rose-700">
                    {locationError.includes("denied") 
                      ? "Location permissions are blocked. Click the lock/settings icon in your browser URL bar, change Location to 'Allow', then click retry."
                      : locationError}
                  </p>
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              type="button"
              onClick={autoDetectAndSaveLocation}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black tracking-wide shadow-lg shadow-indigo-600/10 transition transform active:scale-98 cursor-pointer"
            >
              {locationError ? "🔄 Retry Permission Check" : "📍 Enable Location Services"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
