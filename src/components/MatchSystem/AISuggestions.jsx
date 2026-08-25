import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getAISuggestions, 
  setRefinedQuery, 
  getActiveRefinedQuery, 
  clearRefinedQuery, 
  initiateHandshake 
} from "../services/chatApi";
import api from "../services/api";
import SpiderGraph from "./SpiderGraph";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";
import { 
  HiHeart, 
  HiBriefcase, 
  HiSparkles, 
  HiChatAlt, 
  HiHome, 
  HiRefresh, 
  HiLocationMarker, 
  HiShieldCheck, 
  HiCheckCircle, 
  HiExclamationCircle, 
  HiBell, 
  HiAdjustments, 
  HiLightningBolt, 
  HiX, 
  HiTag, 
  HiMail, 
  HiCalendar, 
  HiLockClosed, 
  HiDocumentReport, 
  HiShieldExclamation,
  HiUser,
  HiChevronLeft,
  HiChevronRight,
  HiClock,
  HiFilter,
  HiChatAlt2,
  HiExclamation,
  HiTrendingUp
} from "react-icons/hi";

// ── Priority chip data (Vibrant color tags & custom icon colors) ──────────────
const PRIORITY_CHIPS = [
  { id: "emotional_support", label: "Emotional Support", icon: HiHeart, dotBg: "bg-amber-500", iconColor: "text-amber-500", ring: "ring-amber-200", bg: "bg-amber-50/50", text: "text-amber-800", border: "border-amber-200" },
  { id: "professional_alignment", label: "Professional Alignment", icon: HiBriefcase, dotBg: "bg-blue-500", iconColor: "text-blue-500", ring: "ring-blue-200", bg: "bg-blue-50/50", text: "text-blue-800", border: "border-blue-200" },
  { id: "lifestyle_sync", label: "Lifestyle Sync", icon: HiSparkles, dotBg: "bg-emerald-500", iconColor: "text-emerald-500", ring: "ring-emerald-200", bg: "bg-emerald-50/50", text: "text-emerald-800", border: "border-emerald-200" },
  { id: "shared_ambition", label: "Shared Ambition", icon: HiTrendingUp, dotBg: "bg-violet-500", iconColor: "text-violet-500", ring: "ring-violet-200", bg: "bg-violet-50/50", text: "text-violet-800", border: "border-violet-200" },
  { id: "calm_communication", label: "Calm Communication", icon: HiChatAlt, dotBg: "bg-sky-500", iconColor: "text-sky-500", ring: "ring-sky-200", bg: "bg-sky-50/50", text: "text-sky-800", border: "border-sky-200" },
  { id: "long_term_stability", label: "Long-Term Stability", icon: HiHome, dotBg: "bg-rose-500", iconColor: "text-rose-500", ring: "ring-rose-200", bg: "bg-rose-50/50", text: "text-rose-800", border: "border-rose-200" },
];

