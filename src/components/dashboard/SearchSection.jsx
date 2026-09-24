import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";
import Pagination from "../comman/Pagination";
import ActiveFilterChips from "../comman/ActiveFilterChips";
import { useUrlState } from "../../hooks/useUrlState";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { useDebouncedUrlField } from "../../hooks/useDebouncedUrlField";
import {
  searchUiSchema, SEARCH_DEFAULTS, LIMITS, MODE_FIELDS,
  MARITAL_STATUS_OPTIONS,
} from "../../validations/searchSchemas";
import { toApiParams, pruneToMode } from "../../utils/urlState";

const TABS = [
  { id: "basic", label: "Basic Search", icon: "fa-solid fa-magnifying-glass" },
  { id: "advanced", label: "Advanced Search", icon: "fa-solid fa-sliders" },
  { id: "nearme", label: "Near Me", icon: "fa-solid fa-location-dot" },
];

const FEATURE_BY_TAB = {
  basic: "basic_search",
  advanced: "advance_search",
  nearme: "near_me",
};

/**
 * The search module.
 *
 * Every filter, the active tab and the page number live in the URL, so a search
 * survives a refresh and can be shared. There is no Search button — a change to
 * the URL is the one and only thing that triggers a fetch.
 *
 * Near Me is the exception to "everything in the URL": coordinates are kept out
 * deliberately, so a shared link cannot disclose where the sender was standing.
 * The server resolves them from the stored profile instead.
 */
