// src/components/dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarIcons from "./SidebarIcons";

const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
  isDropdown = false,
  isOpen = false,
  onToggle,
  children,
}) => {
  if (isDropdown) {
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
          }`}
        >
          <span className="text-xl">{icon}</span>
          <span className="flex-1 font-medium text-sm sm:text-base">
            {label}
          </span>
          <span
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="ml-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm"
          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </button>
  );
};

export default function Sidebar({
  profile,
  activeSection,
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
        h-screen flex flex-col
      `}
    >
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Header - Fixed Height */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          MingleHub
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Find Your Perfect Match
        </p>

        {/* Dashboard Icons */}
        <div className="mt-3 sm:mt-4">
          <SidebarIcons />
        </div>
      </div>

      {/* Navigation Menu - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-3 sm:px-4">
        <nav className="space-y-1">
          <SidebarItem
            icon="🏠"
            label="Dashboard"
            active={activeSection === "dashboard"}
            onClick={() => {
              navigate("/dashboard");
              setSidebarOpen(false);
            }}
          />

          {/* Profile Dropdown */}
          <SidebarItem
            icon="👤"
            label="Profile"
            active={
              activeSection === "profile" || activeSection === "edit-profile"
            }
            isDropdown={true}
            isOpen={profileDropdownOpen}
            onToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <button
              onClick={() => {
                navigate("/dashboard/profile");
                setProfileDropdownOpen(false);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 text-sm"
            >
              <span className="text-base">👤</span>
              <span className="font-medium">View Profile</span>
            </button>
            <button
              onClick={() => {
                navigate("/dashboard/edit-profile");
                setProfileDropdownOpen(false);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 text-sm"
            >
              <span className="text-base">✏️</span>
              <span className="font-medium">Edit Profile</span>
            </button>
          </SidebarItem>

          <SidebarItem
            icon="💬"
            label="Messages"
            active={activeSection === "messages"}
            onClick={() => {
              navigate("/dashboard/messages");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon="🔍"
            label="Advanced Search"
            active={activeSection === "search"}
            onClick={() => {
              navigate("/dashboard/search");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon="👥"
            label="My Matches"
            active={activeSection === "matches"}
            onClick={() => {
              navigate("/dashboard/matches");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon="⚡"
            label="AI Suggestions"
            active={activeSection === "ai-suggestions"}
            onClick={() => {
              navigate("/dashboard/ai-suggestions");
              setSidebarOpen(false);
            }}
          />
          <SidebarItem
            icon="🌐"
            label="Browse Members"
            onClick={() => {
              navigate("/dashboard/members");
              setSidebarOpen(false);
            }}
          />
        </nav>
      </div>

      {/* User Profile Section - Fixed Height */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-3 p-2 sm:p-3 bg-gray-50 rounded-xl">
          {profile?.profile_picture_url || profile?.profilePhoto ? (
            <img
              src={profile.profile_picture_url || profile.profilePhoto}
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-indigo-500"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
              {profile?.full_name?.split(" ")[0] || "User"}
            </p>
            <p className="text-xs text-gray-500">Free Member</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="flex items-center justify-center w-full px-3 py-2 sm:px-4 sm:py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium text-sm sm:text-base"
        >
          <span className="mr-2">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}
