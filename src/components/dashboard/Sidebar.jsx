// src/components/dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

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
          className={`w-full flex items-center gap-4 px-6 py-3.5 text-left rounded-xl transition-all duration-200 group focus:outline-none cursor-pointer border-l-4 ${
            active
              ? "bg-[#002060]/5 text-[#002060] border-[#FF2A6D] font-bold"
              : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-[#002060] border-transparent hover:border-slate-300"
          }`}
        >
          <span className="shrink-0">
            {icon}
          </span>
          <span className="flex-1 text-[16px] font-semibold">{label}</span>
          <span
            className={`text-[11px] transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180 text-[#FF2A6D]" : "text-slate-400 group-hover:text-[#002060]"
            }`}
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="ml-8 pl-5 mt-2 border-l-2 border-slate-100 flex flex-col gap-1.5 relative">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3.5 text-left rounded-xl transition-all duration-200 group focus:outline-none cursor-pointer border-l-4 ${
        active
          ? "bg-[#002060]/5 text-[#002060] border-[#FF2A6D] font-bold"
          : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-[#002060] border-transparent hover:border-slate-300"
      }`}
    >
      <span className="shrink-0">
        {icon}
      </span>
      <span className="text-[16px] font-semibold">{label}</span>
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
  const { clearProfile } = useUserProfile();

  const isProfileActive = activeSection === "profile" || activeSection === "edit-profile";

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:h-full bg-white border-r border-slate-100 shrink-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4">
          <nav className="space-y-2">
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              }
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => {
                navigate("/dashboard");
                setSidebarOpen(false);
              }}
            />

            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
              }
              label="Profile"
              active={isProfileActive}
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
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[14px] font-semibold text-slate-500 hover:text-[#002060] hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer group"
              >
                <svg className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
                <span className="font-medium">View Profile</span>
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/edit-profile");
                  setProfileDropdownOpen(false);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-[14px] font-semibold text-slate-500 hover:text-[#002060] hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer group"
              >
                <svg className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                <span className="font-medium">Edit Profile</span>
              </button>
            </SidebarItem>

            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
              label="Messages"
              active={activeSection === "messages"}
              onClick={() => {
                navigate("/dashboard/messages");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
              label="Advanced Search"
              active={activeSection === "search"}
              onClick={() => {
                navigate("/dashboard/search");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#FF2A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              }
              label="My Matches"
              active={activeSection === "matches"}
              onClick={() => {
                navigate("/dashboard/matches");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                  <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
                  <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
                </svg>
              }
              label="AI Suggestions"
              active={activeSection === "ai-suggestions"}
              onClick={() => {
                navigate("/dashboard/ai-suggestions");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              label="Browse Members"
              active={activeSection === "members"}
              onClick={() => {
                navigate("/dashboard/members");
                setSidebarOpen(false);
              }}
            />

            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              }
              label="Plan"
              active={activeSection === "plans"}
              onClick={() => {
                navigate("/dashboard/plans");
                setSidebarOpen(false);
              }}
            />
            
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              }
              label="Settings"
              active={activeSection === "settings"}
              onClick={() => {
                navigate("/dashboard/settings");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={
                <svg className="w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              }
              label="Blogs"
              active={activeSection === "blogs"}
              onClick={() => {
                navigate("/blog");
                setSidebarOpen(false);
              }}
            />
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="flex-shrink-0 p-5 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3.5 mb-4 p-3.5 bg-slate-50 border border-slate-100/60 rounded-2xl">
            {profile?.image_url || profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_image ? (
              <img
                src={profile.image_url || profile.profile_picture_url || profile.profilePhoto || profile.profile_image}
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-black shrink-0 text-sm">
                {profile?.first_name?.charAt(0) || profile?.name?.charAt(0) || profile?.full_name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[14px] font-extrabold text-slate-800 truncate leading-snug">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : profile?.name || profile?.full_name || "User"}
              </h4>
              <p className="text-[11px] text-slate-400 font-bold truncate leading-none mt-0.5">{profile?.email || "Free Member"}</p>
            </div>
          </div>

          <button
            onClick={() => {
              clearProfile();
              navigate("/login");
            }}
            className="flex items-center justify-center w-full px-4 py-3 text-[13px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50/30 hover:bg-rose-50 border border-rose-100/30 hover:border-rose-100/80 rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer gap-2"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    );
  }