export default function AdvancedSearch() {
  const navigate = useNavigate();
  const { profile, planLoading, isFeatureAllowed } = useUserProfile();

  // Clearing filters keeps the active tab, so clear-all replaces the query
  // string with just the tab rather than wiping it entirely (which would drop
  // the user back to Basic).
  const { state, setParams, replaceParams } = useUrlState({
    schema: searchUiSchema,
    defaults: SEARCH_DEFAULTS,
  });
  const tab = state.tab;
  const featureKey = FEATURE_BY_TAB[tab] || "basic_search";

  /* ── Near Me location ─────────────────────────────────────────────────── */

  const [coords, setCoords] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const resolveLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationDenied(false);
    try {
      if (profile?.latitude && profile?.longitude) {
        setCoords({ lat: Number(profile.latitude), lon: Number(profile.longitude) });
      } else {
        const { getUserLocation } = await import("../services/geolocationService");
        const position = await getUserLocation();
        setCoords({ lat: position.latitude, lon: position.longitude });
        // Persist so later searches (and shared links opened elsewhere) can be
        // resolved server-side without coordinates travelling in the URL.
        try {
          await api.put("/api/profiles/location", {
            latitude: position.latitude,
            longitude: position.longitude,
          });
        } catch (dbErr) {
          console.warn("Failed to persist user location:", dbErr);
        }
      }
    } catch (err) {
      console.error("Location permission denied or failed:", err);
      setCoords(null);
      setLocationDenied(true);
    } finally {
      setLocationLoading(false);
    }
  }, [profile?.latitude, profile?.longitude]);

  useEffect(() => {
    if (tab === "nearme" && !coords && !locationDenied && !locationLoading) {
      resolveLocation();
    }
  }, [tab, coords, locationDenied, locationLoading, resolveLocation]);

  const nearMeBlocked = tab === "nearme" && !coords;

  /* ── data ─────────────────────────────────────────────────────────────── */

  // Coordinates ride along in the request but never in the address bar. This
  // also covers the first search after a permission prompt, before the profile
  // row has been written.
  const apiParams = {
    ...toApiParams(state, { surface: "search" }),
    ...(tab === "nearme" && coords ? { lat: coords.lat, lon: coords.lon } : {}),
  };

  const { data: results, pagination, filters: appliedFilters, loading, isRefetching, error, errorCode, refetch } =
    useSearchQuery(apiParams, {
      enabled: !planLoading && isFeatureAllowed(featureKey) && !nearMeBlocked,
    });

  /* ── inputs ───────────────────────────────────────────────────────────── */

  const keyword = useDebouncedUrlField("q", state.q, setParams);
  const firstName = useDebouncedUrlField("first_name", state.first_name, setParams);
  const lastName = useDebouncedUrlField("last_name", state.last_name, setParams);
  const profession = useDebouncedUrlField("profession", state.profession, setParams);
  const city = useDebouncedUrlField("city", state.city, setParams);
  const stateField = useDebouncedUrlField("state", state.state, setParams);
  const skills = useDebouncedUrlField("skills", state.skills, setParams);
  const interests = useDebouncedUrlField("interests", state.interests, setParams);

  const setFilter = (key, value) => setParams({ [key]: value === "" ? undefined : value });

  // The slider keeps a local value while dragging and only writes the URL on
  // release. Writing every intermediate value would fire a request — and burn a
  // search against the plan quota — for each tick of the drag.
  const radius = state.radius ?? LIMITS.DEFAULT_RADIUS;
  const [radiusDraft, setRadiusDraft] = useState(radius);
  useEffect(() => setRadiusDraft(radius), [radius]);
  const commitRadius = (value) => {
    const next = Math.min(LIMITS.MAX_RADIUS, Math.max(LIMITS.MIN_RADIUS, Number(value) || LIMITS.DEFAULT_RADIUS));
    setRadiusDraft(next);
    setParams({ radius: next });
  };

  // replaceParams, not setParams: switching tabs has to DROP the filters that
  // do not belong to the new mode, and a merge cannot remove keys.
  const selectTab = (id) => replaceParams(pruneToMode(state, id), { history: "push" });

  const clearAllFilters = () => replaceParams({ tab, page: 1 });

  // Only chip the filters that belong to the active tab, so a stale value can
  // never be advertised for a mode that would not use it.
  const chipFields = MODE_FIELDS[tab] || [];

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition";
  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2";

  // "radius" always has a value on Near Me, so it does not count as a filter
  // the user has actively applied.
  const hasFilters = chipFields.some((k) => k !== "radius" && state[k]);

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Find Your Match</h2>
            <p className="text-sm text-slate-500 mt-1">
              Search by keywords, detailed filter parameters, or find matches physically near your location.
            </p>
          </div>

          {/* Segmented Tab Navigation */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 mb-8">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTab(t.id)}
                className="flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold text-center transition-all duration-200 flex items-center justify-center cursor-pointer"
                style={tab === t.id ? { backgroundColor: "#002060", color: "#ffffff" } : { color: "#64748b" }}
              >
                <i className={`${t.icon} mr-2`}></i>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {!planLoading && !isFeatureAllowed(featureKey) ? (
            <div className="py-6">
              <PlanRestrictionModal
                feature={featureKey}
                onClose={() => {
                  if (isFeatureAllowed("basic_search") && tab !== "basic") selectTab("basic");
                  else navigate("/dashboard");
                }}
              />
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {/* ── Basic ─────────────────────────────────────────────── */}
                {tab === "basic" && (
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className={labelClass}>Keyword Search</label>
                      <input
                        type="text"
                        placeholder="Search by name, skills, interests (e.g. Doctor, React, Traveling...)"
                        {...keyword}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Profession</label>
                        <input type="text" placeholder="e.g. Software Developer" {...profession} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>City</label>
                        <input type="text" placeholder="e.g. London" {...city} className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Advanced ──────────────────────────────────────────── */}
                {tab === "advanced" && (
                  <div className="space-y-6">
                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Personal Information</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>First Name</label>
                          <input type="text" placeholder="First name" {...firstName} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Last Name</label>
                          <input type="text" placeholder="Last name" {...lastName} className={inputClass} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Gender</label>
                          <div className="flex gap-2">
                            {["Male", "Female"].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setFilter("gender", state.gender === option ? "" : option)}
                                className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer"
                                style={
                                  state.gender === option
                                    ? { backgroundColor: "#002060", color: "#ffffff", borderColor: "#002060" }
                                    : { backgroundColor: "#ffffff", color: "#475569", borderColor: "#e2e8f0" }
                                }
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Marital Status</label>
                          <select
                            value={state.marital_status || ""}
                            onChange={(e) => setFilter("marital_status", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm"
                          >
                            <option value="">Any Status</option>
                            {MARITAL_STATUS_OPTIONS.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Min Age</label>
                          <input
                            type="number" min="18" max="100" placeholder="18"
                            value={state.min_age ?? ""}
                            onChange={(e) => setFilter("min_age", e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Max Age</label>
                          <input
                            type="number" min="18" max="100" placeholder="60"
                            value={state.max_age ?? ""}
                            onChange={(e) => setFilter("max_age", e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Professional &amp; Skills</h4>
                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>Profession</label>
                          <input type="text" placeholder="e.g. Software Developer" {...profession} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Skills</label>
                          <input type="text" placeholder="e.g. JavaScript, React, Node.js" {...skills} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Interests</label>
                          <input type="text" placeholder="e.g. Traveling, Music, Sports" {...interests} className={inputClass} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Location Filters</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>City</label>
                          <input type="text" placeholder="City" {...city} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>State</label>
                          <input type="text" placeholder="State" {...stateField} className={inputClass} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Near Me ───────────────────────────────────────────── */}
                {tab === "nearme" && (
                  <div>
                    {locationLoading ? (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8 text-center space-y-3">
                        <div className="text-3xl mx-auto text-blue-600">
                          <i className="fa-solid fa-arrows-spin animate-spin"></i>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">Detecting location...</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Please allow location permissions when prompted by your browser to sync nearby profiles.
                        </p>
                      </div>
                    ) : !coords ? (
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-8 text-center space-y-4">
                        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl shadow-sm">
                          <i className="fa-solid fa-location-dot animate-bounce"></i>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">Location Access Required</h3>
                        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                          To detect other profiles nearby, we need your active coordinates. Please enable your location services and try again.
                        </p>
                        <button
                          type="button"
                          onClick={resolveLocation}
                          className="px-6 py-2.5 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                          style={{ backgroundColor: "#002060" }}
                        >
                          <i className="fa-solid fa-location-crosshairs"></i>
                          <span>Enable Location Access</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                          <div className="text-xs text-emerald-800 flex items-center gap-2">
                            <i className="fa-solid fa-location-crosshairs text-emerald-600 text-sm"></i>
                            <span className="font-semibold">
                              Location acquired — searching {radius} km around you
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={resolveLocation}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition duration-200 shadow-sm flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                          >
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>Update Location</span>
                          </button>
                        </div>

                        <div className="bg-slate-50/70 border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Maximum Search Distance
                              </label>
                              <span className="text-xs font-extrabold text-[#002060] bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                                {radiusDraft} kilometers
                              </span>
                            </div>

                            <div className="relative pt-2">
                              <input
                                type="range"
                                min={LIMITS.MIN_RADIUS}
                                max={LIMITS.MAX_RADIUS}
                                step="1"
                                value={radiusDraft}
                                onChange={(e) => setRadiusDraft(Number(e.target.value))}
                                onPointerUp={(e) => commitRadius(e.target.value)}
                                onKeyUp={(e) => commitRadius(e.target.value)}
                                onTouchEnd={(e) => commitRadius(e.target.value)}
                                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-[#002060] focus:outline-none"
                              />
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-400 font-bold tracking-wider pt-1">
                              <span>1 km</span><span>25 km</span><span>50 km</span><span>75 km</span><span>100 km</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                            <div className="space-y-2">
                              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                                Custom Distance (km)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min={LIMITS.MIN_RADIUS}
                                  max={LIMITS.MAX_RADIUS}
                                  placeholder="e.g. 25"
                                  value={radiusDraft}
                                  onChange={(e) => setRadiusDraft(e.target.value)}
                                  onBlur={(e) => commitRadius(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitRadius(e.target.value); } }}
                                  className="w-full pl-4 pr-12 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition text-sm font-semibold text-slate-800"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-extrabold">km</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                                Specific City Filter
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="e.g. London"
                                  {...city}
                                  className="w-full pl-10 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition text-sm font-semibold text-slate-800"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                  <i className="fa-solid fa-city"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Active filters */}
              {hasFilters && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <ActiveFilterChips
                    fields={chipFields}
                    urlState={state}
                    appliedFilters={appliedFilters}
                    onRemove={(key, resetTo) => setParams({ [key]: resetTo })}
                    onClearAll={clearAllFilters}
                  />
                </div>
              )}

              {/* ── Results ───────────────────────────────────────────────── */}
              <div className="mt-8 border-t border-slate-200 pt-6">
                {nearMeBlocked ? null : loading ? (
                  <div className="space-y-6">
                    <div className="h-6 w-44 bg-slate-100 rounded animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SearchResultSkeleton key={i} showDistance={tab === "nearme"} />
                      ))}
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">{error}</p>
                    {errorCode ? (
                      <PlanRestrictionModal feature={featureKey} onClose={() => navigate("/dashboard")} />
                    ) : (
                      <button
                        onClick={refetch}
                        className="px-6 py-2.5 text-white rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm cursor-pointer"
                        style={{ backgroundColor: "#002060" }}
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                ) : results.length > 0 ? (
                  <div className={`space-y-6 transition-opacity ${isRefetching ? "opacity-60" : "opacity-100"}`}>
                    <h3 className="font-black text-slate-800 tracking-tight text-lg">
                      Search Results ({pagination?.totalCount ?? results.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.map((person) => (
                        <div
                          key={person.user_id || person.id}
                          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                              <img
                                src={
                                  person.image_url && person.image_url !== ""
                                    ? person.image_url.startsWith("http")
                                      ? person.image_url
                                      : `${import.meta.env.VITE_API_BASE_URL}${person.image_url}`
                                    : `https://ui-avatars.com/api/?name=${person.first_name}+${person.last_name}&background=E0F2FE&color=0369A1`
                                }
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${person.first_name}+${person.last_name}&background=E0F2FE&color=0369A1`;
                                }}
                                alt="profile"
                                className="w-16 h-16 rounded-full object-cover border border-slate-100 shadow-sm"
                              />
                              {person.distance_meters != null && (
                                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center border border-white text-[9px] shadow-sm" title="Nearby">
                                  <i className="fa-solid fa-location-dot"></i>
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-bold text-slate-900 truncate">
                                {person.first_name} {person.last_name}
                              </h4>
                              <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
                                {person.profession || "No Profession Listed"}
                              </p>

                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                  {person.city || "N/A"}
                                </span>
                                {person.age > 0 && (
                                  <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                    {person.age} yrs
                                  </span>
                                )}
                                {person.experience && (
                                  <span className="text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                    {person.experience} yrs exp
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {person.about || "No profile description provided."}
                            </p>
                          </div>

                          {person.distance_meters != null && (
                            <div className="mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-100 rounded-lg py-1.5 px-3 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <i className="fa-solid fa-road text-indigo-400"></i> Distance
                              </span>
                              <span>{(person.distance_meters / 1000).toFixed(1)} km away</span>
                            </div>
                          )}

                          <div className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/dashboard/profile/${person.user_id || person.id}`, {
                                  state: { userProfile: person },
                                })
                              }
                              className="flex-1 py-2 text-white rounded-xl text-xs font-bold transition duration-200 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
                              style={{ backgroundColor: "#002060" }}
                            >
                              <FiEye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>
                            <button
                              onClick={() =>
                                navigate("/dashboard/messages", {
                                  state: {
                                    selectedUser: {
                                      id: person.user_id || person.id,
                                      name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
                                      city: person.city,
                                      profession: person.profession,
                                    },
                                  },
                                })
                              }
                              className="flex-1 py-2 bg-pink-50 hover:bg-pink-100 text-[#FF2A6D] border border-pink-200 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <FiMessageSquare className="w-3.5 h-3.5" />
                              <span>Message</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Pagination
                      pagination={pagination}
                      disabled={isRefetching}
                      noun="profiles"
                      onPageChange={(page) => setParams({ page }, { history: "push", resetPage: false })}
                    />
                  </div>
                ) : (
                  <div className="text-center py-14 bg-slate-50/60 rounded-2xl border border-slate-200 space-y-4">
                    <div className="w-16 h-16 bg-white text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-slate-200 shadow-sm">
                      <i className="fa-solid fa-user-slash"></i>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900">No profiles found</h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        {hasFilters
                          ? "No one matches every filter you've applied. Try removing one, or clear them all to start over."
                          : "There are no profiles to show here yet. Check back soon."}
                      </p>
                    </div>
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="px-6 py-2.5 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-sm hover:opacity-95 cursor-pointer inline-flex items-center gap-2"
                        style={{ backgroundColor: "#002060" }}
                      >
                        <i className="fa-solid fa-arrows-rotate"></i>
                        <span>Clear all filters</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchResultSkeleton({ showDistance = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex-shrink-0"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-2/3"></div>
          <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <div className="h-4 bg-slate-100 rounded-md w-16"></div>
            <div className="h-4 bg-slate-100 rounded-md w-12"></div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full"></div>
        <div className="h-3 bg-slate-100 rounded w-4/5"></div>
      </div>

      {showDistance && <div className="mt-3 h-7 bg-slate-50 rounded-lg"></div>}

      <div className="border-t border-slate-100 pt-4 mt-4 flex gap-2">
        <div className="h-8 bg-slate-100 rounded-xl flex-1"></div>
        <div className="h-8 bg-slate-100 rounded-xl flex-1"></div>
      </div>
    </div>
  );
}
