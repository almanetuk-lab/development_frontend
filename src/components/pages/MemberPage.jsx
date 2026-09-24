import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ImageModal from "../comman/ImageModal";
import Pagination from "../comman/Pagination";
import ActiveFilterChips from "../comman/ActiveFilterChips";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";
import { useUrlState } from "../../hooks/useUrlState";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { useDebouncedUrlField } from "../../hooks/useDebouncedUrlField";
import { membersUiSchema, MEMBERS_DEFAULTS, GENDER_OPTIONS, MODE_FIELDS } from "../../validations/searchSchemas";
import { toApiParams } from "../../utils/urlState";

/**
 * Browse Members.
 *
 * The URL is the single source of truth for every filter and the page number,
 * so the view is reload-safe and shareable. Filtering and pagination happen on
 * the server: this page used to fetch a single ~100-row page and filter/slice it
 * in the browser, which made member #101 unreachable and made the displayed
 * total wrong.
 */
const MemberPage = () => {
  const navigate = useNavigate();
  const [loadingProfileId, setLoadingProfileId] = useState(null);
  const [modalImage, setModalImage] = useState({ isOpen: false, url: "", title: "" });

  const { planLoading, isFeatureAllowed } = useUserProfile();
  const planActive = isFeatureAllowed("browse_members");

  const { state, setParams, reset } = useUrlState({
    schema: membersUiSchema,
    defaults: MEMBERS_DEFAULTS,
  });

  const { data: members, pagination, filters: appliedFilters, loading, isRefetching, error, errorCode, refetch } =
    useSearchQuery(toApiParams(state, { surface: "members" }), {
      enabled: !planLoading && planActive,
    });

  // Text inputs keep their own state and write to the URL on a debounce, so
  // typing stays responsive and the caret never jumps.
  const searchField = useDebouncedUrlField("q", state.q, setParams);
  const cityField = useDebouncedUrlField("city", state.city, setParams);
  const minAgeField = useDebouncedUrlField("min_age", state.min_age, setParams);
  const maxAgeField = useDebouncedUrlField("max_age", state.max_age, setParams);

  // Discrete controls commit immediately — waiting on a select feels broken.
  const setFilter = (key, value) => setParams({ [key]: value === "" ? undefined : value });

  const hasFilters = Boolean(
    state.q || state.city || state.gender || state.min_age || state.max_age
  );
  const totalCount = pagination?.totalCount ?? 0;

  /* ── navigation helpers (unchanged behaviour) ───────────────────────────── */

  const fetchCompleteProfile = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      if (!response.data) return null;

      const completeProfile = response.data.data
        ? { ...response.data.data, prompts: response.data.prompts || {} }
        : response.data;

      const profileUserId = completeProfile.user_id || completeProfile.id;
      return String(profileUserId) === String(userId) ? completeProfile : null;
    } catch (err) {
      console.error("Error fetching complete profile:", err);
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
      navigate(`/dashboard/profile/${memberId}`, {
        state: {
          userProfile: completeProfile || member,
          memberId,
          name: memberName,
          from: completeProfile ? "member_page_complete" : "member_page_partial",
        },
      });
    } catch (err) {
      console.error("Navigation error:", err);
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      setLoadingProfileId(null);
    }
  };

  const handleSendMessage = (memberId, memberName = "") => {
    navigate(`/dashboard/messages`, {
      state: { selectedUser: { id: memberId, name: memberName, receiverId: memberId } },
    });
  };

  const formatName = (member) => {
    if (member.first_name && member.last_name) {
      return `${member.first_name} ${member.last_name}`;
    }
    return member.name || `User ${member.id || member.user_id}`;
  };

  const getDisplayCity = (member) => {
    if (member.city) return member.city;
    return member.address || "Location not specified";
  };

  const inputClass =
    "w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950 placeholder-slate-400";

  return (
    <div className="w-full bg-slate-50/30 min-h-screen">
      {!planLoading && !planActive && <PlanRestrictionModal feature="members" />}

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

          <div className="text-xs bg-slate-100 text-slate-600 font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 self-stretch md:self-auto justify-center">
            <i className="fa-solid fa-layer-group text-slate-400"></i>
            <span>Total: {totalCount} Members</span>
          </div>
        </div>

        {/* Search & Filters Panel — no submit button, filters apply reactively */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search members by name, profession or city..."
              {...searchField}
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition text-sm text-slate-950 placeholder-slate-400"
              disabled={!planActive}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center justify-center">
              {isRefetching ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Gender Preference
              </label>
              <select
                value={state.gender || ""}
                onChange={(e) => setFilter("gender", e.target.value)}
                className={inputClass}
                disabled={!planActive}
              >
                <option value="">All Genders</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "Male" ? "Men" : option === "Female" ? "Women" : option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                City / Region
              </label>
              <input type="text" placeholder="Filter by city..." {...cityField} className={inputClass} disabled={!planActive} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Min Age
              </label>
              <input type="number" min="18" max="100" placeholder="e.g. 21" {...minAgeField} className={inputClass} disabled={!planActive} />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Max Age
              </label>
              <input type="number" min="18" max="100" placeholder="e.g. 40" {...maxAgeField} className={inputClass} disabled={!planActive} />
            </div>
          </div>

          {hasFilters && (
            <div className="pt-4 border-t border-slate-100">
              <ActiveFilterChips
                fields={MODE_FIELDS.members}
                urlState={state}
                appliedFilters={appliedFilters}
                onRemove={(key, resetTo) => setParams({ [key]: resetTo })}
                onClearAll={reset}
              />
            </div>
          )}
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
                      <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* A real error state. This page used to fall back to four hardcoded
               dummy members, which made an API failure look like a short result set. */
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 className="text-lg font-black text-slate-900">Could not load members</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">{error}</p>
              {errorCode ? (
                <PlanRestrictionModal feature="members" />
              ) : (
                <button
                  onClick={refetch}
                  className="px-6 py-3 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-sm hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: "#002060" }}
                >
                  Try Again
                </button>
              )}
            </div>
          ) : members.length > 0 ? (
            <div className={`space-y-8 transition-opacity ${isRefetching ? "opacity-60" : "opacity-100"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member) => {
                  const memberId = member.user_id || member.id;
                  const isLoadingProfile = loadingProfileId === memberId;
                  const displayName = formatName(member);
                  const displayCity = getDisplayCity(member);

                  const imgSrc =
                    member.image_url && member.image_url !== "Not provided"
                      ? member.image_url
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=400`;

                  return (
                    <div
                      key={memberId}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
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

                        <div className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center gap-1.5 truncate">
                          <i className="fa-solid fa-location-dot text-slate-400 w-4 text-center"></i>
                          <span>{displayCity}</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleViewProfile(member)}
                            disabled={isLoadingProfile}
                            className="flex-1 py-2 text-white rounded-xl text-xs font-bold transition shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            style={{ backgroundColor: "#002060" }}
                          >
                            {isLoadingProfile ? (
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

              <Pagination
                pagination={pagination}
                disabled={isRefetching}
                noun="members"
                onPageChange={(page) =>
                  setParams({ page }, { history: "push", resetPage: false })
                }
              />
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
              {hasFilters && (
                <button
                  onClick={reset}
                  className="px-6 py-3 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-sm hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: "#002060" }}
                >
                  Reset Search Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

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
