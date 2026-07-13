import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAISuggestions, setRefinedQuery, getActiveRefinedQuery, clearRefinedQuery, initiateHandshake } from "../services/chatApi";
import api from "../services/api";
import SpiderGraph from "./SpiderGraph";

// ── Priority chip data ──────────────────────────────────────────────────────
const PRIORITY_CHIPS = [
  { id: "emotional_support", label: "Emotional Support", emoji: "💛", gradient: "from-amber-400 to-orange-400", ring: "ring-amber-300", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  { id: "professional_alignment", label: "Professional Alignment", emoji: "💼", gradient: "from-blue-500 to-cyan-500", ring: "ring-blue-300", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { id: "lifestyle_sync", label: "Lifestyle Sync", emoji: "🌿", gradient: "from-emerald-400 to-teal-400", ring: "ring-emerald-300", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { id: "shared_ambition", label: "Shared Ambition", emoji: "🚀", gradient: "from-violet-500 to-purple-500", ring: "ring-violet-300", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  { id: "calm_communication", label: "Calm Communication", emoji: "🕊️", gradient: "from-sky-400 to-indigo-400", ring: "ring-sky-300", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  { id: "long_term_stability", label: "Long-Term Stability", emoji: "🏡", gradient: "from-rose-400 to-pink-400", ring: "ring-rose-300", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
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

  // ── Module 3: Handshake / Stress Synchronization state ──────
  const [handshakeModal, setHandshakeModal] = useState(null);   // { match, session } | null
  const [handshakeLoadingId, setHandshakeLoadingId] = useState(null); // userId being processed
  const [handshakeError, setHandshakeError] = useState(null);

  // ── Module 8: Trust Score & Anti-Ghosting state ──────────
  const [trustStatus, setTrustStatus] = useState(null);
  const [ghostingPopup, setGhostingPopup] = useState(false);
  const [ghostingReason, setGhostingReason] = useState("");
  const [ghostingCustom, setGhostingCustom] = useState("");
  const [ghostingSubmitting, setGhostingSubmitting] = useState(false);
  const [ghostingSuccess, setGhostingSuccess] = useState(false);

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

  // ── Module 8: Fetch trust status on mount ────────────────
  const fetchTrustStatus = useCallback(async () => {
    try {
      const res = await api.get("/api/handshake/trust-status");
      const data = res.data?.data;
      if (data) {
        setTrustStatus(data);
        if (data.ghostingAlert) setGhostingPopup(true);
      }
    } catch (err) {
      console.warn("[Module 8] Trust status fetch failed:", err.message);
    }
  }, []);

  useEffect(() => {
    checkActiveSession();
    fetchSuggestions();
    fetchTrustStatus();
  }, [checkActiveSession, fetchSuggestions, fetchTrustStatus]);

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

  // ── Module 3: Trigger Handshake + open premium modal ────────
  const handleHandshake = async (match) => {
    const memberId = match.user_id || match.id;
    setHandshakeLoadingId(memberId);
    setHandshakeError(null);
    try {
      const result = await initiateHandshake(memberId);
      const session = result?.data || result;
      setHandshakeModal({ match, session });
    } catch (err) {
      console.error("❌ Handshake failed:", err);
      setHandshakeError(err?.response?.data?.message || "Handshake failed. Please try again.");
    } finally {
      setHandshakeLoadingId(null);
    }
  };

  const closeHandshakeModal = () => {
    setHandshakeModal(null);
    setHandshakeError(null);
  };

  // ── Module 8: Submit ghosting response ────────────────────
  const handleGhostingRespond = async () => {
    if (!ghostingReason) return;
    setGhostingSubmitting(true);
    try {
      const alert = trustStatus?.ghostingAlert;
      await api.post("/api/handshake/ghosting-respond", {
        sessionId: alert?.sessionId || null,
        reason: ghostingReason,
        customReason: ghostingReason === "Other" ? ghostingCustom : undefined,
      });
      setGhostingSuccess(true);
      await fetchTrustStatus();
      setTimeout(() => {
        setGhostingPopup(false);
        setGhostingSuccess(false);
        setGhostingReason("");
        setGhostingCustom("");
      }, 2000);
    } catch (err) {
      console.error("[Module 8] Ghosting respond failed:", err.message);
    } finally {
      setGhostingSubmitting(false);
    }
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
    <>
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

        {/* ═════ Module 8 — Trust Score Badge ═════ */}
        {trustStatus && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Trust Score pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold shadow-sm border cursor-pointer"
              style={{
                background: trustStatus.trustScore >= 75 ? 'linear-gradient(135deg,#d1fae5,#a7f3d0)' : trustStatus.trustScore >= 50 ? 'linear-gradient(135deg,#fef3c7,#fde68a)' : 'linear-gradient(135deg,#fee2e2,#fca5a5)',
                borderColor: trustStatus.trustScore >= 75 ? '#6ee7b7' : trustStatus.trustScore >= 50 ? '#fcd34d' : '#f87171',
                color: trustStatus.trustScore >= 75 ? '#065f46' : trustStatus.trustScore >= 50 ? '#92400e' : '#991b1b',
              }}
              title="Your Trust Score reflects your engagement reliability"
            >
              <span style={{fontSize:'1.1rem'}}>🛡️</span>
              Trust Score &nbsp;<strong>{trustStatus.trustScore}/100</strong>
              <span className="opacity-70 font-medium text-xs">({trustStatus.trustLevel})</span>
            </div>

            {/* Engagement pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700">
              <span>💬</span> {trustStatus.engagementStatus}
            </div>

            {/* Ghosting Risk pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{
                background: trustStatus.ghostingRisk === 'Low' ? '#f0fdf4' : trustStatus.ghostingRisk === 'Moderate' ? '#fffbeb' : '#fff1f2',
                borderColor: trustStatus.ghostingRisk === 'Low' ? '#bbf7d0' : trustStatus.ghostingRisk === 'Moderate' ? '#fde68a' : '#fecdd3',
                color: trustStatus.ghostingRisk === 'Low' ? '#166534' : trustStatus.ghostingRisk === 'Moderate' ? '#92400e' : '#9f1239',
              }}
            >
              <span>{trustStatus.ghostingRisk === 'Low' ? '✅' : trustStatus.ghostingRisk === 'Moderate' ? '⚠️' : '🚨'}</span>
              Ghosting Risk: {trustStatus.ghostingRisk}
            </div>

            {/* Ghosting alert bell (only when alert exists) */}
            {trustStatus.ghostingAlert && (
              <button
                onClick={() => setGhostingPopup(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-md hover:bg-rose-700 transition animate-bounce"
              >
                🔔 Ghosting Alert
              </button>
            )}
          </div>
        )}


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
                    <div className="flex flex-col gap-2 relative z-10">
                      {/* Primary actions row */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProfile(match)}
                          disabled={isLoading}
                          className="flex-grow py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition duration-200 flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Loading...</span>
                            </>
                          ) : (
                            <span>View Profile</span>
                          )}
                        </button>
                        <button
                          onClick={() => handleSendMessage(match.user_id || match.id, match.name)}
                          className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl transition duration-150 flex items-center justify-center"
                          title="Send Message"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                      {/* Module 3 — AI Compatibility Report (Handshake) */}
                      <button
                        onClick={() => handleHandshake(match)}
                        disabled={handshakeLoadingId === (match.user_id || match.id)}
                        className="w-full py-2.5 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {handshakeLoadingId === (match.user_id || match.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Analyzing Stress Cycles...</span>
                          </>
                        ) : (
                          <>
                            <span>🤝</span>
                            <span>AI Compatibility Report</span>
                          </>
                        )}
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

    {/* ══════════════════════════════════════════════════════
         Module 3 — Handshake / Stress Synchronization Modal
        ══════════════════════════════════════════════════════ */}
    {handshakeError && (
      <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-red-600 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-start gap-3 animate-fade-in">
        <span className="text-xl mt-0.5">⚠️</span>
        <div className="flex-1">
          <p className="font-bold text-sm">Handshake Failed</p>
          <p className="text-xs mt-0.5 opacity-90">{handshakeError}</p>
        </div>
        <button onClick={() => setHandshakeError(null)} className="text-white/70 hover:text-white text-lg leading-none">&times;</button>
      </div>
    )}

    {handshakeModal && (
      <HandshakeResultModal
        match={handshakeModal.match}
        session={handshakeModal.session}
        onClose={closeHandshakeModal}
      />
    )}

    {/* ══════════════════════════════════════════
         Module 8 — Anti-Ghosting Alert Popup
        ══════════════════════════════════════════ */}
    {ghostingPopup && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{ background: 'rgba(15,15,35,0.72)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) setGhostingPopup(false); }}
      >
        <div
          className="relative w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(145deg,#1e1b4b,#312e81)',
            border: '1px solid rgba(167,139,250,0.3)',
            animation: 'modalIn 0.28s cubic-bezier(.22,1,.36,1) both',
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style={{background:'radial-gradient(circle,#a78bfa,transparent)',transform:'translate(30%,-30%)'}} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-20" style={{background:'radial-gradient(circle,#818cf8,transparent)',transform:'translate(-30%,30%)'}} />

          <div className="relative p-6 sm:p-8">
            {ghostingSuccess ? (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-white text-xl font-bold mb-2">Response Recorded</h3>
                <p className="text-violet-200 text-sm">Your Digital Twin has been updated. Thank you for your honesty!</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2" style={{background:'rgba(239,68,68,0.2)',color:'#fca5a5',border:'1px solid rgba(239,68,68,0.3)'}}>
                      🚨 Ghosting Alert Detected
                    </div>
                    <h3 className="text-white text-lg font-extrabold leading-tight">
                      You have an unanswered message from<br />
                      <span className="text-violet-300">{trustStatus?.ghostingAlert?.partnerName || 'Your Match'}</span>
                    </h3>
                    <p className="text-violet-200/70 text-xs mt-1">
                      Over {import.meta.env.VITE_GHOSTING_TIMEOUT_HOURS || 48}h since their last message. Responding maintains your Trust Score.
                    </p>
                  </div>
                  <button
                    onClick={() => setGhostingPopup(false)}
                    className="text-white/40 hover:text-white/80 transition text-xl leading-none ml-2 flex-shrink-0"
                  >&times;</button>
                </div>

                {/* Trust score preview */}
                <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl" style={{background:'rgba(255,255,255,0.06)'}}>
                  <div className="text-2xl">🛡️</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-violet-200 font-semibold">Current Trust Score</span>
                      <span className="text-white font-bold">{trustStatus?.trustScore ?? 100}/100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${trustStatus?.trustScore ?? 100}%`,
                          background: 'linear-gradient(90deg,#a78bfa,#6366f1)',
                        }}
                      />
                    </div>
                    <p className="text-rose-300 text-[11px] mt-1">⚠️ Not responding will deduct 20 points</p>
                  </div>
                </div>

                {/* Reason selection */}
                <p className="text-violet-100 text-sm font-semibold mb-3">Why haven't you responded?</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['Busy with Work', 'Wrong Timing', 'Not Interested', 'Already Talking to Someone', 'Other'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setGhostingReason(r)}
                      className="px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left"
                      style={{
                        background: ghostingReason === r ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.07)',
                        border: ghostingReason === r ? '1.5px solid #a78bfa' : '1.5px solid rgba(255,255,255,0.1)',
                        color: ghostingReason === r ? '#fff' : '#c4b5fd',
                        gridColumn: r === 'Other' ? 'span 2' : 'span 1',
                      }}
                    >
                      {r === 'Busy with Work' && '💼 '}
                      {r === 'Wrong Timing' && '⏰ '}
                      {r === 'Not Interested' && '👋 '}
                      {r === 'Already Talking to Someone' && '💬 '}
                      {r === 'Other' && '✏️ '}
                      {r}
                    </button>
                  ))}
                </div>

                {/* Custom reason textarea for "Other" */}
                {ghostingReason === 'Other' && (
                  <textarea
                    value={ghostingCustom}
                    onChange={(e) => setGhostingCustom(e.target.value)}
                    placeholder="Briefly describe your reason... (Gemini will analyse this)"
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 text-sm mb-4 resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1.5px solid rgba(167,139,250,0.3)',
                      color: '#e2e8f0',
                      outline: 'none',
                    }}
                  />
                )}

                {/* Submit */}
                <button
                  onClick={handleGhostingRespond}
                  disabled={!ghostingReason || ghostingSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                  style={{
                    background: ghostingReason ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.1)',
                    color: ghostingReason ? '#fff' : '#6d6aaa',
                    cursor: ghostingReason && !ghostingSubmitting ? 'pointer' : 'not-allowed',
                    opacity: ghostingSubmitting ? 0.7 : 1,
                  }}
                >
                  {ghostingSubmitting ? 'Submitting...' : 'Submit Response & Protect My Trust Score'}
                </button>

                <p className="text-center text-violet-300/50 text-[11px] mt-3">
                  Your reason is private and only used to improve your Digital Twin.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
//  Module 3 — HandshakeResultModal
//  Premium UI for AI Compatibility + Stress-Cycle Delta Sync + Privacy Verification
// ═══════════════════════════════════════════════════════════════

/**
 * Animated progress bar — width transitions on mount for a polished feel.
 */
function ProgressBar({ value, colorClass = "from-purple-500 to-indigo-500" }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * Metric row: label + score + bar.
 */
function MetricRow({ label, value, colorClass }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-sm font-bold text-slate-700">{pct}%</span>
      </div>
      <ProgressBar value={pct} colorClass={colorClass} />
    </div>
  );
}

/**
 * Conflict risk badge — colour-coded by severity.
 */
function ConflictBadge({ risk }) {
  const val = Math.round(risk ?? 50);
  let bg, text, label, dot;
  if (val <= 30) {
    bg = "bg-emerald-50 border-emerald-200"; text = "text-emerald-700"; dot = "bg-emerald-500"; label = "Low Risk";
  } else if (val <= 60) {
    bg = "bg-amber-50 border-amber-200"; text = "text-amber-700"; dot = "bg-amber-500"; label = "Moderate Risk";
  } else {
    bg = "bg-red-50 border-red-200"; text = "text-red-700"; dot = "bg-red-500"; label = "High Risk";
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
      {label} ({val}%)
    </span>
  );
}

/**
 * Module 6 — Privacy protection badge.
 * Shows a green “Protected” or red “Exposed” pill.
 */
function PrivacyBadge({ protected: isProtected, label }) {
  return isProtected ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      ✓ {label}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      ⚠ {label}
    </span>
  );
}

/**
 * Module 7 — Structural Audit Grade badge.
 * Colour-coded A/B/C/D letter grade pill.
 */
function AuditGradeBadge({ grade }) {
  const styles = {
    A: "bg-emerald-50 border-emerald-300 text-emerald-700",
    B: "bg-sky-50 border-sky-300 text-sky-700",
    C: "bg-amber-50 border-amber-300 text-amber-700",
    D: "bg-red-50 border-red-300 text-red-700",
  };
  const cls = styles[grade] || styles["C"];
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 font-black text-lg ${cls}`}>
      {grade || "—"}
    </span>
  );
}

/**
 * Module 7 — Recommendation pill, colour-coded by severity.
 */
function RecommendationPill({ recommendation }) {
  const map = {
    "Highly Compatible":       { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", pulse: false },
    "Compatible with Caution": { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     dot: "bg-sky-500",     pulse: false },
    "Proceed Carefully":       { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500",   pulse: true  },
    "Not Recommended":         { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     dot: "bg-red-500",     pulse: true  },
    "Pending":                 { bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-500",   dot: "bg-slate-400",   pulse: false },
  };
  const s = map[recommendation] || map["Pending"];
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold ${s.bg} ${s.border} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`} />
      {recommendation || "Pending"}
    </span>
  );
}

/**
 * Full-screen overlay modal with compatibility + stress sync + privacy verification data.
 */
function HandshakeResultModal({ match, session, onClose }) {
  const cm   = session?.compatibility_markers || {};
  const ss   = session?.stressSynchronization || session?.stress_synchronization || {};
  const pv   = session?.privacyVerification || session?.privacy_verification || {};
  const ar   = session?.auditReport || session?.audit_report || {};
  const fi   = session?.frictionInterview || session?.friction_interview || {};
  const cs   = session?.conflictSimulation || session?.conflict_simulation || {};
  const busy = Array.isArray(ss.busy_overlap) ? ss.busy_overlap : [];

  // Compute overall compatibility as average of all markers
  const scores = Object.values(cm).filter(v => typeof v === "number");
  const overall = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="AI Compatibility Report"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl ring-1 ring-slate-200 animate-modal-in">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 rounded-t-3xl px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤝</span>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">AI Compatibility Report</h2>
              <p className="text-white/70 text-[10px] mt-0.5 leading-snug">Structural Handshake · Stress-Cycle Sync · Privacy Verification · Structural Audit · Friction Interview · Conflict Simulation</p>
            </div>
          </div>
          {/* Match name pill */}
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {(match?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{match?.name || "Match"}</p>
              <p className="text-white/60 text-xs">{match?.profession || ""}</p>
            </div>
            {overall !== null && (
              <div className="ml-auto flex flex-col items-center">
                <span className="text-3xl font-black text-white leading-none">{overall}%</span>
                <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Overall</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="px-6 py-6 space-y-6">

          {/* ╔══ Section 1: AI Compatibility ══════════════════╗ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">✦</span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">AI Compatibility</h3>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              {cm.professional_alignment !== undefined && (
                <MetricRow label="Professional Alignment" value={cm.professional_alignment} colorClass="from-blue-500 to-cyan-500" />
              )}
              {cm.lifestyle_alignment !== undefined && (
                <MetricRow label="Lifestyle Alignment" value={cm.lifestyle_alignment} colorClass="from-emerald-500 to-teal-500" />
              )}
              {cm.emotional_alignment !== undefined && (
                <MetricRow label="Emotional Alignment" value={cm.emotional_alignment} colorClass="from-rose-500 to-pink-500" />
              )}
              {cm.communication_alignment !== undefined && (
                <MetricRow label="Communication Alignment" value={cm.communication_alignment} colorClass="from-sky-500 to-indigo-500" />
              )}
              {cm.growth_alignment !== undefined && (
                <MetricRow label="Growth Alignment" value={cm.growth_alignment} colorClass="from-violet-500 to-purple-500" />
              )}
              {scores.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-2">No compatibility data available.</p>
              )}
            </div>
            {session?.handshake_summary && (
              <p className="mt-3 text-xs text-slate-500 italic border-l-2 border-purple-200 pl-3 leading-relaxed">
                {session.handshake_summary}
              </p>
            )}
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module 3</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* ╔══ Section 2: Stress Synchronization ════════════╗ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-bold">⚡</span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Stress Synchronization</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Stress Alignment */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Stress Alignment</p>
                <p className="text-2xl font-black text-rose-600">{ss.stress_alignment ?? "—"}%</p>
                <ProgressBar value={ss.stress_alignment ?? 50} colorClass="from-rose-400 to-pink-500" />
              </div>
              {/* Recovery Match */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Recovery Match</p>
                <p className="text-2xl font-black text-emerald-600">{ss.recovery_alignment ?? "—"}%</p>
                <ProgressBar value={ss.recovery_alignment ?? 50} colorClass="from-emerald-400 to-teal-500" />
              </div>
              {/* Communication Availability */}
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl p-4 border border-sky-100">
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider mb-1">Communication Availability</p>
                <p className="text-2xl font-black text-sky-600">{ss.communication_availability ?? "—"}%</p>
                <ProgressBar value={ss.communication_availability ?? 50} colorClass="from-sky-400 to-indigo-500" />
              </div>
              {/* Conflict Risk */}
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Conflict Risk</p>
                <ConflictBadge risk={ss.conflict_risk} />
              </div>
            </div>

            {/* Busy Overlap Months */}
            {busy.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2">Peak Busy Months (Both)</p>
                <div className="flex flex-wrap gap-2">
                  {busy.map((month) => (
                    <span
                      key={month}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-full"
                    >
                      📅 {month}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {busy.length === 0 && ss.stress_alignment !== undefined && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 mb-4">
                <p className="text-xs text-emerald-700 font-semibold">✅ No overlapping high-stress months detected.</p>
              </div>
            )}

            {/* AI Insights */}
            {ss.summary && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🧠</span>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">AI Insight</span>
                </div>
                <p className="text-slate-100 text-sm leading-relaxed">&ldquo;{ss.summary}&rdquo;</p>
              </div>
            )}

            {!ss.summary && !ss.stress_alignment && (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">Stress synchronization data unavailable for this session.</p>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module 6</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* ╔══ Section 3: Privacy Verification ═════════════════════╗ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xs font-bold">🔒</span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Privacy Verification</h3>
            </div>

            {/* Score grid */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
              {pv.professional_alignment_score !== undefined && (
                <MetricRow
                  label="Professional Alignment"
                  value={pv.professional_alignment_score}
                  colorClass="from-teal-500 to-cyan-500"
                />
              )}
              {pv.industry_match_score !== undefined && (
                <MetricRow
                  label="Industry Match"
                  value={pv.industry_match_score}
                  colorClass="from-indigo-500 to-blue-500"
                />
              )}
              {pv.career_stage_match_score !== undefined && (
                <MetricRow
                  label="Career Stage Match"
                  value={pv.career_stage_match_score}
                  colorClass="from-violet-500 to-purple-500"
                />
              )}
              {pv.professional_alignment_score === undefined &&
               pv.industry_match_score === undefined &&
               pv.career_stage_match_score === undefined && (
                <p className="text-slate-400 text-sm text-center py-2">Privacy scores not yet available.</p>
              )}
            </div>

            {/* Protection badges */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Identity Protection Status</p>
              <div className="flex flex-wrap gap-2">
                <PrivacyBadge
                  protected={pv.identity_protected !== false}
                  label="Identity Protected"
                />
                <PrivacyBadge
                  protected={pv.employer_hidden !== false}
                  label="Employer Hidden"
                />
                <PrivacyBadge
                  protected={pv.salary_hidden !== false}
                  label="Salary Hidden"
                />
              </div>
            </div>

            {/* AI Privacy Summary */}
            {pv.ai_privacy_summary && (
              <div className="bg-gradient-to-br from-teal-900 to-emerald-900 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔐</span>
                  <span className="text-xs font-bold text-teal-200 uppercase tracking-widest">AI Privacy Summary</span>
                </div>
                <p className="text-teal-50 text-sm leading-relaxed">&ldquo;{pv.ai_privacy_summary}&rdquo;</p>
              </div>
            )}

            {!pv.ai_privacy_summary && !pv.professional_alignment_score && (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">Privacy verification data unavailable for this session.</p>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module 7</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* ╔══ Section 4: Structural Audit Report ═════════════════════╗ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold">📊</span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Structural Audit Report</h3>
            </div>

            {ar.overall_score !== undefined ? (
              <>
                {/* Overall score + grade row */}
                <div className="flex items-center gap-4 mb-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">
                  <AuditGradeBadge grade={ar.grade} />
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">Overall Compatibility Score</p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-violet-700">{ar.overall_score}%</span>
                      <div className="flex-1">
                        <ProgressBar
                          value={ar.overall_score}
                          colorClass="from-violet-500 to-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommendation</p>
                  <RecommendationPill recommendation={ar.recommendation} />
                </div>

                {/* Strengths + Risks side-by-side */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2">✨ Strengths</p>
                    {ar.strength_areas && ar.strength_areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ar.strength_areas.map((s) => (
                          <span key={s} className="inline-block px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400">No dominant strengths identified.</p>
                    )}
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2">⚠️ Risk Areas</p>
                    {ar.risk_areas && ar.risk_areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ar.risk_areas.map((r) => (
                          <span key={r} className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full">{r}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-400">No critical risk areas detected.</p>
                    )}
                  </div>
                </div>

                {/* AI Synthesis Summary */}
                {ar.synthesis_summary && (
                  <div className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🧠</span>
                      <span className="text-xs font-bold text-violet-200 uppercase tracking-widest">AI Structural Analysis</span>
                    </div>
                    <p className="text-violet-50 text-sm leading-relaxed">&ldquo;{ar.synthesis_summary}&rdquo;</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">Structural audit data unavailable for this session.</p>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module 4</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* ╔══ Section 5: Agent-to-Agent Friction Interview ══════════╗ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">🤖</span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Agent-to-Agent Friction Interview</h3>
            </div>

            {fi.interviewSummary ? (
              <div className="space-y-4">
                {/* Introduction summary */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  {fi.interviewSummary}
                </p>

                {/* Compatibility metrics */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Simulated Dialogue Dimensions</p>
                  {fi.communicationCompatibility !== undefined && (
                    <MetricRow
                      label="Communication Compatibility"
                      value={fi.communicationCompatibility}
                      colorClass="from-blue-500 to-indigo-500"
                    />
                  )}
                  {fi.lifestyleCompatibility !== undefined && (
                    <MetricRow
                      label="Lifestyle Rhythm Sync"
                      value={fi.lifestyleCompatibility}
                      colorClass="from-emerald-500 to-teal-500"
                    />
                  )}
                  {fi.workRhythmCompatibility !== undefined && (
                    <MetricRow
                      label="Work Rhythm Compatibility"
                      value={fi.workRhythmCompatibility}
                      colorClass="from-amber-500 to-orange-500"
                    />
                  )}
                </div>

                {/* Agreements & Friction side-by-side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                      <span>🤝</span> Agreement Points
                    </p>
                    <ul className="space-y-1.5">
                      {fi.agreementPoints?.map((pt, i) => (
                        <li key={i} className="text-xs text-emerald-800 flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold mt-0.5">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                      {(!fi.agreementPoints || fi.agreementPoints.length === 0) && (
                        <p className="text-xs text-slate-400">No specific agreement points listed.</p>
                      )}
                    </ul>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
                      <span>⚡</span> Friction Points
                    </p>
                    <ul className="space-y-1.5">
                      {fi.frictionPoints?.map((pt, i) => (
                        <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold mt-0.5">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                      {(!fi.frictionPoints || fi.frictionPoints.length === 0) && (
                        <p className="text-xs text-slate-400">No critical friction points detected.</p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Deep psychological insight */}
                {fi.aiInsight && (
                  <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                      <span>🧠</span> AI Psychological Insight
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed italic">&ldquo;{fi.aiInsight}&rdquo;</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">Friction interview details unavailable for this session.</p>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module 5</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* ╔══ Section 6: Conflict Simulation ════════════════════════╗ */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">⚠️</span>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Conflict Simulation</h3>
            </div>

            {cs.conflictRisk !== undefined ? (
              <div className="space-y-4">
                {/* Risk score */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Conflict Propensity</p>
                    <p className="text-xs text-slate-500">Based on simulation of high-pressure periods</p>
                  </div>
                  <ConflictBadge risk={cs.conflictRisk} />
                </div>

                {/* Scenarios simulation loop */}
                {cs.conflictScenarios && cs.conflictScenarios.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Crisis Scenarios</p>
                    {cs.conflictScenarios.map((sc, index) => (
                      <div key={index} className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🚨</span>
                          <span className="text-xs font-bold text-slate-800">{sc.scenarioName}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{sc.description}</p>
                        <p className="text-[11px] text-slate-500"><span className="font-semibold text-slate-700">Trigger:</span> {sc.likelyTriggers}</p>

                        {/* Dialogue transcript snippet */}
                        {sc.dynamicSimulation && (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Simulation Script Snippet</p>
                            <div className="text-[11px] text-slate-700 font-mono whitespace-pre-line leading-relaxed">
                              {sc.dynamicSimulation}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Resolution strategies */}
                {cs.resolutionSuggestions && cs.resolutionSuggestions.length > 0 && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                    <p className="text-xs font-bold text-indigo-700 mb-2.5 flex items-center gap-1.5">
                      <span>💡</span> Recommended Resolution Strategies
                    </p>
                    <ul className="space-y-2">
                      {cs.resolutionSuggestions.map((sug, i) => (
                        <li key={i} className="text-xs text-indigo-900 flex items-start gap-2">
                          <span className="text-indigo-500 font-bold">✓</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Outcomes and recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Predicted Outcome</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{cs.predictedOutcome}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">AI Recommendation</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{cs.aiRecommendation}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-400 text-sm">Conflict simulation details unavailable for this session.</p>
              </div>
            )}
          </section>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 rounded-b-3xl px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Modal entrance animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .animate-modal-in { animation: modalIn 0.25s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </div>
  );
}

