import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSuggestedMatches } from "../services/chatApi";
import api from "../services/api"; 
import ImageModal from "../comman/ImageModal";

export default function MatchesPage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);

  // Filter States
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCity, setSelectedCity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Image Modal State
  const [modalImage, setModalImage] = useState({ isOpen: false, url: "", title: "" });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching normal matches...");
      const apiData = await getSuggestedMatches();
      let matchesData = [];

      if (apiData && Array.isArray(apiData)) {
        matchesData = apiData;
      } else if (apiData && apiData.data && Array.isArray(apiData.data)) {
        matchesData = apiData.data;
      } else if (apiData && apiData.matches && Array.isArray(apiData.matches)) {
        matchesData = apiData.matches;
      }

      console.log(`✅ Found ${matchesData.length} matches`);
      setMatches(matchesData);
    } catch (err) {
      console.error("❌ Error fetching matches:", err);
      setError(`Failed to load matches: ${err.message || "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompleteProfile = async (userId, currentUserId) => {
    try {
      console.log(`🔍 Fetching profile for user ${userId}`);
      if (userId == currentUserId) {
        const response = await api.get("/api/me");
        if (response.data) {
          const completeProfile = {
            ...response.data.data,
            prompts: response.data.prompts || {}
          };
          if (completeProfile.prompts && completeProfile.prompts["question-key"]) {
            try {
              const parsed = JSON.parse(completeProfile.prompts["question-key"]);
              completeProfile.prompts = {
                ...completeProfile.prompts,
                ...parsed
              };
              delete completeProfile.prompts["question-key"];
            } catch (error) {
              console.error("Error parsing question-key:", error);
            }
          }
          return completeProfile;
        }
      }

      const profileResponse = await api.get(`/api/users/${userId}`);
      const basicProfile = profileResponse.data.data || profileResponse.data;
      let promptsData = {};

      try {
        const promptsResponse = await api.get(`/api/users/${userId}/public-prompts`);
        if (promptsResponse.data) {
          promptsData = promptsResponse.data;
        }
      } catch (error) {
        console.log("⚠️ Public prompts API not available");
      }

      return {
        ...basicProfile,
        prompts: promptsData
      };
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      return null;
    }
  };

  const handleSendMessage = async (memberId, memberName = "") => {
    try {
      navigate(`/dashboard/messages`, {
        state: {
          selectedUser: {
            id: memberId,
            name: memberName,
            receiverId: memberId,
          },
        },
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      navigate(`/dashboard/messages`, {
        state: {
          selectedUser: {
            id: memberId,
            name: memberName,
          },
        },
      });
    }
  };

  const handleViewProfile = async (match) => {
    const memberId = match.user_id || match.id;
    const memberName = getDisplayName(match);
    try {
      setLoadingProfileId(memberId);
      const completeProfile = await fetchCompleteProfile(memberId);
      if (completeProfile) {
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: completeProfile,
            memberId: memberId,
            name: memberName,
            from: "matches_page_complete"
          }
        });
      } else {
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: match,
            memberId: memberId,
            name: memberName,
            from: "matches_page_partial"
          }
        });
      }
    } catch (error) {
      console.error("❌ Error in handleViewProfile:", error);
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      setLoadingProfileId(null);
    }
  };

  const getDisplayName = (user) => {
    if (!user) return "User";
    if (user.full_name && user.full_name.trim()) return user.full_name;
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    if (user.profession && user.profession.trim()) return user.profession;
    if (user.company && user.company.trim()) return user.company;
    return `User ${user.user_id || user.id || ""}`;
  };

  const getProfileImage = (user) => {
    if (!user) {
      return "https://ui-avatars.com/api/?name=User&background=random&color=fff&size=150";
    }
    if (user.image_url && user.image_url.trim()) return user.image_url;
    const displayName = getDisplayName(user);
    const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
    const encodedName = encodeURIComponent(nameForAvatar || "User");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff&bold=true&size=150`;
  };

  const getLocation = (user) => {
    if (!user) return "Location not set";
    const locations = [];
    if (user.city && user.city.trim()) locations.push(user.city);
    if (user.state && user.state.trim() && !locations.includes(user.state)) {
      locations.push(user.state);
    }
    if (user.country && user.country.trim() && !locations.includes(user.country)) {
      locations.push(user.country);
    }
    return locations.length > 0 ? locations.join(", ") : "Location not set";
  };

  const getSkills = (user) => {
    if (!user) return [];
    if (user.skills && Array.isArray(user.skills)) {
      return user.skills.filter(skill => skill && typeof skill === "string" && skill.trim()).slice(0, 5);
    }
    return [];
  };

  const getInterests = (user) => {
    if (!user) return [];
    if (user.interests && Array.isArray(user.interests)) {
      return user.interests.filter(interest => interest && typeof interest === "string" && interest.trim()).slice(0, 5);
    }
    return [];
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Reset page to 1 when filters are changed
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGender, selectedCity, minAge, maxAge, searchTerm]);

  const handleResetFilters = () => {
    setSelectedGender("All");
    setSelectedCity("");
    setMinAge("");
    setMaxAge("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const filteredMatches = matches.filter((match) => {
    if (selectedGender !== "All" && selectedGender !== "") {
      const selected = selectedGender.toLowerCase();
      const g = (match.gender || "").toLowerCase();
      const matchesGender =
        g === selected ||
        (selected === "man" && g === "male") ||
        (selected === "woman" && g === "female");
      if (!matchesGender) return false;
    }

    if (selectedCity && selectedCity.trim() !== "") {
      const cityTerm = selectedCity.toLowerCase().trim();
      const city = (match.city || match.state || match.country || match.address || "").toLowerCase();
      if (!city.includes(cityTerm)) return false;
    }

    if (minAge !== "" && !isNaN(Number(minAge))) {
      const age = Number(match.age);
      if (isNaN(age) || age < Number(minAge)) return false;
    }

    if (maxAge !== "" && !isNaN(Number(maxAge))) {
      const age = Number(match.age);
      if (isNaN(age) || age > Number(maxAge)) return false;
    }

    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      const name = getDisplayName(match).toLowerCase();
      const prof = (match.profession || "").toLowerCase();
      if (!name.includes(term) && !prof.includes(term)) return false;
    }

    return true;
  });

  const totalMatches = matches.length;
  const filteredTotal = filteredMatches.length;
  const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);

  const indexOfLastMatch = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMatch = indexOfLastMatch - ITEMS_PER_PAGE;
  const visibleMatches = filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);

  const onlineNow = filteredMatches.filter((match) => match.is_active === true).length;
  const verifiedProfiles = filteredMatches.filter((match) => match.is_submitted === true).length;
  const averageMatchScore = filteredMatches.length > 0
    ? Math.round(filteredMatches.reduce((sum, match) => sum + (match.match_score || 0), 0) / filteredMatches.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse flex flex-col space-y-2">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-slate-200 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                    <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <i className="fa-solid fa-people-arrows text-indigo-600"></i>
              My Matches
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Connect with profiles calculated to complement your preferences and values.
            </p>
          </div>

          <div className="text-xs bg-slate-100 text-slate-600 font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-155 flex items-center gap-2 self-stretch md:self-auto justify-center">
            <i className="fa-solid fa-layer-group text-slate-400"></i>
            <span>Total: {filteredTotal} Matches Found</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Matches Found", val: filteredTotal, color: "text-[#002060]", icon: "fa-solid fa-users bg-blue-50 text-blue-700" },
            { label: "Verified Members", val: verifiedProfiles, color: "text-blue-600", icon: "fa-solid fa-user-shield bg-blue-50 text-blue-600" },
            { label: "Avg Compatibility", val: `${Math.min(100, Math.round((averageMatchScore / 45) * 100))}%`, color: "text-[#FF2A6D]", icon: "fa-solid fa-heart bg-rose-50 text-rose-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${stat.icon}`}></div>
              <div>
                <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-filter text-slate-500"></i>
              Filter Suggested Matches
            </h3>
            {(selectedGender !== "All" || selectedCity || minAge || maxAge || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold uppercase tracking-wider transition"
              >
                Reset All Filters <i className="fa-solid fa-xmark ml-0.5"></i>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Name / Job Title
              </label>
              <input
                type="text"
                placeholder="Search matching names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Gender Preference
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950"
              >
                <option value="All">All Genders</option>
                <option value="Man">Men</option>
                <option value="Woman">Women</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                City / Region
              </label>
              <input
                type="text"
                placeholder="Filter by city..."
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Min Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                placeholder="e.g. 21"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Max Age
              </label>
              <input
                type="number"
                min="18"
                max="100"
                placeholder="e.g. 40"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950"
              />
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-150 rounded-2xl flex items-center justify-between gap-3 text-sm">
            <div className="text-rose-700 font-semibold flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-rose-500 text-lg"></i>
              <span>{error}</span>
            </div>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-rose-100 text-rose-800 rounded-xl hover:bg-rose-200 transition text-xs font-bold uppercase tracking-wider"
            >
              Retry Load
            </button>
          </div>
        )}

        {/* Grid & Results */}
        {visibleMatches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
              <i className="fa-solid fa-users-slash animate-bounce"></i>
            </div>
            <h3 className="text-lg font-black text-slate-900">No Matches Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              We couldn't find any match records aligning with your active parameters.
            </p>
            <button
              onClick={fetchMatches}
              className="px-6 py-3 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-sm hover:opacity-95"
              style={{ backgroundColor: "#002060" }}
            >
              <i className="fa-solid fa-rotate mr-1"></i> Refresh Matches
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Matches Deck Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleMatches.map((match, index) => {
                const displayName = getDisplayName(match);
                const location = getLocation(match);
                const profileImage = getProfileImage(match);
                const skills = getSkills(match);
                const interests = getInterests(match);
                const isOnline = match.is_active === true;
                const isVerified = match.is_submitted === true;
                const memberId = match.user_id || match.id;
                const isLoading = loadingProfileId === memberId;

                return (
                  <div
                    key={match.id || match.user_id || index}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    {/* Media Header */}
                    <div
                      className="relative h-48 overflow-hidden bg-slate-100 cursor-pointer group"
                      onClick={() => setModalImage({ isOpen: true, url: profileImage, title: displayName })}
                    >
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          const nameForAvatar = displayName.replace(/[^a-zA-Z0-9 ]/g, "");
                          const encodedName = encodeURIComponent(nameForAvatar || "User");
                          e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=E0F2FE&color=0369A1&bold=true&size=150`;
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-slate-900/80 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl backdrop-blur-sm shadow flex items-center gap-1.5">
                          <i className="fa-solid fa-expand"></i> View Image
                        </span>
                      </div>


                      {/* Verified Badge */}
                      {isVerified && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-blue-500">
                            <i className="fa-solid fa-circle-check text-xs"></i>
                            Verified
                          </span>
                        </div>
                      )}

                      {/* Match Score */}
                      {match.match_score > 0 && (
                        <div className="absolute bottom-3 right-3">
                          <span className="text-white text-xs px-3 py-1 rounded-lg font-black tracking-tight shadow-md flex items-center gap-1 border border-slate-700/55" style={{ backgroundColor: "#002060" }}>
                            <i className="fa-solid fa-heart text-[10px] text-pink-500 animate-pulse"></i>
                            {Math.min(100, Math.round((match.match_score / 45) * 100))}% Match
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between">
                          <div className="cursor-pointer flex-1" onClick={() => handleViewProfile(match)}>
                            <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-tight">{displayName}</h3>
                            {match.profession && (
                              <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">{match.profession}</p>
                            )}
                          </div>
                          <button className="text-slate-300 hover:text-rose-500 transition text-lg self-start">
                            <i className="fa-regular fa-heart"></i>
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {match.age && match.age > 0 && <span>{match.age} yrs</span>}
                          {match.gender && <span>• {match.gender}</span>}
                          {match.marital_status && <span>• {match.marital_status}</span>}
                        </div>
                      </div>

                      {/* Details Meta */}
                      <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                        {location !== "Location not set" && (
                          <p className="flex items-center gap-1.5 truncate">
                            <i className="fa-solid fa-location-dot text-slate-400 w-4 text-center"></i>
                            <span>{location}</span>
                          </p>
                        )}

                        {match.company && (
                          <p className="flex items-center gap-1.5 truncate">
                            <i className="fa-solid fa-briefcase text-slate-400 w-4 text-center"></i>
                            <span>{match.company}</span>
                          </p>
                        )}
                      </div>

                      {/* Skills Tags list */}
                      {(skills.length > 0 || interests.length > 0) && (
                        <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-3">
                          {skills.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))}
                          {interests.slice(0, 2).map((interest, idx) => (
                            <span key={idx} className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons footer */}
                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleViewProfile(match)}
                          disabled={isLoading}
                          className="flex-1 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          style={{ backgroundColor: "#002060" }}
                        >
                          {isLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <i className="fa-solid fa-eye"></i>
                              <span>Profile</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleSendMessage(memberId, displayName)}
                          className="flex-1 py-2 bg-pink-50 hover:bg-pink-100 text-[#FF2A6D] border border-pink-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <i className="fa-solid fa-comment-dots text-xs"></i>
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  Showing {indexOfFirstMatch + 1} - {Math.min(indexOfLastMatch, filteredTotal)} of {filteredTotal} matches
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => {
                    const isSelected = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center"
                        style={
                          isSelected
                            ? { backgroundColor: "#002060", color: "#ffffff" }
                            : { border: "1px solid #e2e8f0", backgroundColor: "#ffffff", color: "#475569" }
                        }
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media lightbox modal */}
      <ImageModal
        isOpen={modalImage.isOpen}
        imageUrl={modalImage.url}
        title={modalImage.title}
        onClose={() => setModalImage({ isOpen: false, url: "", title: "" })}
      />
    </div>
  );
}
