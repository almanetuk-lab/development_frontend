
// src/components/dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
          className={`w-full flex items-center gap-3 px-4 py-4 text-left rounded-xl transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
          }`}
        >
          <span className="text-xl">{icon}</span>
          <span className="flex-1 font-medium">{label}</span>
          <span
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="ml-6 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-4 text-left rounded-xl transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600 shadow-sm"
          : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
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
    <>
      {/* Overlay - Only for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 h-screen flex flex-col overflow-hidden`}
      >
         {/* <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
         <span className="text-[#13161673]"> Intentional </span> <span className="text-[#f5176c]"> Connetions </span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Find Your Perfect Match</p>
        </div>  */}

 

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4">
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
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                <span className="text-lg">👤</span>
                <span className="font-medium">View Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/edit-profile");
                  setProfileDropdownOpen(false);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              >
                <span className="text-lg">✏️</span>
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
              icon="👥"
              label="Browse Members"
              onClick={() => {
                navigate("/dashboard/members");
                setSidebarOpen(false);
              }}
            />

            <SidebarItem
              icon="💳"
              label="Plan"
              active={activeSection === "plans"}
              onClick={() => {
                navigate("/dashboard/plans");
                setSidebarOpen(false);
              }}
            />
              {/* <SidebarItem
              icon="⚙️"
              label="Settings"
              onClick={() => {
                // navigate("/dashboard/plans");
                setSidebarOpen(false);
              }}
            /> */}
            
            <SidebarItem
  icon="⚙️"
  label="Settings"
  active={activeSection === "settings"}
  onClick={() => {
    navigate("/dashboard/settings");
    setSidebarOpen(false);
  }}
/>
          </nav>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
            {profile?.profile_picture_url || profile?.profilePhoto ? (
              <img
                src={profile.profile_picture_url || profile.profilePhoto}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {/* <p className="text-sm font-medium text-gray-800 truncate">
                {profile?.full_name?.split(' ')[0] || 'User'}
              </p> */}
              <p className="text-xs text-gray-500">Free Member</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "#/login";
            }}
            className="flex items-center w-full px-4 py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 font-medium"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
