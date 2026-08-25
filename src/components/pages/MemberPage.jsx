import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/userApi";
import api from "../services/api"; 
import ImageModal from "../comman/ImageModal";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";

const MemberPage = () => {
  const navigate = useNavigate();

  // State for members
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCity, setSelectedCity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // State for Image Modal
  const [modalImage, setModalImage] = useState({ isOpen: false, url: "", title: "" });

  const { activePlan, planLoading, isFeatureAllowed } = useUserProfile();
  const planActive = isFeatureAllowed("browse_members");

  // Initial load of members with plan check
  useEffect(() => {
    if (!planLoading && planActive) {
      fetchMembers();
    }
  }, [planLoading, planActive]);

  // Search with debounce
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 500);

    setDebounceTimer(timer);

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [searchTerm]);

  // Filter members dynamically when filter states change
  useEffect(() => {
    applyAllFilters();
  }, [selectedGender, selectedCity, minAge, maxAge, members]);

  // Reset pagination to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGender, selectedCity, minAge, maxAge]);

  const applyAllFilters = () => {
    let result = members.filter((member) => {
      // 1. Gender Filter
      if (selectedGender !== "All" && selectedGender !== "") {
        const selected = selectedGender.toLowerCase();
        const memberGender = (member.gender || "").toLowerCase();
        const matchesGender =
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female");
        if (!matchesGender) return false;
      }

      // 2. City Filter
      if (selectedCity && selectedCity.trim() !== "") {
        const cityTerm = selectedCity.toLowerCase().trim();
        const memberCity = (member.city || member.address || "").toLowerCase();
        if (!memberCity.includes(cityTerm)) return false;
      }

      // 3. Min Age Filter
      if (minAge !== "" && !isNaN(Number(minAge))) {
        const age = Number(member.age);
        if (isNaN(age) || age < Number(minAge)) return false;
      }

      // 4. Max Age Filter
      if (maxAge !== "" && !isNaN(Number(maxAge))) {
        const age = Number(member.age);
        if (isNaN(age) || age > Number(maxAge)) return false;
      }

      return true;
    });

    setFilteredMembers(result);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedGender("All");
    setSelectedCity("");
    setMinAge("");
    setMaxAge("");
  };

  // Fetch initial members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.searchProfiles({
        search_mode: "basic",
        first_name: "",
      });

      if (response.data) {
        const membersData = Array.isArray(response.data)
          ? response.data
          : response.data.results || response.data.data || response.data.users || [];

        setMembers(membersData);
        setFilteredMembers(membersData);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers(getDummyMembers());
      setFilteredMembers(getDummyMembers());
    } finally {
      setLoading(false);
    }
  };

  // Fetch COMPLETE user profile
  const fetchCompleteProfile = async (userId) => {
    try {
      console.log(`🔍 Fetching complete profile for user ${userId}...`);
      const response = await api.get(`/api/users/${userId}`);

      if (response.data) {
        let completeProfile = {};
        if (response.data.data) {
          completeProfile = {
            ...response.data.data,
            prompts: response.data.prompts || {}
          };
        } else {
          completeProfile = response.data;
          if (response.data.prompts && !completeProfile.prompts) {
            completeProfile.prompts = response.data.prompts;
          }
        }

        const profileUserId = completeProfile.user_id || completeProfile.id;
        if (profileUserId == userId) {
          return completeProfile;
        }
      }
      return null;
    } catch (error) {
      console.error("❌ Error fetching complete profile:", error);
      return null;
    }
  };

  const handleViewProfile = async (member) => {
    const memberId = member.user_id || member.id;
    const memberName = formatName(member);

    if (!planActive) {
      navigate("/dashboard/upgrade");
      return;
    }

    try {
      setLoadingProfileId(memberId);
      const completeProfile = await fetchCompleteProfile(memberId);

      if (completeProfile) {
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: completeProfile,
            memberId: memberId,
            name: memberName,
            from: "member_page_complete"
          }
        });
      } else {
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: member,
            memberId: memberId,
            name: memberName,
            from: "member_page_partial"
          }
        });
      }
    } catch (error) {
      console.error("❌ Navigation error:", error);
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      setLoadingProfileId(null);
    }
  };

  // Perform search using API
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      applyAllFilters();
      return;
    }

    try {
      setSearchLoading(true);
      const response = await userAPI.searchProfiles({
        search_mode: "basic",
        first_name: searchTerm,
      });

      if (response.data) {
        const searchResults = Array.isArray(response.data)
          ? response.data
          : response.data.results || response.data.data || response.data.users || [];

        setMembers(searchResults);

        if (selectedGender !== "All") {
          const genderFiltered = searchResults.filter((member) => {
            const memberGender = member.gender?.toLowerCase();
            const selected = selectedGender.toLowerCase();
            return (
              memberGender === selected ||
              (selected === "man" && memberGender === "male") ||
              (selected === "woman" && memberGender === "female")
            );
          });
          setFilteredMembers(genderFiltered);
        } else {
          setFilteredMembers(searchResults);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    performSearch();
  };

  // Chat Function
  const handleSendMessage = async (memberId, memberName = "") => {
    try {
      navigate(`/dashboard/messages`, {
        state: {
          selectedUser: {
            id: memberId,
            name: memberName,
            receiverId: memberId
          }
        }
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      navigate(`/dashboard/messages`, {
        state: {
          selectedUser: {
            id: memberId,
            name: memberName
          }
        }
      });
    }
  };

  // Helper function to format name
  const formatName = (member) => {
    if (member.first_name && member.last_name) {
      return `${member.first_name} ${member.last_name}`;
    }
    return member.name || `User ${member.id || member.user_id}`;
  };

  // Helper function to get display city
  const getDisplayCity = (member) => {
    if (member.city) {
      return `${member.city}, India`;
    }
    return member.address || "Location not specified";
  };

  const getDummyMembers = () => [
    {
      id: 1,
      user_id: 1,
      first_name: "Pihu",
      last_name: "Malik",
      age: 26,
      gender: "Woman",
      city: "Delhi",
      profession: "Fashion Designer",
      image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    },
    {
      id: 2,
      user_id: 2,
      first_name: "Ishaan",
      last_name: "Kumar",
      age: 38,
      gender: "Man",
      city: "Panaji",
      profession: "Software Engineer",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    },
    {
      id: 3,
      user_id: 3,
      first_name: "Priya",
      last_name: "Sharma",
      age: 29,
      gender: "Woman",
      city: "Mumbai",
      profession: "Doctor",
      image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h-300&fit=crop&crop=face",
    },
    {
      id: 4,
      user_id: 4,
      first_name: "Krish",
      last_name: "Ghosh",
      age: 32,
      gender: "Man",
      city: "Kolkata",
      profession: "Business Owner",
      image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h-300&fit=crop&crop=face",
    },
  ];

  const totalMembers = members.length;
  const filteredTotal = filteredMembers.length;
  const totalPages = Math.ceil(filteredTotal / ITEMS_PER_PAGE);

  const indexOfLastMember = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstMember = indexOfLastMember - ITEMS_PER_PAGE;
  const visibleMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  return (
    <div className="w-full bg-slate-50/30 min-h-screen">
      
      {/* Plan Restricted Modal Backdrop */}
      {!planLoading && !planActive && (
        <PlanRestrictionModal feature="members" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <i className="fa-solid fa-users text-indigo-600"></i>
              Browse Members
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore the entire community, find matching professions, or connect with members nearby.
            </p>
          </div>

          <div className="text-xs bg-slate-100 text-slate-600 font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-155 flex items-center gap-2 self-stretch md:self-auto justify-center">
            <i className="fa-solid fa-layer-group text-slate-400"></i>
            <span>Total: {filteredTotal} Members</span>
          </div>
        </div>

        {/* Search & Filters Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            
            {/* Search Input Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search members by name, job description or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950 placeholder-slate-400"
                  disabled={!planActive || searchLoading}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center">
                  {searchLoading ? (
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-sm hover:opacity-95 shrink-0"
                style={{ backgroundColor: "#002060" }}
                disabled={!planActive}
              >
                Search
              </button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Gender Preference
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950"
                  disabled={!planActive}
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
                  disabled={!planActive}
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
                  disabled={!planActive}
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
                  disabled={!planActive}
                />
              </div>
            </div>

            {/* Results metadata + reset controls */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500 gap-2">
              <div>
                {searchLoading ? (
                  <span className="flex items-center gap-2 text-indigo-600">
                    <i className="fa-solid fa-spinner animate-spin"></i> Searching Database...
                  </span>
                ) : (
                  <span>
                    Showing <span className="text-indigo-600 font-extrabold">{filteredTotal}</span> results
                  </span>
                )}
              </div>

              {(selectedGender !== "All" || selectedCity || minAge || maxAge || searchTerm) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-rose-600 hover:text-rose-800 transition flex items-center gap-1 cursor-pointer"
                >
                  Reset All Filters <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Members Grid Deck */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200"></div>
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
          ) : visibleMembers.length > 0 ? (
            <div className="space-y-8">
              
              {/* Grid cards listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleMembers.map((member) => {
                  const memberId = member.user_id || member.id;
                  const isLoading = loadingProfileId === memberId;
                  const displayName = formatName(member);
                  const displayCity = getDisplayCity(member);
                  
                  const imgSrc = member.image_url && member.image_url !== "Not provided"
                    ? member.image_url
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=400`;

                  return (
                    <div
                      key={member.id || member.user_id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      {/* Media Header block */}
                      <div
                        className="relative h-48 overflow-hidden bg-slate-100 cursor-pointer group"
                        onClick={() => setModalImage({ isOpen: true, url: imgSrc, title: displayName })}
                      >
                        <img
                          src={imgSrc}
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
                      </div>

                      {/* Card Content details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        
                        <div className="space-y-1.5">
                          <div className="cursor-pointer" onClick={() => handleViewProfile(member)}>
                            <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-tight truncate">
                              {displayName}
                            </h3>
                            {member.profession ? (
                              <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">{member.profession}</p>
                            ) : (
                              <p className="text-xs font-semibold text-slate-400 italic truncate mt-0.5">Profession not specified</p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {member.age && member.age > 0 && <span>{member.age} yrs</span>}
                            {member.gender && <span>• {member.gender}</span>}
                          </div>
                        </div>

                        {/* Location Details Meta */}
                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center gap-1.5 truncate">
                          <i className="fa-solid fa-location-dot text-slate-400 w-4 text-center"></i>
                          <span>{displayCity}</span>
                        </div>

                        {/* Buttons Block */}
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleViewProfile(member)}
                            disabled={isLoading}
                            className="flex-1 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            style={{ backgroundColor: "#002060" }}
                          >
                            {isLoading ? (
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <i className="fa-solid fa-eye text-xs"></i>
                                <span>Profile</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleSendMessage(memberId, displayName)}
                            className="flex-1 py-2 bg-pink-50 hover:bg-pink-100 text-[#FF2A6D] border border-pink-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <i className="fa-solid fa-comment-dots text-xs"></i>
                            <span>Chat</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Numbered Pagination bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Showing {indexOfFirstMember + 1} - {Math.min(indexOfLastMember, filteredTotal)} of {filteredTotal} members
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
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-users-slash animate-bounce"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900">No Members Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria, keywords, or filters to explore other profiles.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-sm hover:opacity-95"
                style={{ backgroundColor: "#002060" }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Image Modal Lightbox */}
      <ImageModal
        isOpen={modalImage.isOpen}
        imageUrl={modalImage.url}
        title={modalImage.title}
        onClose={() => setModalImage({ isOpen: false, url: "", title: "" })}
      />
    </div>
  );
};

export default MemberPage;
