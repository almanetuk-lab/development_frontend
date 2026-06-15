import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/userApi";
import api from "../services/api"; // Your axios instance

const MemberPage = () => {
  const navigate = useNavigate();

  // State for members
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingProfileId, setLoadingProfileId] = useState(null); // Track which profile is loading

  //  ADDED: PLAN STATUS STATE
  const [planActive, setPlanActive] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  //  ADDED: CHECK PLAN STATUS
  useEffect(() => {
    const checkPlanStatus = async () => {
      try {
        const res = await userAPI.getPlanStatus();
        setPlanActive(res.data?.active === true);
      } catch (error) {
        setPlanActive(false);
      } finally {
        setPlanLoading(false);
      }
    };

    checkPlanStatus();
  }, []);

  //  MODIFIED: Initial load of members with plan check
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
      setFilteredMembers(members.slice(0, visibleCount));
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

  // Filter by gender
  useEffect(() => {
    filterMembersByGender();
  }, [selectedGender, members]);

  // Fetch initial members
  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await userAPI.searchProfiles({
        search_mode: "basic",
        first_name: "",
      });

      console.log("Initial members response:", response.data);

      if (response.data) {
        const membersData = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.users || [];

        setMembers(membersData);
        setFilteredMembers(membersData.slice(0, 12));
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      // Fallback dummy data
      setMembers(getDummyMembers());
      setFilteredMembers(getDummyMembers().slice(0, 12));
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
          console.log("CORRECT user profile verified");
          return completeProfile;
        } else {
          console.log(` WRONG user: Expected ${userId}, got ${profileUserId}`);
          return null;
        }
      }
      
      return null;
      
    } catch (error) {
      console.error("❌ Error fetching complete profile:", error);
      return null;
    }
  };

  //  UPDATED: View Profile Function with COMPLETE data fetch
  const handleViewProfile = async (member) => {
    const memberId = member.user_id || member.id;
    const memberName = formatName(member);

    console.log("🎯 VIEW PROFILE CLICKED for user:", memberName, "ID:", memberId);
    console.log("Current member data (partial):", member);

    //  ADDED: PLAN CHECK
    if (!planActive) {
      navigate("/dashboard/upgrade");
      return;
    }

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
            from: "member_page_complete"
          }
        });
      } else {
        console.log("⚠️ Complete profile not found, using partial data");
        
        // Fallback: Use partial member data
        navigate(`/dashboard/profile/${memberId}`, {
          state: {
            userProfile: member, // Only basic data
            memberId: memberId,
            name: memberName,
            from: "member_page_partial"
          }
        });
      }
    } catch (error) {
      console.error("❌ Navigation error:", error);
      
      // Final fallback: Navigate without state
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      // Hide loading
      setLoadingProfileId(null);
    }
  };

  // Perform search using API
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members.slice(0, 12));
      setVisibleCount(12);
      return;
    }

    try {
      setSearchLoading(true);

      const response = await userAPI.searchProfiles({
        search_mode: "basic",
        first_name: searchTerm,
      });

      console.log("Search response:", response.data);

      if (response.data) {
        const searchResults = Array.isArray(response.data)
          ? response.data
          : response.data.data || response.data.users || [];

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
          setFilteredMembers(genderFiltered.slice(0, 12));
        } else {
          setFilteredMembers(searchResults.slice(0, 12));
        }
        setVisibleCount(12);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Filter members by gender
  const filterMembersByGender = () => {
    if (selectedGender === "All") {
      setFilteredMembers(members.slice(0, 12));
    } else {
      const filtered = members.filter((member) => {
        const memberGender = member.gender?.toLowerCase();
        const selected = selectedGender.toLowerCase();
        return (
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female")
        );
      });
      setFilteredMembers(filtered.slice(0, 12));
    }
    setVisibleCount(12);
  };

  // Load More function
  const loadMoreMembers = () => {
    const newVisibleCount = visibleCount + 12;
    setVisibleCount(newVisibleCount);

    if (selectedGender === "All") {
      if (searchTerm.trim()) {
        const searchResults = members;
        setFilteredMembers(searchResults.slice(0, newVisibleCount));
      } else {
        setFilteredMembers(members.slice(0, newVisibleCount));
      }
    } else {
      const filtered = members.filter((member) => {
        const memberGender = member.gender?.toLowerCase();
        const selected = selectedGender.toLowerCase();
        return (
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female")
        );
      });
      setFilteredMembers(filtered.slice(0, newVisibleCount));
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

  //  FIXED: Chat Function
  const handleSendMessage = async (memberId, memberName = "") => {
    try {
      console.log("💬 CHAT CLICKED for:", memberName, "ID:", memberId);
      
      // Navigate to messages page with user info
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
      // Fallback navigation
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

  // Dummy data fallback
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
      image_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
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
      image_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
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
      image_url:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h-300&fit=crop&crop=face",
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
      image_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h-300&fit=crop&crop=face",
    },
  ];

  // Calculate if there are more members to load
  const hasMoreMembers = () => {
    if (selectedGender === "All") {
      return members.length > visibleCount;
    } else {
      const filtered = members.filter((member) => {
        const memberGender = member.gender?.toLowerCase();
        const selected = selectedGender.toLowerCase();
        return (
          memberGender === selected ||
          (selected === "man" && memberGender === "male") ||
          (selected === "woman" && memberGender === "female")
        );
      });
      return filtered.length > visibleCount;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/*  ADDED: PLAN CHECK MODAL */}
      {!planLoading && !planActive && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
            <h2 className="text-xl font-bold mb-3">
              Membership Required 🔒
            </h2>
            <p className="text-gray-600 mb-4">
              Please upgrade your plan to access member profiles and chat features.
            </p>
            <button
              onClick={() => navigate("/dashboard/upgrade")}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
      
      {/* Search Section */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search Members by name, profession or city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      //  MODIFIED: Added plan check
                      disabled={!planActive || searchLoading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {searchLoading ? (
                        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="w-full md:w-48">
                    <select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="All">All Genders</option>
                      <option value="Man">Men</option>
                      <option value="Woman">Women</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-all"
                  >
                    Search
                  </button>
                </div>

                {/* Results Count */}
                <div className="text-center text-gray-600">
                  {searchLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <div>
                      Showing {filteredMembers.length} of {members.length}{" "}
                      members
                      {searchTerm && (
                        <span className="ml-2 text-sm text-amber-600">
                          for "{searchTerm}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-0 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-300 rounded-lg flex-1"></div>
                    <div className="h-10 bg-gray-300 rounded-lg flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.slice(0, visibleCount).map((member) => {
                const memberId = member.user_id || member.id;
                const isLoading = loadingProfileId === memberId;
                
                return (
                  <div
                    key={member.id || member.user_id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-amber-100"
                  >
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={
                          member.image_url && member.image_url !== "Not provided"
                            ? member.image_url
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                formatName(member)
                              )}&background=random&size=400`
                        }
                        alt={formatName(member)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            formatName(member)
                          )}&background=random&size=400`;
                        }}
                      />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 truncate">
                        {formatName(member)}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <svg
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm truncate">
                          {member.profession || "Profession not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                        <svg
                          className="w-4 h-4 text-gray-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{getDisplayCity(member)}</span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            console.log("🟢 VIEW PROFILE BUTTON CLICKED");
                            console.log("Member:", member);
                            console.log("Using user_id:", member.user_id);
                            console.log("Member Name:", formatName(member));
                            
                            // ✅ Use updated handleViewProfile with complete data fetch
                            handleViewProfile(member);
                          }}
                          disabled={isLoading}
                          className={`flex-1 bg-amber-500 text-white py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                            isLoading ? "opacity-70 cursor-wait" : ""
                          }`}
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

                        <button
                          onClick={() => {
                            console.log("💬 CHAT BUTTON CLICKED");
                            console.log("For user_id:", member.user_id);
                            console.log("Name:", formatName(member));
                            
                            // ✅ Use user_id for chat
                            handleSendMessage(member.user_id, formatName(member));
                          }}
                          className="flex-1 border border-amber-500 text-amber-600 py-2.5 rounded-lg font-semibold hover:bg-amber-50 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMoreMembers() && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreMembers}
                  className="px-8 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Load More Members
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No members found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedGender("All");
                setVisibleCount(12);
                fetchMembers();
              }}
              className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition hover:-translate-y-0.5"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPage;



























































































































