export default function AISuggestions() {
  const navigate = useNavigate();
  const { activePlan, planLoading, isFeatureAllowed } = useUserProfile();
  const planActive = isFeatureAllowed("ai_suggestion");

  // ── Suggestion state ────────────────────────────────────────
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProfileId, setLoadingProfileId] = useState(null);

  // ── Pagination state ────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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
    if (!planLoading && planActive) {
      checkActiveSession();
      fetchSuggestions();
      fetchTrustStatus();
    }
  }, [planLoading, planActive, checkActiveSession, fetchSuggestions, fetchTrustStatus]);

  // Reset pagination when suggestions count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [suggestions]);

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

  const getTimeRemaining = () => {
    if (!activeSession?.expires_at) return null;
    const diff = new Date(activeSession.expires_at) - new Date();
    if (diff <= 0) return "Expired";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m remaining` : `${mins}m remaining`;
  };

  // Pagination metrics
  const totalPages = Math.ceil(suggestions.length / ITEMS_PER_PAGE);
  const paginatedSuggestions = suggestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!planLoading && !planActive) {
    return <PlanRestrictionModal feature="suggestions" />;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-55 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* ══════ Page Header (Clean, Light & Modern) ══════ */}
          <div className="relative p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-700">
                  <HiSparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Gemini AI & pgvector Real-time Engine</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                  AI Match suggestions
                </h1>
                <p className="text-slate-500 max-w-2xl text-xs sm:text-sm leading-relaxed">
                  Our neural match engine uses multi-dimensional semantics to cross-reference lifestyle expectations, professional vectors, and emotional resilience values.
                </p>
              </div>
              <button
                onClick={fetchSuggestions}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 self-stretch md:self-auto hover:scale-[1.01] active:scale-[0.99]"
              >
                <HiRefresh className="w-4 h-4 animate-spin-hover" />
                <span>Refresh Suggestions</span>
              </button>
            </div>
          </div>

          {/* ═════ Trust Score Dashboard (Unified & Colored Icons) ═════ */}
          {trustStatus && (
            <div className="p-4 sm:p-5 bg-white border border-slate-200 rounded-3xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              
              {/* Trust Score & Level */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <HiShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Trust Indicator</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-extrabold text-slate-800">{trustStatus.trustScore}/100</span>
                    <span className="text-xs font-semibold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full">{trustStatus.trustLevel}</span>
                  </div>
                </div>
              </div>

              {/* Engagement Status */}
              <div className="flex items-center gap-3.5 border-t sm:border-t-0 sm:border-x border-slate-100 pt-3 sm:pt-0 sm:px-4">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-550 flex-shrink-0">
                  <HiChatAlt2 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engagement Style</div>
                  <span className="text-sm font-bold text-slate-700">{trustStatus.engagementStatus}</span>
                </div>
              </div>

              {/* Ghosting Risk & Alerts */}
              <div className="flex items-center justify-between gap-3 pt-3 sm:pt-0">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    trustStatus.ghostingRisk === 'Low' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    trustStatus.ghostingRisk === 'Moderate' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {trustStatus.ghostingRisk === 'Low' ? <HiCheckCircle className="w-6 h-6 text-emerald-500" /> : 
                     trustStatus.ghostingRisk === 'Moderate' ? <HiExclamationCircle className="w-6 h-6 text-amber-500" /> : 
                     <HiShieldExclamation className="w-6 h-6 text-rose-500" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ghosting Risk</div>
                    <span className="text-sm font-bold text-slate-700">{trustStatus.ghostingRisk} Risk</span>
                  </div>
                </div>

                {trustStatus.ghostingAlert && (
                  <button
                    onClick={() => setGhostingPopup(true)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-200 flex items-center gap-1.5 animate-pulse"
                  >
                    <HiBell className="w-4 h-4" />
                    <span>Alert</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* ══════ AI Clarification / Refinement Control Panel ══════ */}
          <div className="space-y-4">
            
            {/* Active Refinement Session Banner */}
            {activeSession && !showCard && (
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-indigo-50/40 border border-indigo-100 rounded-3xl shadow-sm transition-all duration-300">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white text-xs font-extrabold rounded-xl shadow-sm">
                    <HiAdjustments className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>Refinement Active</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {activeSession.selected_priorities?.map((pId) => {
                      const chip = PRIORITY_CHIPS.find((c) => c.id === pId);
                      return chip ? (
                        <span key={pId} className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${chip.bg} ${chip.text} ${chip.border} border`}>
                          {React.createElement(chip.icon, { className: `w-3.5 h-3.5 ${chip.iconColor}` })}
                          <span>{chip.label}</span>
                        </span>
                      ) : null;
                    })}
                  </div>
                  {getTimeRemaining() && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-bold bg-slate-100/50 px-2 py-0.5 rounded-lg">
                      <HiClock className="w-3 h-3 text-slate-400" />
                      <span>{getTimeRemaining()}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button
                    onClick={() => setShowCard(true)}
                    className="px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold rounded-xl transition duration-200"
                  >
                    Modify
                  </button>
                  <button
                    onClick={handleClearRefinement}
                    disabled={refinementLoading}
                    className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-xl transition duration-200"
                  >
                    {refinementLoading ? "Clearing..." : "Reset"}
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Refinement Settings Box (Light, Minimalist) */}
            {showCard && (
              <div className="relative p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-slide-down">
                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-650">
                        <HiFilter className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">AI Matching Priorities</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Define temporary focal weights to refine suggestions instantly.</p>
                      </div>
                    </div>
                    {activeSession && (
                      <button
                        onClick={() => setShowCard(false)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                      >
                        <HiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                    Select <span className="text-indigo-600 font-bold">up to 3 matching pillars</span> to recalibrate vector metrics for this session:
                  </p>

                  {/* Pillars Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PRIORITY_CHIPS.map((chip) => {
                      const isSelected = selectedPriorities.includes(chip.id);
                      const isDisabled = !isSelected && selectedPriorities.length >= 3;

                      return (
                        <button
                          key={chip.id}
                          onClick={() => togglePriority(chip.id)}
                          disabled={isDisabled}
                          className={`
                            group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 text-left cursor-pointer
                            ${isSelected
                              ? `${chip.border} ${chip.bg} shadow-sm ring-2 ${chip.ring} ring-offset-1 scale-[1.01]`
                              : isDisabled
                                ? "border-slate-100 bg-slate-50/50 opacity-40 cursor-not-allowed"
                                : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/20 hover:shadow-sm"
                            }
                          `}
                        >
                          <div className={`p-2 rounded-xl transition-all duration-300 ${
                            isSelected ? chip.bg : 'bg-slate-50 border border-slate-100 group-hover:bg-slate-100/70'
                          }`}>
                            {React.createElement(chip.icon, { className: `w-5 h-5 ${chip.iconColor}` })}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs sm:text-sm font-bold block truncate ${isSelected ? chip.text : "text-slate-700"}`}>
                              {chip.label}
                            </span>
                          </div>
                          
                          {isSelected && (
                            <div className={`w-5 h-5 rounded-full ${chip.dotBg} flex items-center justify-center shadow-sm flex-shrink-0`}>
                              <HiCheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Free-text query input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Context Enrichment (Optional)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={rawQuery}
                        onChange={(e) => setRawQuery(e.target.value)}
                        placeholder="Describe specific qualities, e.g., 'Looking for a quiet weekend lover who respects high-paced careers'"
                        maxLength={200}
                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 placeholder:text-slate-350 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button
                      onClick={handleApplyRefinement}
                      disabled={selectedPriorities.length === 0 || refinementLoading}
                      className={`
                        flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2
                        ${selectedPriorities.length > 0
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:scale-[1.01]"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }
                      `}
                    >
                      {refinementLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Recalibrating Vectors...</span>
                        </>
                      ) : (
                        <>
                          <HiLightningBolt className="w-4 h-4 text-amber-300" />
                          <span>Apply Priority Filter ({selectedPriorities.length}/3)</span>
                        </>
                      )}
                    </button>

                    {activeSession && (
                      <button
                        onClick={handleClearRefinement}
                        disabled={refinementLoading}
                        className="py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm border border-slate-200 text-slate-500 hover:bg-slate-50 transition duration-200 flex items-center justify-center gap-1.5"
                      >
                        <HiX className="w-4 h-4 text-slate-500" />
                        <span>Reset Default</span>
                      </button>
                    )}
                  </div>

                  {/* Info Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                    <span>{selectedPriorities.length}/3 matching pillars active</span>
                    {selectedPriorities.length > 0 && (
                      <button onClick={() => setSelectedPriorities([])} className="hover:text-indigo-600 underline transition font-semibold">
                        Clear Selections
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* ══════ Loading State (Clean Shimmer Grid) ══════ */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 animate-pulse space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-slate-100 rounded w-2/3"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  </div>
                  <div className="h-28 bg-slate-50 rounded-2xl"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-slate-100 rounded flex-1"></div>
                    <div className="h-10 bg-slate-100 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══════ Error State (Professional Alert UI) ══════ */}
          {!loading && error && (
            <div className="p-8 bg-rose-50/50 border border-rose-100 rounded-3xl text-center max-w-lg mx-auto shadow-sm space-y-5">
              <HiExclamation className="text-rose-500 w-12 h-12 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Connection Interrupted</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={fetchSuggestions}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition duration-200"
              >
                Attempt Reconnection
              </button>
            </div>
          )}

          {/* ══════ Empty State (Profile Optimization Trigger) ══════ */}
          {!loading && !error && suggestions.length === 0 && (
            <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center max-w-2xl mx-auto shadow-sm space-y-6">
              <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto">
                <HiSparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg sm:text-xl font-bold text-slate-855">High Alignment Candidates Loading</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Our semantic engine searches using your profile bio text. Write a rich, multi-paragraph description in your edit section to enable high-accuracy calculations.
                </p>
              </div>
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm transition duration-200"
              >
                Optimize My Profile Now
              </button>
            </div>
          )}

          {/* ══════ Suggestions Grid & Pagination ══════ */}
          {!loading && !error && suggestions.length > 0 && (
            <div className="space-y-8">
              {refinementMeta?.is_refined && (
                <div className="flex items-center gap-2 px-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                    <HiSparkles className="w-3 h-3 text-indigo-600" />
                    <span>Adaptive Scoring Active</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Showing {suggestions.length} high-alignment results
                  </span>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paginatedSuggestions.map((match) => {
                  const profileImage = getProfileImage(match);
                  const isLoading = loadingProfileId === match.user_id || loadingProfileId === match.id;
                  const isRefined = match.is_refined;

                  const confScore = match.confidence_score !== undefined ? match.confidence_score : 0.50;
                  let clarityLabel = "Good Clarity";
                  let clarityColor = "bg-blue-50 border-blue-100 text-blue-600";
                  if (confScore >= 0.82) {
                    clarityLabel = "Rich Profile";
                    clarityColor = "bg-emerald-50 border-emerald-100 text-emerald-600";
                  } else if (confScore >= 0.60) {
                    clarityLabel = "Good Clarity";
                    clarityColor = "bg-blue-50 border-blue-100 text-blue-600";
                  } else if (confScore >= 0.45) {
                    clarityLabel = "Moderate Clarity";
                    clarityColor = "bg-purple-50 border-purple-100 text-purple-600";
                  } else {
                    clarityLabel = "Early Profile";
                    clarityColor = "bg-amber-50 border-amber-100 text-amber-600";
                  }

                  return (
                    <div
                      key={match.id}
                      className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden p-5 sm:p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Subtle hover background highlight */}
                      <div className="absolute inset-0 bg-slate-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      {/* Refined badge */}
                      {isRefined && (
                        <div className="absolute top-4 right-4 z-20">
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                            <HiSparkles className="w-2.5 h-2.5 text-indigo-600" />
                            <span>Pillar Boosted</span>
                          </span>
                        </div>
                      )}

                      {/* Profile Card Header */}
                      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <img
                            src={profileImage}
                            alt={match.name}
                            onClick={() => handleViewProfile(match)}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-indigo-550 transition-all duration-300 cursor-pointer shadow-sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.name)}&background=random&color=fff&size=150`;
                            }}
                          />
                          <div className="cursor-pointer" onClick={() => handleViewProfile(match)}>
                            <h4 className="font-bold text-slate-800 text-base sm:text-lg group-hover:text-indigo-655 transition-colors">
                              {match.name}
                            </h4>
                            <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider leading-tight">{match.profession}</p>
                            <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                              <HiLocationMarker className="w-3.5 h-3.5 text-rose-500" />
                              <span>{match.city}</span>
                            </p>
                          </div>
                        </div>

                        {/* Compatibility Score Circle */}
                        <div className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full border shadow-sm flex-shrink-0 ${
                          isRefined ? 'bg-indigo-50 border-indigo-200 text-indigo-750' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>
                          <span className="text-sm font-extrabold leading-none">{match.compatibility_score}%</span>
                          <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5 opacity-80">Match</span>
                        </div>
                      </div>

                      {/* About Description Block */}
                      <p className="text-slate-500 text-xs sm:text-sm mb-5 leading-relaxed relative z-10 italic border-l-3 border-indigo-200 pl-3 py-0.5 bg-slate-50/50 rounded-r-2xl">
                        "{match.about_me ? (match.about_me.length > 110 ? match.about_me.substring(0, 110) + "..." : match.about_me) : "No description provided."}"
                      </p>

                      {/* Clarity Indicator */}
                      <div className="mb-4 relative z-10 flex items-center justify-between border-b border-slate-50 pb-3">
                        <span className="text-xs font-semibold text-slate-400">AI Profile Integrity</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${clarityColor}`}>
                          {clarityLabel} ({Math.round(confScore * 100)}%)
                        </span>
                      </div>

                      {/* Spider Graph Component */}
                      {match.spider_graph_data && (
                        <div className="mb-4 relative z-10 bg-slate-50/70 border border-slate-100 rounded-2xl p-2.5">
                          <SpiderGraph data={match.spider_graph_data} />
                        </div>
                      )}

                      {/* Intent Alignment Tags */}
                      {match.intent_tags && Object.keys(match.intent_tags).length > 0 && (
                        <div className="mb-6 relative z-10 space-y-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <HiTag className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Intent alignment</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(match.intent_tags).slice(0, 3).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-650 px-2.5 py-1 rounded-full font-bold transition duration-200"
                                title={`${key.replace(/_/g, " ")}: ${value}`}
                              >
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewProfile(match)}
                            disabled={isLoading}
                            className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition duration-200 flex items-center justify-center gap-2 hover:scale-[1.01]"
                          >
                            {isLoading ? (
                              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <HiUser className="w-4 h-4 text-white" />
                                <span>View Profile</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleSendMessage(match.user_id || match.id, match.name)}
                            className="px-3 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-2xl transition duration-200 flex items-center justify-center group"
                            title="Send Message"
                          >
                            <HiMail className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600" />
                          </button>
                        </div>

                        {/* Handshake Analysis Trigger */}
                        <button
                          onClick={() => handleHandshake(match)}
                          disabled={handshakeLoadingId === (match.user_id || match.id)}
                          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01]"
                        >
                          {handshakeLoadingId === (match.user_id || match.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-rose-700 border-t-transparent"></div>
                              <span>Analyzing Psychological Data...</span>
                            </>
                          ) : (
                            <>
                              <HiShieldCheck className="w-4 h-4 text-rose-600" />
                              <span>Deep AI Compatibility Report</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                  <span className="text-xs sm:text-sm font-medium text-slate-500">
                    Showing <span className="font-bold text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                    <span className="font-bold text-slate-800">
                      {Math.min(currentPage * ITEMS_PER_PAGE, suggestions.length)}
                    </span>{" "}
                    of <span className="font-bold text-slate-800">{suggestions.length}</span> candidates
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-55 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
                      aria-label="Previous Page"
                    >
                      <HiChevronLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition duration-200 ${
                            currentPage === page
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-55 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
                      aria-label="Next Page"
                    >
                      <HiChevronRight className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
           Module 3 — Handshake / Stress Synchronization Modal
          ══════════════════════════════════════════════════════ */}
      {handshakeError && (
        <div className="fixed bottom-6 right-6 z-[99999] max-w-sm bg-rose-600 text-white px-5 py-4 rounded-2xl shadow-xl flex items-start gap-3 animate-slide-up">
          <HiExclamationCircle className="w-6 h-6 flex-shrink-0 text-white" />
          <div className="flex-1 space-y-1">
            <p className="font-bold text-sm">Handshake Error</p>
            <p className="text-xs opacity-90">{handshakeError}</p>
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
           Module 8 — Anti-Ghosting Alert Popup (Light Theme)
          ══════════════════════════════════════════ */}
      {ghostingPopup && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setGhostingPopup(false); }}
        >
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl animate-modal-in">
            <div className="relative p-6 sm:p-8 space-y-5">
              {ghostingSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <HiCheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-slate-900 text-lg font-bold">Response Registered</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">Your digital twin has been sync'd to protect your Trust Level.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 border border-rose-100 text-rose-700">
                        <HiShieldExclamation className="w-3.5 h-3.5 text-rose-600" />
                        <span>GHOSTING ALIGNMENT CHECK</span>
                      </div>
                      <h3 className="text-slate-900 text-base sm:text-lg font-bold leading-tight">
                        Unanswered message from<br />
                        <span className="text-indigo-655">{trustStatus?.ghostingAlert?.partnerName || 'Your Match'}</span>
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Over {import.meta.env.VITE_GHOSTING_TIMEOUT_HOURS || 48} hours elapsed. Protecting your Trust rating requires inputting alignment state.
                      </p>
                    </div>
                    <button
                      onClick={() => setGhostingPopup(false)}
                      className="text-slate-400 hover:text-slate-655 transition text-2xl leading-none flex-shrink-0"
                    >
                      <HiX className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  {/* Trust Score Preview Indicator */}
                  <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <HiShieldCheck className="w-7 h-7 text-indigo-600 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Current Rating</span>
                        <span className="text-slate-800">{trustStatus?.trustScore ?? 100}/100</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${trustStatus?.trustScore ?? 100}%` }}
                        />
                      </div>
                      <p className="text-rose-600 text-[10px] font-bold">⚠️ Warning: Ignoring this prompt will deduct 20 points.</p>
                    </div>
                  </div>

                  {/* Response Reasons */}
                  <div className="space-y-3">
                    <p className="text-slate-700 text-xs font-bold uppercase tracking-wider">Select Alignment Reason:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Busy with Work', icon: HiBriefcase },
                        { label: 'Wrong Timing', icon: HiClock },
                        { label: 'Not Interested', icon: HiX },
                        { label: 'Already Talking', icon: HiChatAlt },
                        { label: 'Other', icon: HiAdjustments }
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setGhostingReason(item.label)}
                          className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-left border"
                          style={{
                            background: ghostingReason === item.label ? 'rgba(79, 70, 229, 0.08)' : 'rgba(248, 250, 252, 0.9)',
                            borderColor: ghostingReason === item.label ? '#4f46e5' : '#e2e8f0',
                            color: ghostingReason === item.label ? '#4f46e5' : '#334155',
                            gridColumn: item.label === 'Other' ? 'span 2' : 'span 1',
                          }}
                        >
                          {React.createElement(item.icon, { className: `w-4 h-4 ${ghostingReason === item.label ? 'text-indigo-655' : 'text-slate-400'}` })}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textarea for Other */}
                  {ghostingReason === 'Other' && (
                    <textarea
                      value={ghostingCustom}
                      onChange={(e) => setGhostingCustom(e.target.value)}
                      placeholder="Briefly explain details to tune your twin..."
                      rows={2.5}
                      className="w-full rounded-2xl px-4 py-3 text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                    />
                  )}

                  {/* Actions */}
                  <button
                    onClick={handleGhostingRespond}
                    disabled={!ghostingReason || ghostingSubmitting}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 hover:scale-[1.01]"
                  >
                    {ghostingSubmitting ? 'Syncing...' : 'Register Response & Preserve Trust'}
                  </button>
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
//  Module 3 — HandshakeResultModal (Light Theme & Minimalist)
// ═══════════════════════════════════════════════════════════════

function ProgressBar({ value, colorClass = "bg-indigo-600" }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full ${colorClass} transition-all duration-700 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function MetricRow({ label, value, colorClass, icon, iconColor }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          {icon && React.createElement(icon, { className: `w-4 h-4 ${iconColor || 'text-slate-400'}` })}
          <span>{label}</span>
        </span>
        <span className="font-extrabold text-slate-850 bg-slate-100 px-2 py-0.5 rounded">{pct}%</span>
      </div>
      <ProgressBar value={pct} colorClass={colorClass} />
    </div>
  );
}

function ConflictBadge({ risk }) {
  const val = Math.round(risk ?? 50);
  let bg, text, label, dot;
  if (val <= 30) {
    bg = "bg-emerald-50 border-emerald-100"; text = "text-emerald-700"; dot = "bg-emerald-500"; label = "Low risk";
  } else if (val <= 60) {
    bg = "bg-amber-50 border-amber-100"; text = "text-amber-700"; dot = "bg-amber-500"; label = "Moderate risk";
  } else {
    bg = "bg-rose-50 border-rose-100"; text = "text-rose-700"; dot = "bg-rose-500"; label = "High risk";
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label} ({val}%)
    </span>
  );
}

function PrivacyBadge({ protected: isProtected, label }) {
  return isProtected ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-150 text-emerald-700 text-[10px] sm:text-xs font-bold">
      <HiCheckCircle className="w-4 h-4 text-emerald-500" />
      <span>{label}</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-150 text-rose-700 text-[10px] sm:text-xs font-bold">
      <HiShieldExclamation className="w-4 h-4 text-rose-500" />
      <span>{label} Warning</span>
    </span>
  );
}

function AuditGradeBadge({ grade }) {
  const styles = {
    A: "bg-emerald-50 border-emerald-350 text-emerald-700 shadow-emerald-100",
    B: "bg-blue-50 border-blue-350 text-blue-700 shadow-blue-100",
    C: "bg-amber-50 border-amber-350 text-amber-700 shadow-amber-100",
    D: "bg-rose-50 border-rose-350 text-rose-700 shadow-rose-100",
  };
  const cls = styles[grade] || styles["C"];
  return (
    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border-2 font-black text-xl shadow-sm ${cls}`}>
      {grade || "C"}
    </span>
  );
}

function RecommendationPill({ recommendation }) {
  const map = {
    "Highly Compatible":       { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", pulse: false },
    "Compatible with Caution": { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",     dot: "bg-blue-500",     pulse: false },
    "Proceed Carefully":       { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   dot: "bg-amber-500",   pulse: true  },
    "Not Recommended":         { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    dot: "bg-rose-500",    pulse: true  },
    "Pending":                 { bg: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-500",   dot: "bg-slate-400",   pulse: false },
  };
  const s = map[recommendation] || map["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${s.bg} ${s.border} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`} />
      <span>{recommendation || "Pending"}</span>
    </span>
  );
}

function HandshakeResultModal({ match, session, onClose }) {
  const cm   = session?.compatibility_markers || {};
  const ss   = session?.stressSynchronization || session?.stress_synchronization || {};
  const pv   = session?.privacyVerification || session?.privacy_verification || {};
  const ar   = session?.auditReport || session?.audit_report || {};
  const fi   = session?.frictionInterview || session?.friction_interview || {};
  const cs   = session?.conflictSimulation || session?.conflict_simulation || {};
  const busy = Array.isArray(ss.busy_overlap) ? ss.busy_overlap : [];

  const scores = Object.values(cm).filter(v => typeof v === "number");
  const overall = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="AI Compatibility Analysis"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl ring-1 ring-slate-250 animate-modal-in flex flex-col">
        
        {/* Sticky Header (Light and Modern, No Gradients) */}
        <div className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 px-6 py-5 text-slate-800 flex-shrink-0 flex items-center gap-4 shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all duration-200"
            aria-label="Close modal"
          >
            <HiX className="w-4 h-4 text-slate-500" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-755 flex items-center justify-center font-black text-xl border border-indigo-100">
              {(match?.name || "U")[0].toUpperCase()}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{match?.name || "Match Profile"} Compatibility</h2>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider leading-none">{match?.profession || ""}</p>
            </div>
          </div>

          {overall !== null && (
            <div className="ml-auto flex items-center gap-2 bg-indigo-50/50 px-3.5 py-1.5 rounded-2xl border border-indigo-100/60">
              <div className="text-right">
                <div className="text-[8px] font-black uppercase tracking-wider text-slate-500">Overall score</div>
                <div className="text-xs text-slate-400 leading-none">Dual-Twin sync</div>
              </div>
              <span className="text-2xl font-black text-indigo-750">{overall}%</span>
            </div>
          )}
        </div>

        {/* Scrollable Report Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">

          {/* Section 1: AI Compatibility Metrics */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HiSparkles className="w-5 h-5 text-indigo-650" />
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Alignment Indicators</h3>
            </div>
            
            <div className="space-y-3">
              {cm.professional_alignment !== undefined && (
                <MetricRow label="Professional Alignment" value={cm.professional_alignment} colorClass="bg-blue-500" icon={HiBriefcase} iconColor="text-blue-500" />
              )}
              {cm.lifestyle_alignment !== undefined && (
                <MetricRow label="Lifestyle Alignment" value={cm.lifestyle_alignment} colorClass="bg-emerald-500" icon={HiSparkles} iconColor="text-emerald-500" />
              )}
              {cm.emotional_alignment !== undefined && (
                <MetricRow label="Emotional Alignment" value={cm.emotional_alignment} colorClass="bg-rose-500" icon={HiHeart} iconColor="text-rose-500" />
              )}
              {cm.communication_alignment !== undefined && (
                <MetricRow label="Communication Alignment" value={cm.communication_alignment} colorClass="bg-sky-500" icon={HiChatAlt} iconColor="text-sky-500" />
              )}
              {cm.growth_alignment !== undefined && (
                <MetricRow label="Growth Alignment" value={cm.growth_alignment} colorClass="bg-violet-500" icon={HiTrendingUp} iconColor="text-violet-500" />
              )}
            </div>

            {session?.handshake_summary && (
              <p className="text-xs text-slate-500 italic bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                "{session.handshake_summary}"
              </p>
            )}
          </section>

          {/* Section 2: Stress Synchronization */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HiLightningBolt className="w-5 h-5 text-amber-500" />
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Stress Sync & Recovery Cycles</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stress Alignment</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-slate-800">{ss.stress_alignment ?? "—"}%</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Match score</span>
                </div>
                <ProgressBar value={ss.stress_alignment ?? 50} colorClass="bg-rose-500" />
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recovery Match</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-slate-800">{ss.recovery_alignment ?? "—"}%</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Pace sync</span>
                </div>
                <ProgressBar value={ss.recovery_alignment ?? 50} colorClass="bg-emerald-500" />
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comm Availability</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-slate-800">{ss.communication_availability ?? "—"}%</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Tuning sync</span>
                </div>
                <ProgressBar value={ss.communication_availability ?? 50} colorClass="bg-indigo-500" />
              </div>

              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Friction Propensity</span>
                <ConflictBadge risk={ss.conflict_risk} />
              </div>
            </div>

            {/* Overlap Busy Months */}
            {busy.length > 0 && (
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-2">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <HiCalendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Shared High-stress months (Delta Alert)</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {busy.map((month) => (
                    <span key={month} className="px-2.5 py-1 bg-amber-100 text-amber-805 text-xs font-bold rounded-lg border border-amber-200">
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {ss.summary && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-indigo-950">
                <div className="text-[9px] font-bold text-indigo-750 uppercase tracking-widest mb-1">Conflict Dynamics Insight</div>
                <p className="text-xs leading-relaxed italic">"{ss.summary}"</p>
              </div>
            )}
          </section>

          {/* Section 3: Privacy Verification */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HiLockClosed className="w-5 h-5 text-teal-650" />
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Privacy Protection Check</h3>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 border border-slate-150 rounded-xl">
              {pv.professional_alignment_score !== undefined && (
                <MetricRow label="Masked Professional Alignment" value={pv.professional_alignment_score} colorClass="bg-teal-500" icon={HiLockClosed} iconColor="text-teal-500" />
              )}
              {pv.industry_match_score !== undefined && (
                <MetricRow label="Category Domain Correlation" value={pv.industry_match_score} colorClass="bg-indigo-500" icon={HiBriefcase} iconColor="text-indigo-500" />
              )}
              {pv.career_stage_match_score !== undefined && (
                <MetricRow label="Tier Level Alignment" value={pv.career_stage_match_score} colorClass="bg-purple-500" icon={HiTrendingUp} iconColor="text-purple-500" />
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Shields</span>
              <div className="flex flex-wrap gap-2">
                <PrivacyBadge protected={pv.identity_protected !== false} label="Identity Masking" />
                <PrivacyBadge protected={pv.employer_hidden !== false} label="Employer Masking" />
                <PrivacyBadge protected={pv.salary_hidden !== false} label="Comp Matrix Hidden" />
              </div>
            </div>

            {pv.ai_privacy_summary && (
              <div className="bg-teal-50 border border-teal-100 text-teal-900 rounded-xl p-4">
                <div className="text-[9px] font-bold text-teal-700 uppercase tracking-widest mb-1">Privacy auditor verification</div>
                <p className="text-xs leading-relaxed">"{pv.ai_privacy_summary}"</p>
              </div>
            )}
          </section>

          {/* Section 4: Structural Audit */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HiDocumentReport className="w-5 h-5 text-indigo-650" />
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Structural Audit Analysis</h3>
            </div>

            {ar.overall_score !== undefined ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                  <AuditGradeBadge grade={ar.grade} />
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wider">Audit Rating Score</span>
                    <MetricRow label="System Concordance" value={ar.overall_score} colorClass="bg-indigo-500" icon={HiDocumentReport} iconColor="text-indigo-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-y border-slate-150">
                  <span className="font-semibold text-slate-455">Match recommendation:</span>
                  <RecommendationPill recommendation={ar.recommendation} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">✨ Core Strengths</span>
                    {ar.strength_areas && ar.strength_areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ar.strength_areas.map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-emerald-100/70 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-250">{s}</span>
                        ))}
                      </div>
                    ) : <span className="text-xs text-slate-400">Not analyzed.</span>}
                  </div>

                  <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">⚠️ Friction Vectors</span>
                    {ar.risk_areas && ar.risk_areas.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {ar.risk_areas.map((r) => (
                          <span key={r} className="px-2 py-0.5 bg-rose-100/70 text-rose-800 text-[10px] font-bold rounded-md border border-rose-250">{r}</span>
                        ))}
                      </div>
                    ) : <span className="text-xs text-slate-400">None detected.</span>}
                  </div>
                </div>

                {ar.synthesis_summary && (
                  <div className="bg-indigo-50/50 border border-indigo-100 text-indigo-900 rounded-xl p-4 space-y-1">
                    <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest">Auditor Synthesis Summary</span>
                    <p className="text-xs leading-relaxed italic">"{ar.synthesis_summary}"</p>
                  </div>
                )}
              </div>
            ) : <p className="text-xs text-slate-400 text-center py-4">Audit data unavailable.</p>}
          </section>

          {/* Section 5: Friction Interview Dialogue */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HiChatAlt2 className="w-5 h-5 text-blue-650" />
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Digital Twin Dialogue Simulation</h3>
            </div>

            {fi.interviewSummary ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 bg-slate-50 border border-slate-150 p-3.5 rounded-xl leading-relaxed">
                  {fi.interviewSummary}
                </p>

                <div className="space-y-3 p-3.5 border border-slate-150 rounded-xl">
                  {fi.communicationCompatibility !== undefined && (
                    <MetricRow label="Dialog Concordance" value={fi.communicationCompatibility} colorClass="bg-blue-500" icon={HiChatAlt2} iconColor="text-blue-500" />
                  )}
                  {fi.lifestyleCompatibility !== undefined && (
                    <MetricRow label="Lifestyle Rhythm Alignment" value={fi.lifestyleCompatibility} colorClass="bg-emerald-500" icon={HiSparkles} iconColor="text-emerald-500" />
                  )}
                  {fi.workRhythmCompatibility !== undefined && (
                    <MetricRow label="Career Track Stability Correlation" value={fi.workRhythmCompatibility} colorClass="bg-amber-500" icon={HiBriefcase} iconColor="text-amber-500" />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">🤝 Synergy points</span>
                    <ul className="space-y-1.5">
                      {fi.agreementPoints?.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1">
                          <span className="text-emerald-555 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">⚠️ Discord points</span>
                    <ul className="space-y-1.5">
                      {fi.frictionPoints?.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1">
                          <span className="text-rose-555 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {fi.aiInsight && (
                  <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4">
                    <span className="text-[9px] font-bold text-indigo-755 uppercase tracking-widest block mb-1">Twin Synthesis Insight</span>
                    <p className="text-xs leading-relaxed italic">"{fi.aiInsight}"</p>
                  </div>
                )}
              </div>
            ) : <p className="text-xs text-slate-400 text-center py-4">Simulation data unavailable.</p>}
          </section>

          {/* Section 6: Conflict Simulation */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <HiShieldExclamation className="w-5 h-5 text-red-500" />
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-widest">Conflict Simulation Engine</h3>
            </div>

            {cs.conflictRisk !== undefined ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-150">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Crisis propensity metric</span>
                    <span className="text-xs text-slate-400">Simulation projection under peak loads</span>
                  </div>
                  <ConflictBadge risk={cs.conflictRisk} />
                </div>

                {cs.conflictScenarios?.map((sc, index) => (
                  <div key={index} className="border border-slate-150 rounded-xl p-4 space-y-3 bg-white">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <HiShieldExclamation className="w-4 h-4 text-rose-500" />
                      <span>{sc.scenarioName}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{sc.description}</p>
                    <p className="text-[10px] text-slate-400"><span className="font-bold text-slate-700">Trigger profile:</span> {sc.likelyTriggers}</p>

                    {sc.dynamicSimulation && (
                      <div className="bg-slate-50 text-slate-700 rounded-lg p-3 font-mono text-[10px] leading-relaxed whitespace-pre-line border border-slate-200">
                        <div className="text-[8px] font-bold text-slate-550 uppercase tracking-widest mb-1.5">Dialogue script projection</div>
                        {sc.dynamicSimulation}
                      </div>
                    )}
                  </div>
                ))}

                {cs.resolutionSuggestions && cs.resolutionSuggestions.length > 0 && (
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold text-indigo-800 flex items-center gap-1.5">
                      <HiTrendingUp className="w-4 h-4 text-indigo-650" />
                      <span>Recommended Resolution Strategies</span>
                    </span>
                    <ul className="space-y-1.5">
                      {cs.resolutionSuggestions.map((sug, i) => (
                        <li key={i} className="text-xs text-indigo-950 flex items-start gap-1">
                          <span className="text-indigo-500 font-extrabold">•</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : <p className="text-xs text-slate-400 text-center py-4">Conflict simulation results not calculated.</p>}
          </section>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-150 bg-white flex justify-end gap-3 flex-shrink-0 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-2xl transition duration-150"
          >
            Close Report
          </button>
        </div>

      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-in {
          animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
