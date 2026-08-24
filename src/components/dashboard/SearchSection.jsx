// src/components/chatsystem/AdvancedSearch.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";
import api from "../services/api";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";

export default function AdvancedSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "basic");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const [restrictionFeature, setRestrictionFeature] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const DEFAULT_RADIUS = 10;
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
    radius: DEFAULT_RADIUS,
    distance: DEFAULT_RADIUS,
    lat: "",
    lon: "",
  });

  const { activePlan, planLoading, isFeatureAllowed } = useUserProfile();
  const plan = {
    loading: planLoading,
    active: activePlan?.active === true,
    daysLeft: activePlan?.days_left || 0,
  };

  const getFeatureKey = (tab) => {
    if (tab === "basic") return "basic_search";
    if (tab === "advanced") return "advance_search";
    if (tab === "nearme") return "near_me";
    return "basic_search";
  };

  const [locationDenied, setLocationDenied] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const locationDeniedRef = useRef(false);
  const filtersRef = useRef(filters);
  
  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { locationDeniedRef.current = locationDenied; }, [locationDenied]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const getLiveLocation = async () => {
    setLocationLoading(true);
    setLocationDenied(false);
    try {
      const { getUserLocation } = await import("../services/geolocationService");
      const coords = await getUserLocation();
      handleInputChange("lat", coords.latitude);
      handleInputChange("lon", coords.longitude);
      setLocationDenied(false);
      
      try {
        await api.put("/api/profiles/location", {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (dbErr) {
        console.warn("Failed to update user location in profile DB:", dbErr);
      }
    } catch (err) {
      console.error("Location permission denied or failed:", err);
      setLocationDenied(true);
      setFilters((prev) => ({ ...prev, lat: "", lon: "" }));
      setSearchResults([]);
    } finally {
      setLocationLoading(false);
    }
  };

  // Plan status is now handled globally by UserProfileContext

  useEffect(() => {
    if (activeTab === "nearme") {
      getLiveLocation();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!plan.loading && plan.active) {
      const delayDebounceFn = setTimeout(() => {
        performSearch();
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [
    activeTab,
    plan.loading,
    plan.active,
    filters.radius,
    filters.lat,
    filters.lon
  ]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchResults([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalResults(0);

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
        radius: DEFAULT_RADIUS,
        distance: DEFAULT_RADIUS,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        radius: prev.radius || DEFAULT_RADIUS,
        distance: prev.distance || DEFAULT_RADIUS,
      }));
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "distance" || field === "radius") {
      const normalized = value === "" || value === null ? DEFAULT_RADIUS : Math.max(1, Number(value));
      setFilters((prev) => ({ ...prev, distance: normalized, radius: normalized }));
      return;
    }
    const numFields = ["min_age", "max_age", "lat", "lon"];
    if (numFields.includes(field)) {
      const normalized = value === "" || value === null ? "" : Number(value);
      setFilters((prev) => ({ ...prev, [field]: normalized }));
      return;
    }
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const performSearch = async (pageNumber = 1) => {
    if (searchLimitReached) {
      setRestrictionFeature(getFeatureKey(activeTab));
      return;
    }

    setLoading(true);
    if (pageNumber === 1) {
      setSearchResults([]);
    }

    try {
      let searchParams = {
        page: pageNumber,
        limit: 6,
      };

      if (activeTab === "basic") {
        searchParams = {
          ...searchParams,
          search_mode: "basic",
          first_name: filters.basicSearch,
          profession: filters.profession,
          city: filters.city,
        };
      }

      if (activeTab === "advanced") {
        searchParams = {
          ...searchParams,
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
        const denied = locationDeniedRef.current;
        const currentFilters = filtersRef.current;
        if (denied || !currentFilters.lat || !currentFilters.lon) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        const radVal = typeof currentFilters.radius === "number" && !isNaN(currentFilters.radius) && currentFilters.radius >= 1
          ? currentFilters.radius
          : DEFAULT_RADIUS;
        searchParams = {
          ...searchParams,
          search_mode: "nearme",
          radius: radVal,
          lat: currentFilters.lat,
          lon: currentFilters.lon,
        };
        if (currentFilters.city && typeof currentFilters.city === "string" && currentFilters.city.trim() !== "") {
          searchParams.city = currentFilters.city.trim();
        }
      }

      const response = await api.get("/search", { params: searchParams });
      const data = response.data || {};
      const results = data.results || [];
      const total = data.total || 0;
      const totalP = data.totalPages || 1;
      const currentP = data.page || 1;

      setSearchResults(results);
      setTotalResults(total);
      setTotalPages(totalP);
      setCurrentPage(currentP);
    } catch (error) {
      console.error("Search error:", error);

      if (error.response?.status === 403 && error.response?.data?.code === "SEARCH_LIMIT_EXCEEDED") {
        setSearchLimitReached(true);
        setRestrictionFeature(getFeatureKey(activeTab));
        return;
      }

      if (error.response?.status === 403 && error.response?.data?.code === "NO_ACTIVE_PLAN") {
        setRestrictionFeature(getFeatureKey(activeTab));
        return;
      }

      alert("Search failed: " + (error.response?.data?.message || "Please check your connection and try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    performSearch();
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Main Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Find Your Match
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Search by keywords, detailed filter parameters, or find matches physically near your location.
            </p>
          </div>
          {/* Segmented Tab Navigation */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 mb-8">
            {[
              { id: "basic", label: "Basic Search", icon: <i className="fa-solid fa-magnifying-glass mr-2"></i> },
              { id: "advanced", label: "Advanced Search", icon: <i className="fa-solid fa-sliders mr-2"></i> },
              { id: "nearme", label: "Near Me", icon: <i className="fa-solid fa-location-dot mr-2"></i> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className="flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all duration-200 flex items-center justify-center"
                style={
                  activeTab === tab.id
                    ? { backgroundColor: "#002060", color: "#ffffff" }
                    : { color: "#64748b" }
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Feature Guard Check */}
          {!plan.loading && !isFeatureAllowed(getFeatureKey(activeTab)) ? (
            <div className="py-6">
              <PlanRestrictionModal 
                feature={getFeatureKey(activeTab)} 
                onClose={() => {
                  if (isFeatureAllowed("basic_search") && activeTab !== "basic") {
                    setActiveTab("basic");
                  } else {
                    navigate("/dashboard");
                  }
                }} 
              />
            </div>
          ) : (
            <>
              {/* Forms Section */}
              <div className="space-y-6">
            {/* Basic Search Tab */}
            {activeTab === "basic" && (
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Keyword Search
                    </label>
                    <input
                      type="text"
                      placeholder="Search by name, skills, interests (e.g. Doctor, React, Traveling...)"
                      value={filters.basicSearch}
                      onChange={(e) => handleInputChange("basicSearch", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Profession
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Software Developer"
                        value={filters.profession}
                        onChange={(e) => handleInputChange("profession", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. London"
                        value={filters.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Advanced Search Tab */}
            {activeTab === "advanced" && (
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Personal Section */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Personal Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="First name"
                        value={filters.first_name}
                        onChange={(e) => handleInputChange("first_name", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={filters.last_name}
                        onChange={(e) => handleInputChange("last_name", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Gender
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleInputChange("gender", filters.gender === "Male" ? "" : "Male")}
                          className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200"
                          style={
                            filters.gender === "Male"
                              ? { backgroundColor: "#002060", color: "#ffffff", borderColor: "#002060" }
                              : { backgroundColor: "#ffffff", color: "#475569", borderColor: "#e2e8f0" }
                          }
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInputChange("gender", filters.gender === "Female" ? "" : "Female")}
                          className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200"
                          style={
                            filters.gender === "Female"
                              ? { backgroundColor: "#002060", color: "#ffffff", borderColor: "#002060" }
                              : { backgroundColor: "#ffffff", color: "#475569", borderColor: "#e2e8f0" }
                          }
                        >
                          Female
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Marital Status
                      </label>
                      <select
                        value={filters.marital_status}
                        onChange={(e) => handleInputChange("marital_status", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm"
                      >
                        <option value="">Any Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Min Age
                      </label>
                      <input
                        type="number"
                        placeholder="18"
                        value={filters.min_age}
                        onChange={(e) => handleInputChange("min_age", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Max Age
                      </label>
                      <input
                        type="number"
                        placeholder="60"
                        value={filters.max_age}
                        onChange={(e) => handleInputChange("max_age", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Section */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Professional & Skills
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Profession
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Software Developer"
                        value={filters.profession}
                        onChange={(e) => handleInputChange("profession", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Skills
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={filters.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Interests
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Traveling, Music, Sports"
                        value={filters.interests}
                        onChange={(e) => handleInputChange("interests", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Location Filters
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="State"
                        value={filters.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Near Me Tab */}
            {activeTab === "nearme" && (
              <form onSubmit={handleSearch} className="space-y-6">
                {locationLoading ? (
                  <div className="bg-blue-50/50 border border-blue-150 rounded-2xl p-8 text-center space-y-3">
                    <div className="text-3xl mx-auto text-blue-600">
                      <i className="fa-solid fa-arrows-spin animate-spin"></i>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Detecting location...
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Please allow location permissions when prompted by your browser to sync nearby profiles.
                    </p>
                  </div>
                ) : locationDenied || !filters.lat || !filters.lon ? (
                  <div className="bg-rose-50/50 border border-rose-150 rounded-2xl p-8 text-center space-y-4">
                    <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-sm">
                      <i className="fa-solid fa-location-dot animate-bounce"></i>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      Location Access Required
                    </h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      To detect other profiles nearby, we need your active coordinates. Please enable your location services and refresh.
                    </p>
                    <button
                      type="button"
                      onClick={getLiveLocation}
                      disabled={locationLoading}
                      className="px-6 py-2.5 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md inline-flex items-center gap-2"
                      style={{ backgroundColor: "#002060" }}
                    >
                      <i className="fa-solid fa-location-crosshairs"></i>
                      <span>{locationLoading ? "Requesting..." : "Enable Location Access"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Location Detection Banner */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                      <div className="text-xs text-emerald-800 flex items-center gap-2">
                        <i className="fa-solid fa-location-crosshairs text-emerald-600 text-sm"></i>
                        <span className="font-semibold">
                          Location acquired: {Number(filters.lat).toFixed(4)}, {Number(filters.lon).toFixed(4)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={getLiveLocation}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition duration-200 shadow-sm flex items-center gap-1.5 flex-shrink-0"
                      >
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <span>Update Location</span>
                      </button>
                    </div>

                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-6">
                      {/* Radius slider */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Search Radius
                          </label>
                          <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ backgroundColor: "#002060" }}>
                            {filters.radius} km
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          step="1"
                          value={filters.radius}
                          onChange={(e) => handleInputChange("radius", e.target.value)}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900 focus:outline-none focus:ring-2 focus:ring-slate-350"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                          <span>1 km</span>
                          <span>25 km</span>
                          <span>50 km</span>
                          <span>75 km</span>
                          <span>100 km</span>
                        </div>
                      </div>

                      {/* Precise radius input + City */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Radius (km)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              placeholder="e.g. 25"
                              value={filters.radius}
                              onChange={(e) => handleInputChange("radius", e.target.value)}
                              className="w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm font-medium"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none font-bold">km</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            City Filter
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. London"
                            value={filters.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className="w-full px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Search Trigger Button */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading || searchLimitReached || (activeTab === "nearme" && (locationDenied || !filters.lat || !filters.lon))}
              className="w-full py-3.5 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:opacity-95"
              style={{ backgroundColor: "#002060" }}
            >
              {searchLimitReached ? (
                <>
                  <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                  <span>Search Limit Reached</span>
                </>
              ) : activeTab === "nearme" && (locationDenied || !filters.lat || !filters.lon) ? (
                <>
                  <i className="fa-solid fa-location-crosshairs mr-1.5"></i>
                  <span>Location Required</span>
                </>
              ) : loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                  <span>Searching Profiles...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass mr-1.5"></i>
                  <span>
                    Search {activeTab === "basic" ? "Matches" : activeTab === "advanced" ? "Advanced Parameters" : "Nearby"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Search Results Block */}
          {searchResults.length > 0 && (
            <div className="mt-8 border-t border-slate-200 pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-800 tracking-tight text-lg">
                  Search Results ({totalResults})
                </h3>
              </div>

              {/* 2-Column Responsive Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((profile) => (
                  <div
                    key={profile.user_id || profile.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar container */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            profile.image_url && profile.image_url !== ""
                              ? profile.image_url.startsWith("http")
                                ? profile.image_url
                                : `${import.meta.env.VITE_API_BASE_URL}${profile.image_url}`
                              : `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=E0F2FE&color=0369A1`
                          }
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=E0F2FE&color=0369A1`;
                          }}
                          alt="profile"
                          className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                        {activeTab === "nearme" && profile.distance_meters !== undefined && profile.distance_meters !== null && (
                          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center border border-white text-[9px] shadow-sm animate-pulse" title="Nearby">
                            <i className="fa-solid fa-location-dot"></i>
                          </span>
                        )}
                      </div>

                      {/* Header details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-slate-900 truncate">
                          {profile.first_name} {profile.last_name}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                          {profile.profession || "No Profession Listed"}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {profile.city || "N/A"}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {profile.age} yrs
                          </span>
                          {profile.experience && (
                            <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                              {profile.experience} yrs exp
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* About Snippet */}
                    <div className="mt-4">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {profile.about || "No profile description provided."}
                      </p>
                    </div>

                    {/* Proximity tag */}
                    {activeTab === "nearme" && profile.distance_meters !== undefined && profile.distance_meters !== null && (
                      <div className="mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-100 rounded-lg py-1.5 px-3 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <i className="fa-solid fa-road text-indigo-400"></i>
                          Distance
                        </span>
                        <span>{(profile.distance_meters / 1000).toFixed(1)} km away</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="border-t border-slate-150 pt-4 mt-4 flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/profile/${profile.user_id || profile.id}`, {
                          state: { userProfile: profile }
                        })}
                        className="flex-1 py-2 text-white rounded-xl text-xs font-bold transition duration-200 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
                        style={{ backgroundColor: "#002060" }}
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => navigate("/dashboard/messages", {
                          state: {
                            selectedUser: {
                              id: profile.user_id || profile.id,
                              name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
                              email: profile.email,
                              city: profile.city,
                              profession: profile.profession,
                            },
                          },
                        })}
                        className="flex-1 py-2 bg-pink-50 hover:bg-pink-100 text-[#FF2A6D] border border-pink-200 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FiMessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination block */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => performSearch(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 border border-slate-250 rounded-xl text-xs uppercase tracking-wider font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Page {currentPage} of {totalPages} ({totalResults} results)
                  </span>
                  <button
                    onClick={() => performSearch(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 border border-slate-250 rounded-xl text-xs uppercase tracking-wider font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* No results block */}
          {!loading && searchResults.length === 0 && (
            <div className="text-center py-12 text-slate-400 font-semibold text-sm">
              <i className="fa-solid fa-circle-info text-slate-350 text-2xl block mb-2"></i>
              No profiles found matching your filters.
            </div>
          )}
            </>
          )}
        </div>
      </div>
      {restrictionFeature && (
        <PlanRestrictionModal 
          feature={restrictionFeature} 
          onClose={() => setRestrictionFeature(null)} 
        />
      )}
    </div>
  );
}
