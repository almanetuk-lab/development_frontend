// src/components/dashboard/UserDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardContent";
import MessagesSection from "./MessagesSection";
import ProfilePage from "../profiles/ProfilePage";
import EditProfilePage from "../profiles/EditProfile";
import MatchesPage from "../MatchSystem/MatchesPage";
import AISuggestions from "../MatchSystem/AISuggestions";
import MemberPage from "../pages/MemberPage";
import AdvancedSearch from "./SearchSection";
import UserPlans from "../pages/UserPlans";

export default function UserDashboard() {
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get active section from URL
  const getActiveSection = useCallback(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") return "dashboard";
    if (path.includes("profile")) return "profile";
    if (path.includes("messages")) return "messages";
    if (path.includes("search")) return "search";
    if (path.includes("ai-suggestions")) return "ai-suggestions";
    if (path.includes("matches")) return "matches";
    if (path.includes("members")) return "members";
    if (path.includes("plans")) return "plans";
    return "dashboard";
  }, [location.pathname]);

  const activeSection = getActiveSection();

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-gray-400 text-3xl mb-3">👤</div>
          <h3 className="text-gray-800 text-lg mb-2">Create Your Profile</h3>
          <p className="text-gray-600 text-sm mb-4">
            Let's set up your profile to get started
          </p>
          <button
            onClick={() => navigate("/dashboard/edit-profile")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <Sidebar
        profile={profile}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
            >
              <span className="text-xl text-black">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {activeSection.replace("-", " ")}
            </h1>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Routes */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardHome profile={profile} />} />
            <Route path="profile/:userId?" element={<ProfilePage />} />
            {/* <Route path="profile" element={<ProfilePage />} /> */}
            {/* <Route path="profile/:userId" element={<ProfilePage />} /> */}
            <Route path="edit-profile" element={<EditProfilePage />} />
            <Route path="messages" element={<MessagesSection />} />
            <Route path="search" element={<AdvancedSearch />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="ai-suggestions" element={<AISuggestions />} />
            <Route path="members" element={<MemberPage />} />
            <Route path="plans" element={<UserPlans />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

            {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
