// src/components/dashboard/UserDashboard.jsx
import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
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
      <div className="flex justify-center items-center h-screen bg-slate-50">
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
      <div className="flex justify-center items-center h-screen bg-slate-50">
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
    <Routes>
      <Route index element={<DashboardHome profile={profile} />} />
      <Route path="profile/:userId?" element={<ProfilePage />} />
      <Route path="edit-profile" element={<EditProfilePage />} />
      <Route path="messages" element={<MessagesSection />} />
      <Route path="search" element={<AdvancedSearch />} />
      <Route path="matches" element={<MatchesPage />} />
      <Route path="ai-suggestions" element={<AISuggestions />} />
      <Route path="members" element={<MemberPage />} />
      <Route path="plans" element={<UserPlans />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
