import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAISuggestions, setRefinedQuery, getActiveRefinedQuery, clearRefinedQuery } from "../services/chatApi";
import api from "../services/api";
import SpiderGraph from "./SpiderGraph";

// ── Priority chip data ──────────────────────────────────────────────────────
const PRIORITY_CHIPS = [
  { id: "emotional_support",      label: "Emotional Support",      emoji: "💛", gradient: "from-amber-400 to-orange-400",   ring: "ring-amber-300",  bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  { id: "professional_alignment", label: "Professional Alignment", emoji: "💼", gradient: "from-blue-500 to-cyan-500",      ring: "ring-blue-300",   bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  { id: "lifestyle_sync",        label: "Lifestyle Sync",         emoji: "🌿", gradient: "from-emerald-400 to-teal-400",   ring: "ring-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { id: "shared_ambition",       label: "Shared Ambition",        emoji: "🚀", gradient: "from-violet-500 to-purple-500",  ring: "ring-violet-300", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  { id: "calm_communication",    label: "Calm Communication",     emoji: "🕊️", gradient: "from-sky-400 to-indigo-400",     ring: "ring-sky-300",    bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-200" },
  { id: "long_term_stability",   label: "Long-Term Stability",    emoji: "🏡", gradient: "from-rose-400 to-pink-400",      ring: "ring-rose-300",   bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200" },
];

export default function AISuggestions() {
  const navigate = useNavigate();

  // ── Suggestion state ────────────────────────────────────────
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);

  // ── Refinement state ────────────────────────────────────────
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [rawQuery, setRawQuery] = useState("");
  const [refinementLoading, setRefinementLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [refinementMeta, setRefinementMeta] = useState(null);
  const [showCard, setShowCard] = useState(true);

  // ── Fetch suggestions (handles both refined & normal responses) ──
  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🤖 Fetching AI suggestions...");

      const data = await getAISuggestions();
      console.log("✅ AI suggestions loaded:", data);

      // Handle refined response shape { suggestions: [], refinement: {} }
      if (data && data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setRefinementMeta(data.refinement || null);
      } else if (Array.isArray(data)) {
        setSuggestions(data);
        setRefinementMeta(null);
      } else {
        setSuggestions([]);
        setRefinementMeta(null);
      }
    } catch (err) {
      console.error("❌ Error fetching AI suggestions:", err);
      setError(err.message || "Failed to retrieve AI-based suggestions.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Check for active refinement session on mount ──────────────
  const checkActiveSession = useCallback(async () => {
    try {
      const data = await getActiveRefinedQuery();
      if (data.active && data.session) {
        setActiveSession(data.session);
        setSelectedPriorities(data.session.selected_priorities || []);
        setRawQuery(data.session.raw_query || "");
        setShowCard(false); // Collapse if already active
      }
    } catch (err) {
      console.warn("⚠️ Could not check active session:", err.message);
    }
  }, []);

  useEffect(() => {
    checkActiveSession();
    fetchSuggestions();
  }, [checkActiveSession, fetchSuggestions]);

  // ── Priority chip toggle ──────────────────────────────────────
  const togglePriority = (id) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 3) return prev; // Max 3
      return [...prev, id];
    });
  };

  // ── Apply refinement ──────────────────────────────────────────
  const handleApplyRefinement = async () => {
    if (selectedPriorities.length === 0) return;
    try {
      setRefinementLoading(true);
      console.log("🔮 Applying refinement:", selectedPriorities);
      const result = await setRefinedQuery(selectedPriorities, rawQuery);
      console.log("✅ Refinement session created:", result);
      setActiveSession(result.session);
      setShowCard(false);
      // Reload suggestions with the new session active
      await fetchSuggestions();
    } catch (err) {
      console.error("❌ Refinement error:", err);
    } finally {
      setRefinementLoading(false);
    }
  };

  // ── Clear refinement ──────────────────────────────────────────
  const handleClearRefinement = async () => {
    try {
      setRefinementLoading(true);
      await clearRefinedQuery();
      setActiveSession(null);
      setSelectedPriorities([]);
      setRawQuery("");
      setRefinementMeta(null);
      setShowCard(true);
      await fetchSuggestions();
    } catch (err) {
      console.error("❌ Clear refinement error:", err);
    } finally {
      setRefinementLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────
  const fetchCompleteProfile = async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ Error fetching complete profile:", error);
      return null;
    }
  };

  const handleViewProfile = async (user) => {
    const memberId = user.user_id || user.id;
    const memberName = user.name || "User";
    try {
      setLoadingProfileId(memberId);
      const completeProfile = await fetchCompleteProfile(memberId);
      navigate(`/dashboard/profile/${memberId}`, {
        state: {
          userProfile: completeProfile || user,
          memberId,
          name: memberName,
          from: "ai_suggestions",
        },
      });
    } catch (error) {
      navigate(`/dashboard/profile/${memberId}`);
    } finally {
      setLoadingProfileId(null);
    }
  };

  const handleSendMessage = (memberId, memberName) => {
    navigate(`/dashboard/messages`, {
      state: { selectedUser: { id: memberId, name: memberName, receiverId: memberId } },
    });
  };

  const getProfileImage = (user) => {
    if (user.image_url && user.image_url.trim()) return user.image_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random&color=fff&bold=true&size=150`;
  };

  // ── Time remaining for session ────────────────────────────────
  const getTimeRemaining = () => {
    if (!activeSession?.expires_at) return null;
    const diff = new Date(activeSession.expires_at) - new Date();
    if (diff <= 0) return "Expired";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m remaining` : `${mins}m remaining`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        {/* ══════ Page Header ══════ */}
        <div className="relative mb-8 p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-indigo-50/30 to-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl -z-10"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100/80 border border-purple-200 rounded-full text-xs font-semibold text-purple-700 mb-3">
                <span className="animate-pulse">⚡</span> Gemini AI & pgvector Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight lg:text-4xl">
                AI Suggestion Matches
              </h1>
              <p className="text-slate-500 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                Our high-fidelity interpretation engine searches the vector space for alignment in lifestyle ambitions, professional rhythms, and relationship intents.
              </p>
            </div>
            <button
              onClick={fetchSuggestions}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md hover:shadow-purple-500/10 transition duration-200 flex items-center gap-2 self-start md:self-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ══════ AI Clarification Card (Point #7) ══════ */}
        <div className="mb-8">
          {/* Active session banner */}
          {activeSession && !showCard && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-violet-50 border border-purple-200/60 rounded-2xl shadow-sm mb-4 transition-all duration-300">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-sm">
                  <span className="animate-pulse">🔮</span> Refinement Active
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {activeSession.selected_priorities?.map((pId) => {
                    const chip = PRIORITY_CHIPS.find((c) => c.id === pId);
                    return chip ? (
                      <span key={pId} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${chip.bg} ${chip.text} ${chip.border} border`}>
                        {chip.emoji} {chip.label}
                      </span>
                    ) : null;
                  })}
                </div>
                {getTimeRemaining() && (
                  <span className="text-[11px] text-slate-400 font-medium">⏱ {getTimeRemaining()}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCard(true)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline underline-offset-2 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleClearRefinement}
                  disabled={refinementLoading}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 underline underline-offset-2 transition"
                >
                  {refinementLoading ? "Clearing..." : "Reset"}
                </button>
              </div>
            </div>
          )}

          {/* Clarification Card */}
          {showCard && (
            <div className="relative p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-top-2">
              {/* Decorative background elements */}
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-purple-100/40 to-indigo-100/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-violet-100/30 to-pink-100/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">AI Match Refinement</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Temporary session · does not change your profile</p>
                    </div>
                  </div>
                  {activeSession && (
                    <button
                      onClick={() => setShowCard(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                {/* Question */}
                <p className="text-sm sm:text-base text-slate-600 font-medium mb-5 leading-relaxed">
                  What are you <span className="text-purple-600 font-bold">prioritizing today</span>? Select up to 3 to dynamically adjust your matches.
                </p>

                {/* Priority Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {PRIORITY_CHIPS.map((chip) => {
                    const isSelected = selectedPriorities.includes(chip.id);
                    const isDisabled = !isSelected && selectedPriorities.length >= 3;

                    return (
                      <button
                        key={chip.id}
                        onClick={() => togglePriority(chip.id)}
                        disabled={isDisabled}
                        className={`
                          group relative flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-300 text-left
                          ${isSelected
                            ? `${chip.border} ${chip.bg} shadow-md ring-2 ${chip.ring} ring-offset-1 scale-[1.02]`
                            : isDisabled
                              ? "border-slate-100 bg-slate-50/50 opacity-40 cursor-not-allowed"
                              : "border-slate-150 bg-white hover:border-purple-200 hover:bg-purple-50/30 hover:shadow-sm cursor-pointer"
                          }
                        `}
                      >
                        <span className={`text-xl sm:text-2xl transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-105"}`}>
                          {chip.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs sm:text-sm font-bold block truncate ${isSelected ? chip.text : "text-slate-700"}`}>
                            {chip.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${chip.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Optional free-text query */}
                <div className="mb-5">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5 block">Optional: tell us more</label>
                  <input
                    type="text"
                    value={rawQuery}
                    onChange={(e) => setRawQuery(e.target.value)}
                    placeholder="e.g. 'Someone calm who loves hiking'"
                    maxLength={200}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={handleApplyRefinement}
                    disabled={selectedPriorities.length === 0 || refinementLoading}
                    className={`
                      flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                      ${selectedPriorities.length > 0
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }
                    `}
                  >
                    {refinementLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Refining Matches...</span>
                      </>
                    ) : (
                      <>
                        <span>🔮</span>
                        <span>Apply Refinement {selectedPriorities.length > 0 && `(${selectedPriorities.length})`}</span>
                      </>
                    )}
                  </button>

                  {activeSession && (
                    <button
                      onClick={handleClearRefinement}
                      disabled={refinementLoading}
                      className="py-3 px-5 rounded-xl font-semibold text-sm border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      ✕ Reset to Default
                    </button>
                  )}
                </div>

                {/* Selection counter */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[11px] text-slate-400">
                    {selectedPriorities.length}/3 selected
                  </p>
                  {selectedPriorities.length > 0 && (
                    <button onClick={() => setSelectedPriorities([])} className="text-[11px] text-slate-400 hover:text-slate-600 underline transition">
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══════ Loading Shimmer ══════ */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-2xl overflow-hidden p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-100 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-full mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6 mb-4"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-6 bg-slate-100 rounded w-16"></div>
                  <div className="h-6 bg-slate-100 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 bg-slate-100 rounded flex-1"></div>
                  <div className="h-10 bg-slate-100 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════ Error State ══════ */}
        {!loading && error && (
          <div className="p-8 bg-red-50 border border-red-150 rounded-2xl text-center max-w-lg mx-auto shadow-sm">
            <span className="text-4xl">⚠️</span>
            <h3 className="text-xl font-bold text-red-800 mt-4 mb-2">Retrieval Failed</h3>
            <p className="text-red-600/80 mb-6">{error}</p>
            <button
              onClick={fetchSuggestions}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
            >
              Try Reconnecting
            </button>
          </div>
        )}

        {/* ══════ Empty State ══════ */}
        {!loading && !error && suggestions.length === 0 && (
          <div className="p-12 bg-white border border-slate-150 rounded-2xl text-center max-w-2xl mx-auto shadow-sm">
            <span className="text-6xl mb-6 block">🧬</span>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No High Alignment Matches Found</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
              Our semantic vector matching requires a comprehensive bio description. Enhance your <strong>"About Me"</strong> in your profile edit section to let the AI interpreter analyze your intent and find matches.
            </p>
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md hover:shadow-purple-500/10 transition border border-purple-500/20"
            >
              ✏️ Enrich My Bio Now
            </button>
          </div>
        )}

        {/* ══════ Suggestions Grid ══════ */}
        {!loading && !error && suggestions.length > 0 && (
          <>
            {/* Refinement badge above grid */}
            {refinementMeta?.is_refined && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                  🔮 Showing refined results
                </span>
                <span className="text-xs text-slate-400">
                  {suggestions.length} matches · adaptive scoring active
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {suggestions.map((match) => {
                const profileImage = getProfileImage(match);
                const isLoading = loadingProfileId === match.user_id || loadingProfileId === match.id;
                const isRefined = match.is_refined;

                const confScore = match.confidence_score !== undefined ? match.confidence_score : 0.50;
                let clarityLabel = "Good Clarity";
                let clarityColor = "bg-blue-50 border-blue-150 text-blue-600";
                if (confScore >= 0.82) {
                  clarityLabel = "Rich Profile";
                  clarityColor = "bg-emerald-50 border-emerald-200 text-emerald-600";
                } else if (confScore >= 0.60) {
                  clarityLabel = "Good Clarity";
                  clarityColor = "bg-blue-50 border-blue-200 text-blue-600";
                } else if (confScore >= 0.45) {
                  clarityLabel = "Moderate Clarity";
                  clarityColor = "bg-purple-50 border-purple-200 text-purple-600";
                } else {
                  clarityLabel = "Early Profile";
                  clarityColor = "bg-amber-50 border-amber-200 text-amber-600";
                }

                return (
                  <div
                    key={match.id}
                    className="group relative bg-white border border-slate-150 rounded-2xl overflow-hidden p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/10 via-transparent to-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Refined badge */}
                    {isRefined && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          🔮 Refined
                        </span>
                      </div>
                    )}

                    {/* Profile Header */}
                    <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <img
                          src={profileImage}
                          alt={match.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-purple-100 group-hover:border-purple-500 transition-colors duration-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.name)}&background=random&color=fff&size=150`;
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg group-hover:text-purple-700 transition-colors">
                            {match.name}
                          </h4>
                          <p className="text-purple-600 text-xs font-semibold uppercase tracking-wider">{match.profession}</p>
                          <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
                            <span>📍</span> {match.city}
                          </p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full border shadow-sm ${isRefined ? "bg-gradient-to-tr from-purple-100 to-violet-100 border-purple-200" : "bg-gradient-to-tr from-purple-50 to-indigo-50 border-purple-100"}`}>
                        <span className="text-sm font-black text-purple-700">
                          {match.compatibility_score}%
                        </span>
                      </div>
                    </div>

                    {/* About */}
                    <p className="text-slate-600 text-sm mb-5 leading-relaxed relative z-10 italic border-l-2 border-purple-100 pl-3 py-0.5 bg-slate-50/50 rounded-r-lg">
                      "{match.about_me ? (match.about_me.length > 120 ? match.about_me.substring(0, 120) + "..." : match.about_me) : "No bio details provided."}"
                    </p>

                    {/* Clarity */}
                    <div className="mb-4 relative z-10 flex items-center justify-between border-b border-slate-50 pb-3">
                      <span className="text-xs font-medium text-slate-400">AI Profile Clarity</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 border rounded-full ${clarityColor}`}>
                        {clarityLabel} ({Math.round(confScore * 100)}%)
                      </span>
                    </div>

                    {/* Spider Graph (Point #10) — Compatibility Radar */}
                    {match.spider_graph_data && (
                      <div className="mb-4 relative z-10 bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-100 rounded-xl px-3 pt-2 pb-3">
                        <SpiderGraph data={match.spider_graph_data} />
                      </div>
                    )}

                    {/* Intent Tags */}
                    {match.intent_tags && Object.keys(match.intent_tags).length > 0 && (
                      <div className="mb-6 relative z-10">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Intent Alignment</div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(match.intent_tags).slice(0, 3).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs bg-purple-50 border border-purple-100/50 text-purple-600 px-2.5 py-0.5 rounded-full font-medium"
                              title={`${key.replace(/_/g, " ")}: ${value}`}
                            >
                              🏷️ {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 relative z-10">
                      <button
                        onClick={() => handleViewProfile(match)}
                        disabled={isLoading}
                        className="flex-grow py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition duration-200 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading Profile...</span>
                          </>
                        ) : (
                          <span>View Profile Match</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleSendMessage(match.user_id || match.id, match.name)}
                        className="px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl transition duration-150 flex items-center justify-center"
                        title="Send Message"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
