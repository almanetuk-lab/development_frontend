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
              icon={<i className="fa-solid fa-chart-pie text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#6366F1] text-center"></i>}
              label="Dashboard"
              active={activeSection === "dashboard"}
              onClick={() => {
                navigate("/dashboard");
                setSidebarOpen(false);
              }}
            />

            <SidebarItem
              icon={<i className="fa-solid fa-user-gear text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#0EA5E9] text-center"></i>}
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
                <i className="fa-solid fa-id-card text-md w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#0EA5E9] text-center"></i>
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
                <i className="fa-solid fa-user-pen text-md w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#F59E0B] text-center"></i>
                <span className="font-medium">Edit Profile</span>
              </button>
            </SidebarItem>

            <SidebarItem
              icon={<i className="fa-solid fa-comment-dots text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#0D9488] text-center"></i>}
              label="Messages"
              active={activeSection === "messages"}
              onClick={() => {
                navigate("/dashboard/messages");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<i className="fa-solid fa-magnifying-glass-plus text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#8B5CF6] text-center"></i>}
              label="Advanced Search"
              active={activeSection === "search"}
              onClick={() => {
                navigate("/dashboard/search");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<i className="fa-solid fa-heart text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#FF2A6D] text-center"></i>}
              label="My Matches"
              active={activeSection === "matches"}
              onClick={() => {
                navigate("/dashboard/matches");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<i className="fa-solid fa-wand-magic-sparkles text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#F59E0B] text-center"></i>}
              label="AI Suggestions"
              active={activeSection === "ai-suggestions"}
              onClick={() => {
                navigate("/dashboard/ai-suggestions");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<i className="fa-solid fa-users text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#2563EB] text-center"></i>}
              label="Browse Members"
              active={activeSection === "members"}
              onClick={() => {
                navigate("/dashboard/members");
                setSidebarOpen(false);
              }}
            />

            <SidebarItem
              icon={<i className="fa-solid fa-credit-card text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#10B981] text-center"></i>}
              label="Plan"
              active={activeSection === "plans"}
              onClick={() => {
                navigate("/dashboard/plans");
                setSidebarOpen(false);
              }}
            />
            
            <SidebarItem
              icon={<i className="fa-solid fa-gears text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#64748B] text-center"></i>}
              label="Settings"
              active={activeSection === "settings"}
              onClick={() => {
                navigate("/dashboard/settings");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<i className="fa-solid fa-book-open text-lg w-6 shrink-0 transition-transform duration-200 group-hover:scale-105 text-[#EC4899] text-center"></i>}
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
            <i className="fa-solid fa-right-from-bracket text-md"></i>
            Logout
          </button>
        </div>
      </aside>
    );
  }
