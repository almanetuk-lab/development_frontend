import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAiAgentConfig, updateAiAgentConfig } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";

export default function AIAgentSettings() {
  const { isFeatureAllowed } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [planActive, setPlanActive] = useState(null); // null = loading

  // Load AI agent config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getAiAgentConfig();
        setEnabled(config.enabled ?? false);
        setInstructions(config.instructions ?? "");
      } catch (err) {
        console.error("❌ [AIAgentSettings] Failed to load config:", err);
        toast.error("Failed to load AI agent settings");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Check plan status on mount
  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE_URL}/api/me/plan-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPlanActive(!!data?.active);
      } catch {
        setPlanActive(false);
      }
    };

    fetchPlanStatus();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAiAgentConfig({ enabled, instructions });
      toast.success("AI agent settings saved ✅");
    } catch (err) {
      console.error("❌ [AIAgentSettings] Failed to save config:", err);
      toast.error("Failed to save AI agent settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-sm">
        Loading AI agent settings...
      </div>
    );
  }

  if (!isFeatureAllowed("ai_agent")) {
    return <PlanRestrictionModal feature="ai_agent" />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">AI Agent</h2>
      <p className="text-sm text-gray-500 mb-6">
        Let your AI agent reply to messages on your behalf.
      </p>

      {/* Plan warning */}
      {planActive === false && (
        <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>
            <strong>No active plan detected.</strong> AI will not reply until you have an active subscription.{" "}
            <a href="/#/dashboard/plans" className="underline font-medium">
              Upgrade now →
            </a>
          </span>
        </div>
      )}

      {/* Enable / Disable toggle */}
      <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <p className="font-medium text-gray-800">Enable AI Agent</p>
          <p className="text-xs text-gray-500 mt-0.5">
            When on, your AI will automatically reply to incoming messages
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled((prev) => !prev)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            enabled ? "bg-indigo-600" : "bg-gray-300"
          }`}
          aria-pressed={enabled}
          id="ai-agent-toggle"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Custom instructions textarea */}
      <div className="mb-6">
        <label
          htmlFor="ai-agent-instructions"
          className="block font-medium text-gray-800 mb-1 text-sm"
        >
          Custom Instructions{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Tell your AI how to behave. These instructions take highest priority.
        </p>
        <textarea
          id="ai-agent-instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="E.g. Keep replies short and friendly. Don't discuss work hours. Always respond in a warm tone."
          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {instructions.length} / 2000
        </p>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || loading}
        id="ai-agent-save-btn"
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg text-sm transition-colors"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>

      {/* Informational helper text */}
      <div className="mt-8 border-t border-gray-100 pt-6 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          How it works
        </p>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <span>🔔</span>
          <span>Replies to every new message you receive while AI is enabled</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <span>🧠</span>
          <span>Uses your profile and digital twin personality to craft replies</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <span>💳</span>
          <span>Requires an active subscription plan on your account</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <span>📊</span>
          <span>AI replies do not count towards your message usage limit</span>
        </div>
      </div>
    </div>
  );
}
