import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";
import api from "../services/api"; 
import { FiMapPin, FiRefreshCw, FiArrowRight } from "react-icons/fi"; 

const SuggestedMatches = () => {
  const navigate = useNavigate();

  // State
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);  

  // Fetch matches on component mount
  useEffect(() => {
    console.log("🔄 Component mounted");
    fetchMatches();
  }, []);

  //  Fetch matches function
  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching suggested matches...");

      // Option 1: Use getSuggestedMatches
      try {
        const matches = await getSuggestedMatches();
        console.log("📦 getSuggestedMatches Response:", matches);

        if (matches && Array.isArray(matches)) {
          console.log(" Setting matches to state:", matches.length);
          setSuggestedMatches(matches);
          return; 
        }
      } catch (firstError) {
        console.log("⚠️ getSuggestedMatches failed, trying adminAPI...");
      }

      // Option 2: Try direct API call
      try {
        const response = await api.get("/api/suggested-matches");
        console.log("📦 /api/suggested-matches Response:", response.data);

        if (response.data) {
          const matchesData = Array.isArray(response.data)
            ? response.data
            : response.data.data || response.data.matches || [];

          console.log(" Setting matches from direct API:", matchesData.length);
          setSuggestedMatches(matchesData);
          return;
        }
      } catch (secondError) {
        console.log("⚠️ Direct API failed too");
      }

      // Fallback: Empty array
      setSuggestedMatches([]);
      setError("No matches available at the moment.");

    } catch (err) {
      console.error("❌ Error in fetchMatches:", err);
      setError(err.message || "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  //  CORRECT: Fetch COMPLETE user profile
  const fetchCompleteProfile = async (userId) => {
    try {
      console.log(`🔍 Fetching COMPLETE profile for user ${userId} via /api/users/${userId}...`);
      
      const response = await api.get(`/api/users/${userId}`);
      
      console.log(`/api/users/${userId} response:`, response.data);
      
      if (response.data) {
        // Check response format
        let completeProfile = {};
        
        // Format 1: Data in response.data.data
        if (response.data.data) {
          completeProfile = {
            ...response.data.data,
            prompts: response.data.prompts || {}
          };
        } 
        // Format 2: Direct data in response.data
        else {
          completeProfile = response.data;
          
          // If prompts are separate, combine them
          if (response.data.prompts && !completeProfile.prompts) {
            completeProfile.prompts = response.data.prompts;
          }
        }
        
        console.log(" Complete profile fetched:", completeProfile);
        console.log("Has prompts?", completeProfile.prompts);
        console.log("User ID in profile:", completeProfile.user_id || completeProfile.id);
        
        // Verify this is the correct user
        const profileUserId = completeProfile.user_id || completeProfile.id;
        if (profileUserId == userId) {
          console.log(" CORRECT user profile verified");
          return completeProfile;
        } else {
          console.log(` WRONG user: Expected ${userId}, got ${profileUserId}`);
          return null;
        }
      }
      
      return null;
      
    } catch (error) {
      console.error(" Error fetching complete profile:", error);
      return null;
    }
  };

  //  FIXED: View Profile with COMPLETE data fetch
  const handleViewProfile = async (user) => {
    const memberId = user.user_id || user.id;
    const memberName = getFullName(user);

    console.log("🎯 VIEW PROFILE CLICKED for user:", memberName, "ID:", memberId);
    console.log("Current user data (partial):", user);

    try {
      // Show loading for this specific profile
      setLoadingProfileId(memberId);

      // 1. Fetch COMPLETE profile data using /api/users/{userId}
      const completeProfile = await fetchCompleteProfile(memberId);
      
      if (completeProfile) {
        console.log(" SUCCESS: Complete profile data fetched");
        
        // 2. Navigate with COMPLETE data
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: completeProfile, // COMPLETE data with prompts, questions, etc.
            memberId: memberId,
            name: memberName,
            from: "suggested_matches_complete"
          }
        });
      } else {
        console.log("⚠️ Complete profile not found, using partial data");
        
        // Fallback: Use partial user data
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: user, // Only basic data
            memberId: memberId,
            name: memberName,
            from: "suggested_matches_partial"
          }
        });
      }
    } catch (error) {
      console.error("❌ Error in handleViewProfile:", error);
      
      // Final fallback: Navigate without state
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      // Hide loading
      setLoadingProfileId(null);
    }
  };

  // Helper function to get full name
  const getFullName = (user) => {
    if (!user) return "User";

    if (user.full_name && user.full_name.trim()) {
      return user.full_name;
    }

    if (user.first_name || user.last_name) {
      const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      return name;
    }

    if (user.profession && user.profession.trim()) {
      return user.profession;
    }

    if (user.company && user.company.trim()) {
      return user.company;
    }

    return `User ${user.user_id || user.id || ""}`;
  };

  // Helper function to get location (SIRF CITY)
  const getLocation = (user) => {
    if (!user) return "Location not set";

    // SIRF CITY return karna hai
    if (user.city) return user.city;

    return "Location not set";
  };

  // Helper function to get profession
  const getProfession = (user) => {
    if (!user) return "Profession not set";

    if (user.profession) return user.profession;

    return "Profession not set";
  };

  // Helper function to get profile image
  const getProfileImage = (user) => {
    if (!user) {
      return "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=150";
    }

    if (user.image_url && user.image_url.trim()) {
      return user.image_url;
    }

    const displayName = getFullName(user);
    const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
    const encodedName = encodeURIComponent(nameForAvatar || "User");

    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=150`;
  };

  // Handle view all
  const handleViewAll = () => {
    navigate("/dashboard/matches");
  };

  // Handle user card click
  const handleUserClick = (user) => {
    if (user) {
      handleViewProfile(user);
    }
  };

  // Debug: Log when state changes
  useEffect(() => {
    console.log("🔄 State updated - suggestedMatches:", suggestedMatches);
  }, [suggestedMatches]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">
              Suggested Matches
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Recommended profiles for you</p>
          </div>
          <div className="px-3 py-1 bg-pink-50 text-[#FF2A6D] rounded-full text-xs font-bold border border-pink-100">
            {suggestedMatches.length} Matches
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-4 animate-pulse bg-slate-50/50 rounded-2xl">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                </div>
                <div className="w-20 h-8 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-8 bg-slate-50/50 rounded-2xl p-4">
            <p className="text-slate-500 text-sm mb-3">{error}</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-[#002060] text-white rounded-xl text-xs font-semibold hover:bg-[#001848] transition cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : suggestedMatches.length === 0 ? (
          /* No Matches State */
          <div className="text-center py-8 bg-slate-50/50 rounded-2xl p-4">
            <p className="text-slate-500 text-sm mb-3">No suggested matches available right now.</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
            >
              Refresh List
            </button>
          </div>
        ) : (
          /* SHOW MATCHES */
          <div className="space-y-3">
            {suggestedMatches.slice(0, 5).map((user, index) => {
              const fullName = getFullName(user);
              const city = getLocation(user);
              const profession = getProfession(user);
              const profileImage = getProfileImage(user);
              const memberId = user.user_id || user.id;
              const isLoading = loadingProfileId === memberId;

              return (
                <div
                  key={user.id || index}
                  className="flex items-center p-3.5 bg-slate-50/60 hover:bg-slate-100/70 rounded-2xl transition-all duration-200 border border-slate-100/80 group"
                >
                  {/* Profile Image */}
                  <div
                    className="relative mr-3.5 cursor-pointer shrink-0"
                    onClick={() => handleUserClick(user)}
                  >
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.onerror = null;
                        const nameForAvatar = fullName.replace(/[^a-zA-Z0-9 ]/g, "");
                        const encodedName = encodeURIComponent(nameForAvatar || "User");
                        e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=002060&color=fff&size=150`;
                      }}
                    />
                  </div>
                  
                  {/* User Info */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-[#002060] transition-colors">
                      {fullName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium truncate">{profession}</p>
                    <div className="flex items-center text-slate-400 text-xs mt-0.5 font-medium truncate">
                      <FiMapPin className="w-3 h-3 text-slate-400 shrink-0 mr-1" />
                      <span>{city}</span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    className={`ml-2 px-3 py-1.5 bg-[#002060] hover:bg-[#001848] text-white text-xs font-semibold rounded-xl transition shadow-2xs shrink-0 cursor-pointer ${
                      isLoading ? "opacity-70 cursor-wait" : ""
                    }`}
                    onClick={() => handleViewProfile(user)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "View"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && suggestedMatches.length > 0 && (
          <button
            onClick={handleViewAll}
            className="w-full mt-5 py-2.5 text-center text-[#FF2A6D] hover:text-[#e0105a] font-bold text-xs sm:text-sm border-t border-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View All Matches ({suggestedMatches.length})</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-2">
          <button
            onClick={fetchMatches}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium inline-flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <FiRefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedMatches;







































































































































