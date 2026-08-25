import React, { useEffect, useRef, useState, Component } from "react";
import { useUserProfile } from "../context/UseProfileContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import profileViewApi from "../services/profileViewApi";
import ImageModal from "../comman/ImageModal";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";

// Error boundary to prevent full white page on render crash
class ProfileErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ProfilePage render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50/60 flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-sm bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-base font-semibold">Something went wrong loading this profile.</p>
            <p className="text-slate-400 text-xs">{this.state.error?.message}</p>
            <button
              onClick={() => window.history.back()}
              className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import {
  FiArrowLeft,
  FiEdit3,
  FiLayout,
  FiUser,
  FiActivity,
  FiBriefcase,
  FiSmile,
  FiMapPin,
  FiHeart,
  FiCompass,
  FiMessageSquare,
  FiCheckCircle,
  FiBookOpen,
  FiTrendingUp,
  FiCheck,
  FiClock,
  FiUsers,
  FiStar,
  FiTarget,
  FiHome,
  FiThumbsUp,
  FiHelpCircle,
  FiCalendar,
  FiShield
} from "react-icons/fi";

// LifeRhythmsDisplay Component
function LifeRhythmsDisplay({ data }) {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 italic text-sm">No life rhythms data available</p>
      </div>
    );
  }

  const rhythmSections = {
    work_rhythm: { title: "Work Rhythm", icon: FiBriefcase, iconBg: "bg-[#002060]/5", iconColor: "text-[#002060]" },
    social_energy: { title: "Social Energy", icon: FiUsers, iconBg: "bg-[#FF2A6D]/5", iconColor: "text-[#FF2A6D]" },
    life_pace: { title: "Life Pace", icon: FiClock, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    emotional_style: { title: "Emotional Style", icon: FiHeart, iconBg: "bg-rose-50", iconColor: "text-rose-500" },
  };

  return (
    <div className="space-y-4">
      {Object.entries(rhythmSections).map(([key, section]) => {
        const rhythmData = data[key];
        if (!rhythmData || (!rhythmData.single && !rhythmData.combination)) {
          return null;
        }

        return (
          <div
            key={key}
            className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <div className={`w-8 h-8 ${section.iconBg} ${section.iconColor} rounded-xl flex items-center justify-center shrink-0`}>
                <section.icon className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                {section.title}
              </h4>
            </div>

            <div className="pl-8 space-y-1.5">
              {rhythmData.combination ? (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Combination</p>
                  <p className="text-slate-800 font-bold text-base mt-0.5">
                    {rhythmData.combination}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-slate-500 text-sm italic mt-1 bg-white border border-slate-100 p-2.5 rounded-xl">
                      "{rhythmData.statement}"
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Style</p>
                  <p className="text-slate-800 font-bold text-base mt-0.5">
                    {rhythmData.single}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-slate-500 text-sm italic mt-1 bg-white border border-slate-100 p-2.5 rounded-xl">
                      "{rhythmData.statement}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WrappedProfilePage() {
  return (
    <ProfileErrorBoundary>
      <ProfilePage />
    </ProfileErrorBoundary>
  );
}

function ProfilePage() {
  const { profile: currentUserProfile, activePlan, planLoading, isFeatureAllowed } = useUserProfile();
  const [displayProfile, setDisplayProfile] = useState(null);
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const hasTrackedRef = useRef(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Basic, 1: Lifestyle, 2: Life Rhythms
  const [modalImage, setModalImage] = useState({ isOpen: false, url: "", title: "" });

  const [trustStatus, setTrustStatus] = useState(null);
  const [trustLoading, setTrustLoading] = useState(false);
  const [showTrustTooltip, setShowTrustTooltip] = useState(false);

  useEffect(() => {
    const targetUserId = displayProfile?.user_id || displayProfile?.id;
    if (targetUserId) {
      const fetchTrustData = async (id) => {
        try {
          setTrustLoading(true);
          const res = await api.get(`/api/users/${id}/trust`);
          setTrustStatus(res.data);
        } catch (err) {
          console.warn("Failed to fetch user trust status:", err);
        } finally {
          setTrustLoading(false);
        }
      };
      fetchTrustData(targetUserId);
    }
  }, [displayProfile?.user_id, displayProfile?.id]);

  const renderTrustBadge = () => {
    const score = displayProfile?.trust_score ?? 100;
    
    let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50";
    let textClass = "text-emerald-500";
    
    if (score < 50) {
      colorClass = "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/50";
      textClass = "text-rose-500";
    } else if (score < 75) {
      colorClass = "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/50";
      textClass = "text-amber-500";
    } else if (score < 90) {
      colorClass = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/50";
      textClass = "text-blue-500";
    }

    return (
      <div 
        className="relative inline-block"
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
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-3xl p-5 border border-slate-100 shadow-2xl z-50 text-left space-y-4 animate-scale-up">
            
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
              {isCurrentUser && (
                <>
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
                </>
              )}
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

  useEffect(() => {
    const myId = currentUserProfile?.id || currentUserProfile?.user_id;
    const viewedId = userId;

    const isOwnProfile = !viewedId || myId == viewedId;
    setIsCurrentUser(isOwnProfile);

    // Profile view tracking (only for other users, only once)
    if (!isOwnProfile && viewedId && myId && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      (async () => {
        try {
          await profileViewApi.trackProfileView(viewedId);
        } catch (err) {
          console.error("❌ Profile view tracking failed:", err);
        }
      })();
    }

    // If location.state already has the profile, use it directly
    if (location.state?.userProfile) {
      setDisplayProfile(location.state.userProfile);
      setLoading(false);
      return;
    }

    // Viewing someone else's profile — fetch by ID (doesn't need currentUserProfile)
    if (viewedId) {
      fetchUserData(viewedId);
      return;
    }

    // Viewing own profile — wait until context is ready
    if (currentUserProfile) {
      setDisplayProfile(currentUserProfile);
      setLoading(false);
    }
    // If currentUserProfile not loaded yet, stay in loading state
  }, [userId, location.state, currentUserProfile]);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      const currentUserId =
        currentUserProfile?.id || currentUserProfile?.user_id;
      if (currentUserId) {
        const response = await api.get(`/api/users/${currentUserId}`);
        if (response.data && !response.data.message) {
          setDisplayProfile(response.data);
        } else {
          setDisplayProfile(currentUserProfile);
        }
      } else {
        setDisplayProfile(currentUserProfile);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setDisplayProfile(currentUserProfile);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/${id}`);
      // /api/users/:id returns the joined user+profile row directly
      if (response.data && !response.data.message) {
        setDisplayProfile(response.data);
      } else {
        setDisplayProfile({
          user_id: id,
          name: `User ${id}`,
        });
      }
    } catch (error) {
      console.error("API Error loading profile:", error);
      setDisplayProfile({
        user_id: id,
        name: `User ${id}`,
        error: "Could not load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString || "";
    }
  };

  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (typeof value === "number" && isNaN(value)) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === "object" && Object.keys(value).length === 0)
      return false;
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#002060] border-t-transparent mx-auto"></div>
          <p className="text-slate-500 font-medium text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-base font-semibold">Profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  const getLifeRhythmsData = () => {
    if (!displayProfile.life_rhythms) return null;

    if (typeof displayProfile.life_rhythms === "string") {
      try {
        return JSON.parse(displayProfile.life_rhythms);
      } catch (error) {
        console.error("Error parsing life rhythms:", error);
        return null;
      }
    }

    return displayProfile.life_rhythms;
  };

  const lifeRhythmsData = getLifeRhythmsData();

  const myId = currentUserProfile?.id || currentUserProfile?.user_id;
  const viewedId = userId;
  if (viewedId && myId && myId != viewedId && !planLoading && !isFeatureAllowed("profile")) {
    return <PlanRestrictionModal feature="profiles" />;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100/90 shadow-xs relative overflow-hidden">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          </div>
          
          <div className="relative z-10 space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {isCurrentUser ? "My Profile" : "Member Profile"}
            </h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              {isCurrentUser ? "Manage your presentation" : "Viewing member information"}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2.5 w-full sm:w-auto">
            {!isCurrentUser ? (
              <button
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/dashboard/edit-profile")}
                className="flex-1 sm:flex-none h-10 px-4 bg-[#002060] hover:bg-[#FF2A6D] text-white rounded-xl font-bold transition shadow-2xs hover:shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <FiEdit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 sm:flex-none h-10 px-4 bg-slate-50 border border-slate-200 text-[#002060] hover:bg-[#002060]/5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              <FiLayout className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Profile Hero Card */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 shadow-xs relative z-20">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-0 w-80 h-80 bg-pink-50/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
          </div>

          <div className="relative z-10 shrink-0">
            {displayProfile.image_url ? (
              <div
                className="relative cursor-pointer group rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md"
                onClick={() =>
                  setModalImage({
                    isOpen: true,
                    url: displayProfile.image_url,
                    title: displayProfile.first_name
                      ? `${displayProfile.first_name} ${displayProfile.last_name || ""}`
                      : "Profile Picture",
                  })
                }
              >
                <img
                  src={displayProfile.image_url}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    View
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#002060] flex items-center justify-center text-white font-black shadow-md">
                <span className="text-3xl sm:text-4xl">
                  {(
                    displayProfile.first_name?.[0] ||
                    displayProfile.name?.[0] ||
                    "U"
                  ).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="relative z-10 text-center sm:text-left flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight truncate">
                  {displayProfile.first_name || displayProfile.last_name
                    ? `${displayProfile.first_name || ""} ${displayProfile.last_name || ""}`.trim()
                    : displayProfile.name || "User"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  {renderTrustBadge()}
                  {isCurrentUser && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] rounded-full font-bold uppercase tracking-wider self-center">
                      Owner
                    </span>
                  )}
                </div>
              </div>

              <p className="text-slate-500 font-bold text-sm sm:text-base mt-0.5 truncate">
                {displayProfile.profession || displayProfile.headline || "Member"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {displayProfile.city && (
                <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FiMapPin className="w-3 h-3 text-slate-400" />
                  <span>{displayProfile.city}</span>
                </span>
              )}

              {displayProfile.age && (
                <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full text-xs font-semibold">
                  {displayProfile.age} yrs
                </span>
              )}

              {displayProfile.gender && (
                <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full text-xs font-semibold">
                  {displayProfile.gender}
                </span>
              )}

              {displayProfile.marital_status && (
                <span className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1 rounded-full text-xs font-semibold">
                  {displayProfile.marital_status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab System */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-100 shadow-2xs flex gap-1 overflow-x-auto">
          {[
            { label: "Basic Information", num: "1" },
            { label: "Lifestyle & Work", num: "2" },
            { label: "Life Rhythms", num: "3" }
          ].map((tab, idx) => (
            <button
              key={idx}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2 ${activeTab === idx
                  ? "bg-[#002060]/5 text-[#002060] border border-[#002060]/10"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              onClick={() => setActiveTab(idx)}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                activeTab === idx ? "bg-[#002060] text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.num}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* PAGE 1: BASIC INFORMATION */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Section title="Identity & Status" icon={FiUser}>
                <InfoItem label="First Name" value={displayProfile.first_name} />
                <InfoItem label="Last Name" value={displayProfile.last_name} />
                <InfoItem label="Username" value={displayProfile.username} />
                <InfoItem label="Gender" value={displayProfile.gender} />
                <InfoItem label="Date of Birth" value={formatDateForDisplay(displayProfile.dob)} />
                <InfoItem 
                  label="Age" 
                  value={displayProfile.age ? (displayProfile.ai_detected_at ? `${displayProfile.age} (AI Estimated)` : displayProfile.age) : ""} 
                />
                <InfoItem label="Marital Status" value={displayProfile.marital_status} />
                <InfoItem label="Height (Inches)" value={displayProfile.height} />
                <InfoItem label="Zodiac Sign" value={displayProfile.zodiac_sign} />
                <InfoItem
                  label="Languages Spoken"
                  value={displayProfile.languages_spoken}
                />
              </Section>

              <Section title="Contact & Location" icon={FiMapPin}>
                <InfoItem label="Email" value={displayProfile.email} type="email" />
                <InfoItem label="Phone" value={displayProfile.phone} />
                <InfoItem label="Country" value={displayProfile.country} />
                <InfoItem label="State" value={displayProfile.state} />
                <InfoItem label="City" value={displayProfile.city} />
                <InfoItem label="Pincode" value={displayProfile.pincode} />
                <InfoItem label="Address" value={displayProfile.address} full />
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Professional Profile" icon={FiBriefcase}>
                <InfoItem label="Headline" value={displayProfile.headline} />
                <InfoItem label="Profession" value={displayProfile.profession} />
                <InfoItem label="Professional Identity" value={displayProfile.professional_identity} />
                <InfoItem label="Company" value={displayProfile.company} />
                <InfoItem label="Position" value={displayProfile.position} />
                <InfoItem label="Company Type" value={displayProfile.company_type} />
                <InfoItem
                  label="Experience"
                  value={
                    hasValue(displayProfile.experience)
                      ? `${displayProfile.experience} years`
                      : ""
                  }
                />
                <InfoItem label="Education" value={displayProfile.education} />
                <InfoItem label="Education Institution" value={displayProfile.education_institution_name} />
              </Section>

              <Section title="About & Personal Interests" icon={FiBookOpen}>
                <InfoItem label="About Me" value={displayProfile.about_me} full />
                <InfoItem label="Hobbies" value={displayProfile.hobbies} full />
                <InfoItem label="Skills" value={displayProfile.skills} full />
                <InfoItem label="Interests" value={displayProfile.interests} full />
              </Section>
            </div>
          </div>
        )}

        {/* PAGE 2: LIFESTYLE & WORK */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Section title="Lifestyle" icon={FiSmile}>
                <InfoItem label="Self Expression" value={displayProfile.self_expression} />
                <InfoItem label="Free Time Style" value={displayProfile.freetime_style} />
                <InfoItem label="Health Activity Level" value={displayProfile.health_activity_level} />
                <InfoItem label="Pets Preference" value={displayProfile.pets_preference} />
                <InfoItem label="Religious Belief" value={displayProfile.religious_belief} />
                <InfoItem label="Smoking" value={displayProfile.smoking} />
                <InfoItem label="Drinking" value={displayProfile.drinking} />
              </Section>

              <Section title="Relationship Preferences" icon={FiHeart}>
                <InfoItem label="Interested In" value={displayProfile.interested_in} />
                <InfoItem label="Relationship Goal" value={displayProfile.relationship_goal} />
                <InfoItem label="Children Preference" value={displayProfile.children_preference} />
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Work Style" icon={FiBriefcase}>
                <InfoItem label="Work Environment" value={displayProfile.work_environment} />
                <InfoItem label="Interaction Style" value={displayProfile.interaction_style} />
                <InfoItem label="Work Rhythm" value={displayProfile.work_rhythm} />
                <InfoItem label="Career Decision Style" value={displayProfile.career_decision_style} />
                <InfoItem label="Work Demand Response" value={displayProfile.work_demand_response} />
              </Section>

              <Section title="Relationship Styles" icon={FiHeart}>
                <InfoItem label="Love Language" value={displayProfile.love_language_affection} />
                <InfoItem label="Preference of Closeness" value={displayProfile.preference_of_closeness} />
                <InfoItem label="Approach to Physical Closeness" value={displayProfile.approach_to_physical_closeness} />
                <InfoItem label="Relationship Values" value={displayProfile.relationship_values} />
                <InfoItem label="Values in Others" value={displayProfile.values_in_others} />
                <InfoItem label="Relationship Pace" value={displayProfile.relationship_pace} />
              </Section>
            </div>
          </div>
        )}

        {/* PAGE 3: LIFE RHYTHMS & INTERESTS */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-indigo-50 text-[#002060] rounded-2xl flex items-center justify-center shrink-0 shadow-2xs">
                  <FiActivity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    Life Rhythms & Interests
                  </h2>
                  <p className="text-slate-500 text-xs font-semibold">
                    Your personal daily patterns and passions
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT SIDE - Life Rhythms */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FiActivity className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Life Rhythms
                  </h3>
                </div>

                {lifeRhythmsData ? (
                  <LifeRhythmsDisplay data={lifeRhythmsData} />
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="text-slate-400 italic text-sm">
                      No life rhythms data available
                    </p>
                    {isCurrentUser && (
                      <button
                        onClick={() => navigate("/edit-profile")}
                        className="px-4 py-2 bg-[#002060] hover:bg-[#FF2A6D] text-white text-xs font-bold rounded-xl transition shadow-2xs"
                      >
                        Add Life Rhythms
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE - Interests */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 bg-pink-50 text-[#FF2A6D] rounded-xl flex items-center justify-center">
                    <FiCompass className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Interests & Passions
                  </h3>
                </div>

                {displayProfile.ways_i_spend_time ? (
                  <div className="space-y-5">
                    {(() => {
                      let interestsData;
                      try {
                        interestsData =
                          typeof displayProfile.ways_i_spend_time === "string"
                            ? JSON.parse(displayProfile.ways_i_spend_time)
                            : displayProfile.ways_i_spend_time;
                      } catch (error) {
                        console.error("Error parsing ways_i_spend_time:", error);
                        interestsData = {};
                      }

                      if (
                        !interestsData ||
                        typeof interestsData !== "object" ||
                        Object.keys(interestsData).length === 0
                      ) {
                        return (
                          <div className="text-center py-6">
                            <p className="text-slate-400 italic text-sm">
                              No interests categories added yet
                            </p>
                          </div>
                        );
                      }

                      const categoriesConfig = {
                        creative_cultural: {
                          label: "Creative & Cultural",
                          color: "bg-purple-50 text-purple-700 border-purple-100",
                        },
                        lifestyle_exploration: {
                          label: "Lifestyle & Exploration",
                          color: "bg-green-50 text-green-700 border-green-100",
                        },
                        mind_purpose: {
                          label: "Mind & Purpose",
                          color: "bg-blue-50 text-blue-700 border-blue-100",
                        },
                        sports_activity: {
                          label: "Sports & Activity",
                          color: "bg-rose-50 text-rose-700 border-rose-100",
                        },
                        music_genres: {
                          label: "Music Genres",
                          color: "bg-amber-50 text-amber-700 border-amber-100",
                        },
                      };

                      return (
                        <div className="space-y-5">
                          {Object.entries(interestsData).map(([category, items]) => {
                            const config = categoriesConfig[category];
                            if (!items || !Array.isArray(items) || items.length === 0)
                              return null;

                            return (
                              <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-slate-700 text-xs">
                                    {config?.label || category.replace("_", " ").toUpperCase()}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                                    {items.length} selected
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {items.map((interest, index) => (
                                    <span
                                      key={index}
                                      className={`px-2.5 py-1 text-xs rounded-lg border font-medium ${
                                        config?.color || "bg-slate-50 text-slate-600 border-slate-100"
                                      }`}
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}

                          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500">Total Interests</span>
                            <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-[#002060] font-black rounded-lg">
                              {Object.values(interestsData).flat().length}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div>
                    {displayProfile.interests ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(() => {
                            let interestsArray = [];
                            if (Array.isArray(displayProfile.interests)) {
                              interestsArray = displayProfile.interests;
                            } else if (typeof displayProfile.interests === "string") {
                              interestsArray = displayProfile.interests
                                .split(",")
                                .map((item) => item.trim())
                                .filter((item) => item !== "");
                            }

                            if (interestsArray.length === 0) {
                              return (
                                <p className="text-slate-400 italic text-sm py-4">No interests added yet</p>
                              );
                            }

                            return interestsArray.map((interest, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
                              >
                                {interest}
                              </span>
                            ));
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-2">
                        <p className="text-slate-400 italic text-sm">No interests added yet</p>
                        {isCurrentUser && (
                          <button
                            onClick={() => navigate("/edit-profile")}
                            className="px-3 py-1.5 bg-[#002060] hover:bg-[#FF2A6D] text-white text-xs font-bold rounded-lg transition"
                          >
                            Add Interests
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Questions Section */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FiCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Get to Know Me
                </h3>
              </div>

              {(() => {
                let profileQuestions = {};
                if (displayProfile?.prompts?.["question-key"]) {
                  profileQuestions = displayProfile.prompts["question-key"];
                } else if (
                  Array.isArray(displayProfile?.profile_prompts) &&
                  displayProfile.profile_prompts.length > 0
                ) {
                  displayProfile.profile_prompts.forEach((prompt) => {
                    if (prompt?.question_key && prompt?.answer) {
                      profileQuestions[prompt.question_key] = prompt.answer;
                    }
                  });
                } else if (
                  displayProfile?.profile_questions &&
                  typeof displayProfile.profile_questions === "object"
                ) {
                  profileQuestions = displayProfile.profile_questions;
                } else if (
                  displayProfile?.prompts &&
                  typeof displayProfile.prompts === "object"
                ) {
                  profileQuestions = displayProfile.prompts;
                }

                const questionsConfig = {
                  small_habit: {
                    label: "A small habit that says a lot about me…",
                    icon: FiStar,
                    iconColor: "text-amber-500",
                  },
                  life_goal: {
                    label: "What I'm genuinely trying to build in my life right now…",
                    icon: FiTarget,
                    iconColor: "text-[#FF2A6D]",
                  },
                  home_moment: {
                    label: "A moment that felt like home to me…",
                    icon: FiHome,
                    iconColor: "text-[#002060]",
                  },
                  belief_that_shapes_life: {
                    label: "One belief that quietly shapes how I live…",
                    icon: FiCompass,
                    iconColor: "text-emerald-500",
                  },
                  appreciate_people: {
                    label: "Something I always appreciate in people…",
                    icon: FiThumbsUp,
                    iconColor: "text-indigo-500",
                  },
                  if_someone_knows_me: {
                    label: "If someone really knows me, they know…",
                    icon: FiHelpCircle,
                    iconColor: "text-violet-400",
                  },
                  what_makes_me_understood: {
                    label: "What makes me feel truly understood…",
                    icon: FiMessageSquare,
                    iconColor: "text-sky-500",
                  },
                  usual_day: {
                    label: "How my usual day looks like…",
                    icon: FiCalendar,
                    iconColor: "text-orange-400",
                  },
                };

                if (
                  !profileQuestions ||
                  Object.keys(profileQuestions).length === 0
                ) {
                  return (
                    <div className="text-center py-6 space-y-2">
                      <p className="text-slate-400 italic text-sm">
                        No profile questions answered yet
                      </p>
                      {isCurrentUser && (
                        <button
                          onClick={() => navigate("/edit-profile")}
                          className="px-3 py-1.5 bg-[#002060] hover:bg-[#FF2A6D] text-white text-xs font-bold rounded-lg transition"
                        >
                          Answer Questions
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-slate-400 font-bold">
                        Answered{" "}
                        {
                          Object.keys(profileQuestions).filter((key) =>
                            profileQuestions[key]?.trim(),
                          ).length
                        }{" "}
                        of {Object.keys(questionsConfig).length} questions
                      </p>
                      {isCurrentUser && (
                        <button
                          onClick={() => navigate("/edit-profile")}
                          className="text-[#FF2A6D] hover:underline font-bold"
                        >
                          Edit Answers
                        </button>
                      )}
                    </div>

                    <div className="space-y-3.5">
                      {Object.entries(questionsConfig).map(([questionKey, config]) => {
                        const answer = profileQuestions[questionKey] || "";
                        const hasAnswer = answer && answer.trim() !== "";

                        return (
                          <div
                            key={questionKey}
                            className={`border-l-4 ${
                              hasAnswer ? "border-[#002060]/30 bg-slate-50/50" : "border-slate-200 bg-slate-50/20"
                            } pl-4 py-3.5 rounded-r-2xl border border-slate-100 border-l-4`}
                          >
                            <div className="flex items-start gap-2.5 mb-1.5">
                              {config.icon && (
                                <config.icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.iconColor || "text-slate-400"}`} />
                              )}
                              <h4 className="font-bold text-slate-700 text-xs sm:text-sm">
                                {config.label}
                              </h4>
                            </div>

                            {hasAnswer ? (
                              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-7">
                                {answer}
                              </p>
                            ) : (
                              <p className="text-slate-400 text-xs italic pl-7">
                                Not answered yet
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal for big mode viewing */}
      <ImageModal
        isOpen={modalImage.isOpen}
        imageUrl={modalImage.url}
        title={modalImage.title}
        onClose={() => setModalImage({ isOpen: false, url: "", title: "" })}
      />
    </div>
  );
}

// InfoItem Component
function InfoItem({ label, value, full = false, type = "text" }) {
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "number" && isNaN(val)) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && Object.keys(val).length === 0) return false;
    return true;
  };

  const displayValue = hasValue(value) ? value : null;

  if (!displayValue) {
    return (
      <div className={`p-3 rounded-2xl bg-slate-50/40 border border-slate-100/50 ${full ? "sm:col-span-2 col-span-1" : ""}`}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-slate-350 italic text-xs font-medium">Not provided</p>
      </div>
    );
  }

  const renderValue = () => {
    if (type === "email") {
      return (
        <a
          href={`mailto:${displayValue}`}
          className="text-[#FF2A6D] hover:underline text-xs sm:text-sm font-bold break-all inline-block mt-0.5"
        >
          {displayValue}
        </a>
      );
    }

    // Check if it's a list (array or comma-separated string)
    const isList = Array.isArray(displayValue) || 
      (typeof displayValue === "string" && 
       displayValue.includes(",") && 
       !label.toLowerCase().includes("address") && 
       !label.toLowerCase().includes("about"));

    if (isList) {
      const items = Array.isArray(displayValue)
        ? displayValue
        : displayValue.split(",").map((i) => i.trim()).filter(Boolean);

      return (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {items.map((item, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-[#002060]/5 text-[#002060] border border-[#002060]/10 text-[10px] sm:text-xs font-semibold rounded-md"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    // Check if it's a short status/choice value
    const isShortChoice = typeof displayValue === "string" && 
      displayValue.length < 25 && 
      (displayValue === "Male" || 
       displayValue === "Female" || 
       displayValue === "Single" || 
       displayValue === "Married" || 
       displayValue === "Divorced" ||
       displayValue === "Yes" || 
       displayValue === "No" || 
       displayValue === "Active" || 
       displayValue === "Moderate" || 
       displayValue === "Sedentary" ||
       displayValue === "Remote" || 
       displayValue === "Hybrid" || 
       displayValue === "On-site" ||
       displayValue === "Never" || 
       displayValue === "Socially" || 
       displayValue === "Regularly" ||
       label.toLowerCase().includes("status") || 
       label.toLowerCase().includes("gender") ||
       label.toLowerCase().includes("preference") || 
       label.toLowerCase().includes("level") ||
       label.toLowerCase().includes("environment") || 
       label.toLowerCase().includes("style"));

    if (isShortChoice) {
      return (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200/40 text-[10px] sm:text-xs font-semibold rounded-md inline-block mt-0.5">
          {displayValue}
        </span>
      );
    }

    return (
      <p className="text-slate-800 text-xs sm:text-sm font-semibold leading-relaxed mt-0.5">
        {displayValue}
      </p>
    );
  };

  return (
    <div className={`p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100/80 hover:bg-slate-50 hover:border-slate-200/60 transition-all ${full ? "sm:col-span-2 col-span-1" : ""}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      {renderValue()}
    </div>
  );
}

// Section Component
function Section({ title, children, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
        {Icon && (
          <div className="w-7 h-7 bg-slate-50 text-[#002060] rounded-lg flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5" />
          </div>
        )}
        <h3 className="text-sm sm:text-base font-bold text-slate-800">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
