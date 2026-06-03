// src/components/chatsystem/AdvancedSearch.jsx
import React, { useEffect, useState } from "react";
import { adminAPI } from "../services/adminApi";
import api from "../services/api";
export default function AdvancedSearch() {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLimitReached, setSearchLimitReached] = useState(false);

  const [filters, setFilters] = useState({
    basicSearch: "",
    first_name: "",
    last_name: "",
    gender: "",
    marital_status: "",
    profession: "",
    skills: "",
    interests: "",
    city: "",
    state: "",
    min_age: "",
    max_age: "",
    radius: "",
    distance: "10",
    lat: "",
    lon: "",
  });
  //new code added now ik
  const [plan, setPlan] = useState({
    loading: true,
    active: false,
    daysLeft: 0,
  });

  /* improved geolocation handling (alert removed earlier, now clean console logging) */
  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Your browser does not support location access.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleInputChange("lat", pos.coords.latitude);
        handleInputChange("lon", pos.coords.longitude);
        console.log(
          "GPS location fetched:",
          pos.coords.latitude,
          pos.coords.longitude,
        );
      },
      () => {
        alert("Location permission denied. Please allow location access.");
      },
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 },
    );
  };

  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const res = await api.get("api/me/plan-status");
        setPlan({
          loading: false,
          active: res.data?.active,
          daysLeft: res.data?.days_left,
        });
      } catch (err) {
        setPlan({
          loading: false,
          active: false,
          daysLeft: 0,
        });
      }
    };

    fetchPlanStatus();
  }, []);
  useEffect(() => {
    if (activeTab === "nearme" && !filters.lat && !filters.lon) {
      getLiveLocation();
    }
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    if (!plan.loading && !plan.active) {
      alert(
        "Your subscription has expired. Please upgrade to use search features.",
      );
      return;
    }
    setActiveTab(tabId);

    if (tabId !== "advanced") {
      setFilters((prev) => ({
        ...prev,
        first_name: "",
        last_name: "",
        gender: "",
        marital_status: "",
        skills: "",
        interests: "",
        min_age: "",
        max_age: "",
        state: "",
      }));
    }

    if (tabId !== "nearme") {
      setFilters((prev) => ({
        ...prev,
        radius: "",
      }));
    }
  };

  const handleInputChange = (field, value) => {
    const numFields = ["min_age", "max_age", "radius", "lat", "lon"];
    if (numFields.includes(field)) {
      const normalized = value === "" || value === null ? "" : Number(value);
      setFilters((prev) => ({ ...prev, [field]: normalized }));
      return;
    }
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // const performSearch = async () => {
  //   if (!plan.loading && !plan.active) {
  //     alert(
  //       "Your subscription has expired. Please upgrade to use search features.",
  //     );
  //     return;
  //   }
  //   // yeh add kiya h
  //   setLoading(true);
  //   setSearchResults([]);

  //   try {
  //     let searchParams = {};

  //     const cleanValue = (val) => {
  //       if (val === undefined || val === null) return "";
  //       if (typeof val === "string") return val.trim();
  //       return val;
  //     };

  //     if (activeTab === "basic") {
  //       searchParams = { search_mode: "basic" };
  //       if (filters.basicSearch)
  //         searchParams.first_name = cleanValue(filters.basicSearch);
  //       if (filters.profession)
  //         searchParams.profession = cleanValue(filters.profession);
  //       if (filters.city) searchParams.city = cleanValue(filters.city);
  //     }

  //     if (activeTab === "advanced") {
  //       searchParams = {
  //         search_mode: "advanced",
  //         first_name: cleanValue(filters.first_name),
  //         last_name: cleanValue(filters.last_name),
  //         gender: cleanValue(filters.gender),
  //         marital_status: cleanValue(filters.marital_status),
  //         profession: cleanValue(filters.profession),
  //         skills: cleanValue(filters.skills),
  //         interests: cleanValue(filters.interests),
  //         city: cleanValue(filters.city),
  //         state: cleanValue(filters.state),
  //         min_age: filters.min_age,
  //         max_age: filters.max_age,
  //       };
  //     }

  //     if (activeTab === "nearme") {
  //       searchParams = {
  //         search_mode: "nearme",
  //         radius: Number(filters.radius || filters.distance),
  //         lat: filters.lat,
  //         lon: filters.lon,
  //         city: cleanValue(filters.city),
  //       };
  //     }

  //     const cleanParams = Object.fromEntries(
  //       Object.entries(searchParams).filter(([key, value]) => {
  //         if (key === "lat" || key === "lon") return true;
  //         if (["min_age", "max_age", "radius"].includes(key)) {
  //           return value !== "" && value !== null && !isNaN(value);
  //         }
  //         return (
  //           value !== "" &&
  //           value !== null &&
  //           value !== undefined &&
  //           !(typeof value === "string" && value.trim() === "")
  //         );
  //       }),
  //     );

  //     console.log("Shraddha Final Params:", cleanParams);

  //     const response = await adminAPI.searchProfiles(cleanParams);
  //     setSearchResults(response.data || []);
  //   } catch (error) {
  //     console.error("Search API error:", error);
  //     alert("Search failed: " + (error.response?.data?.error || error.message));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const performSearch = async () => {
    if (searchLimitReached) {
      alert("Your people search limit is over. Please upgrade your plan.");
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      let searchParams = {};

      if (activeTab === "basic") {
        searchParams = {
          search_mode: "basic",
          first_name: filters.basicSearch,
          profession: filters.profession,
          city: filters.city,
        };
      }

      if (activeTab === "advanced") {
        searchParams = {
          search_mode: "advanced",
          first_name: filters.first_name,
          last_name: filters.last_name,
          gender: filters.gender,
          marital_status: filters.marital_status,
          profession: filters.profession,
          skills: filters.skills,
          interests: filters.interests,
          city: filters.city,
          state: filters.state,
          min_age: filters.min_age,
          max_age: filters.max_age,
        };
      }

      if (activeTab === "nearme") {
        searchParams = {
          search_mode: "nearme",
          radius: Number(filters.radius || filters.distance),
          lat: filters.lat,
          lon: filters.lon,
          city: filters.city,
        };
      }

      const response = await api.get("/search", { params: searchParams });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Search error:", error);

      if (
        error.response?.status === 403 &&
        error.response?.data?.code === "SEARCH_LIMIT_EXCEEDED"
      ) {
        setSearchLimitReached(true);
        alert("Your people search limit is over. Please upgrade.");
        return;
      }

      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    performSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Find Your Match
          </h2>
          {!plan.loading && (
            <div
              className={`mb-4 p-3 rounded text-center text-sm ${
                plan.active
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {plan.active ? (
                <> Plan active — {plan.daysLeft} days left</>
              ) : (
                <>❌ No active subscription</>
              )}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: "basic", label: "🔍 Basic Search" },
              { id: "advanced", label: "⚡ Advanced Search" },
              { id: "nearme", label: "📍 Near Me" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Basic Search Tab */}
            {activeTab === "basic" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Quick Search
                  </h3>
                  <p className="text-gray-600">
                    Find matches with simple keywords
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search by name, profession, skills, or interests
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doctor, JavaScript, Traveling, Mumbai..."
                      value={filters.basicSearch}
                      onChange={(e) =>
                        handleInputChange("basicSearch", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profession
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Developer, Doctor"
                        value={filters.profession}
                        onChange={(e) =>
                          handleInputChange("profession", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter city"
                        value={filters.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Advanced Search Tab */}
            {activeTab === "advanced" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Advanced Search
                  </h3>
                  <p className="text-gray-600">
                    Filter matches with detailed criteria
                  </p>
                </div>

                {/* Personal Information Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Personal Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="First name"
                        value={filters.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={filters.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "gender",
                            filters.gender === "Male" ? "" : "Male",
                          )
                        }
                        className={`px-6 py-2 border rounded-md transition-colors ${
                          filters.gender === "Male"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "gender",
                            filters.gender === "Female" ? "" : "Female",
                          )
                        }
                        className={`px-6 py-2 border rounded-md transition-colors ${
                          filters.gender === "Female"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marital Status
                    </label>
                    <select
                      value={filters.marital_status}
                      onChange={(e) =>
                        handleInputChange("marital_status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Age
                      </label>
                      <input
                        type="number"
                        placeholder="18"
                        value={filters.min_age}
                        onChange={(e) =>
                          handleInputChange("min_age", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Age
                      </label>
                      <input
                        type="number"
                        placeholder="60"
                        value={filters.max_age}
                        onChange={(e) =>
                          handleInputChange("max_age", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Professional Information
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profession
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Software Developer"
                        value={filters.profession}
                        onChange={(e) =>
                          handleInputChange("profession", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={filters.skills}
                        onChange={(e) =>
                          handleInputChange("skills", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Traveling, Music, Sports"
                        value={filters.interests}
                        onChange={(e) =>
                          handleInputChange("interests", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Location
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="State"
                        value={filters.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Near Me Tab */}
            {activeTab === "nearme" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Find Nearby Matches
                  </h3>
                  <p className="text-gray-600">
                    Connect with people in your area
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Distance: Within {filters.distance} km
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={filters.distance}
                        onChange={(e) =>
                          handleInputChange("distance", e.target.value)
                        }
                        className="w-full"
                        disabled={!filters.lat || !filters.lon}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 km</span>
                        <span>25 km</span>
                        <span>50 km</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={filters.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Radius (km)
                        </label>
                        <input
                          type="number"
                          placeholder="Search radius"
                          value={filters.radius}
                          onChange={(e) =>
                            handleInputChange("radius", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Search Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {/* 
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || searchLimitReached}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-lg transition-colors ${
                loading || searchLimitReached
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {searchLimitReached
                ? "🔒 Search limit over"
                : loading
                  ? "🔍 Searching..."
                  : `🔍 Search ${
                      activeTab === "basic"
                        ? "Matches"
                        : activeTab === "advanced"
                          ? "Advanced"
                          : "Nearby"
                    }`}
            </button> */}

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || searchLimitReached}
              className={`w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-lg transition-colors ${
                loading || searchLimitReached
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {searchLimitReached
                ? "🔒 Search limit over"
                : loading
                  ? "🔍 Searching..."
                  : `🔍 Search ${
                      activeTab === "basic"
                        ? "Matches"
                        : activeTab === "advanced"
                          ? "Advanced"
                          : "Nearby"
                    }`}
            </button>
          </div>

          {/* Search Results */}
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Search Results ({searchResults.length})
              </h3>

              <div className="grid gap-4">
                {searchResults.map((profile) => (
                  <div
                    key={profile.user_id || profile.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-5">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            profile.image_url && profile.image_url !== ""
                              ? profile.image_url.startsWith("http")
                                ? profile.image_url
                                : `${import.meta.env.VITE_API_BASE_URL}${profile.image_url}`
                              : `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}`
                          }
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}`;
                          }}
                          alt="profile"
                          className="w-24 h-24 rounded-full object-cover border"
                        />
                      </div>

                      {/* Profile Info */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {profile.first_name} {profile.last_name}
                        </h4>

                        <p className="text-gray-600 text-sm mt-1">
                          {profile.profession} • {profile.city}
                        </p>

                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {profile.about}
                        </p>
                      </div>

                      {/* Right Side Stats */}
                      <div className="text-right text-sm text-gray-500">
                        <p>{profile.age} years</p>
                        <p>{profile.experience} yrs exp</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!loading && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No results found. Try adjusting your search criteria.
            </div>
          )}

          {!loading && searchResults.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {/* No results found. Try adjusting your search criteria. */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
