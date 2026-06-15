import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";
import api from "../services/api"; 

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
          return;b 
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
    const userId = user.user_id || user.id;
    if (userId) {
      // Navigate directly without fetching complete data
      navigate(`/dashboard/profile/${userId}`);
    }
  };

  // Debug: Log when state changes
  useEffect(() => {
    console.log("🔄 State updated - suggestedMatches:", suggestedMatches);
  }, [suggestedMatches]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Suggested Matches
            </h3>
            <p className="text-sm text-gray-500 mt-1">People you might like</p>
          </div>
          <div className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-sm text-sm font-medium">
            {suggestedMatches.length} matches
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center p-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-6">
            <div className="text-red-500 mb-3">
              <div className="text-lg mb-1">⚠️</div>
              {error}
            </div>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : suggestedMatches.length === 0 ? (
          // No Matches State
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4 text-4xl">👥</div>
            <p className="text-gray-600 mb-2">No suggested matches found</p>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Refresh
            </button>
          </div>
        ) : (
          //  SHOW MATCHES (SIRF 3 FIELDS)
          <div className="space-y-3">
            {suggestedMatches.slice(0, 5).map((user, index) => {
              const fullName = getFullName(user);
              const city = getLocation(user); // SIRF CITY
              const profession = getProfession(user);
              const profileImage = getProfileImage(user);
              const memberId = user.user_id || user.id;
              const isLoading = loadingProfileId === memberId;

              console.log(`User ${index}:`, {
                fullName,
                city,
                profession,
                userData: user,
              });

              return (
                <div
                  key={user.id || index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100"
                >
                  {/* Profile Image */}
                  <div
                    className="relative mr-4 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        const nameForAvatar = fullName.replace(/[^a-zA-Z0-9 ]/g, "");
                        const encodedName = encodeURIComponent(nameForAvatar || "User");
                        e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&size=150`;
                      }}
                    />
                  </div>
                  
                  {/* User Info - SIRF 3 FIELDS */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {fullName}
                    </h4>

                    <p className="text-gray-600 font-medium">{profession}</p>

                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{city}</span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition ${
                      isLoading ? "opacity-70 cursor-wait" : ""
                    }`}
                    onClick={() => handleViewProfile(user)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      "View Profile"
                    )}
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
            className="w-full mt-6 py-3 text-center text-blue-600 font-medium border-t border-gray-200 hover:text-blue-700 transition"
          >
            View All Matches ({suggestedMatches.length})
          </button>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-4">
          <button
            onClick={fetchMatches}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center mx-auto"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedMatches;







































































































































