import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PrivacySettings() {
  const navigate = useNavigate();
  const [cookieConsent, setCookieConsent] = useState({
    essential: true,
    analytical: false,
    marketing: false,
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";

  // Load cookies from local storage
  useEffect(() => {
    const saved = localStorage.getItem("cookieConsent");
    if (saved) {
      try {
        setCookieConsent(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Update cookie consent settings
  const handleToggleConsent = async (key) => {
    if (key === "essential") return; // Essential cannot be disabled
    
    const updated = { ...cookieConsent, [key]: !cookieConsent[key] };
    setCookieConsent(updated);
    localStorage.setItem("cookieConsent", JSON.stringify(updated));

    // Optionally log to backend
    try {
      await fetch(`${API_BASE_URL}/api/privacy/consent`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consentDetails: updated }),
      });
    } catch (err) {
      console.warn("Failed to sync consent status with backend:", err);
    }
    toast.success("Privacy preferences updated successfully.");
  };

  // Handle Export Data
  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/privacy/export`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to export data. Session may have expired.");
      }

      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `intentional_connection_my_data_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Your data export has downloaded successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to export data.");
    } finally {
      setExportLoading(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your password to confirm deletion.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/privacy/delete-account`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account.");
      }

      toast.success("Account permanently deleted. Hope to see you again.");
      
      // Clean up token and local storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to landing
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Password verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Privacy & GDPR Controls</h2>
        <p className="text-sm text-gray-600">
          Manage your personal data, privacy settings, and cookie preferences in compliance with UK GDPR standards.
        </p>
      </div>

      {/* 1. Cookie Preferences */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <h3 className="text-lg font-medium text-gray-800 border-b pb-3">Cookie Preferences</h3>
        
        <div className="space-y-4">
          {/* Essential */}
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <p className="font-semibold text-gray-800 text-sm">Essential Cookies (Always Active)</p>
              <p className="text-xs text-gray-500">
                Required for core functionalities such as signing in, maintaining session security, and database routing.
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={cookieConsent.essential}
                disabled
                className="w-10 h-5 rounded-full bg-indigo-600 cursor-not-allowed accent-indigo-600"
              />
            </div>
          </div>

          {/* Analytical */}
          <div className="flex items-start justify-between border-t pt-4">
            <div className="flex-1 pr-4">
              <p className="font-semibold text-gray-800 text-sm">Analytics & Optimization Cookies</p>
              <p className="text-xs text-gray-500">
                Enables us to track visitor counts, session heatmaps, and load performance to refine matching speed.
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleToggleConsent("analytical")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  cookieConsent.analytical ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    cookieConsent.analytical ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Marketing */}
          <div className="flex items-start justify-between border-t pt-4">
            <div className="flex-1 pr-4">
              <p className="font-semibold text-gray-800 text-sm">Personalization & Personal Preference Cookies</p>
              <p className="text-xs text-gray-500">
                Remembers search heuristics, visual styling choices, and user notification alert thresholds.
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleToggleConsent("marketing")}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  cookieConsent.marketing ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    cookieConsent.marketing ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Data Portability (Right to Access) */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-lg font-medium text-gray-800 border-b pb-3">Right to Access & Portability</h3>
        <p className="text-xs text-gray-600">
          Under the UK GDPR, you have the right to request all data we store about you in a structured, commonly-used machine-readable format. This export contains your profile data, chat logs, compatibility markers, and digital twin settings.
        </p>
        <button
          onClick={handleExportData}
          disabled={exportLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
          {exportLoading ? "Preparing Export..." : "Export All My Data (JSON)"}
        </button>
      </div>

      {/* 3. Account Deletion (Right to Erasure) */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm space-y-4">
        <h3 className="text-lg font-medium text-red-800 border-b border-red-200 pb-3">Right to Erasure ("Right to be Forgotten")</h3>
        <p className="text-xs text-red-700 font-medium">
          ⚠️ WARNING: Permanent account deletion is final and cannot be undone. All your details, profile images, conversation history, and psychological match metrics will be deleted from our systems.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
        >
          Permanently Delete My Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Account Erasure</h3>
              <p className="text-xs text-gray-600">
                To confirm permanent deletion of all your data under UK GDPR, please verify your account password. This action cannot be reversed.
              </p>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPassword("");
                  }}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Deleting Permanent..." : "Permanently Delete Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
