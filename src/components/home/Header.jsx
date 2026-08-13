import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import NotificationBell from "../notifybell/NotificationBell";
import Logo from "../comman/Logo";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, clearProfile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const desktopProfileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const checkLoginStatus = () => {
    const userToken = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("adminToken");
    return !!(userToken || adminToken);
  };

  const isLoggedIn = checkLoginStatus();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("user");
    clearProfile();
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        (!mobileMenuButtonRef.current || !mobileMenuButtonRef.current.contains(event.target))
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        desktopProfileDropdownRef.current &&
        !desktopProfileDropdownRef.current.contains(event.target) &&
        mobileProfileDropdownRef.current &&
        !mobileProfileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        return cart.length;
      } catch {
        return 0;
      }
    };

    const updateCartCount = () => {
      const count = getCartCount();
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Header Row */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 z-50">
            <Logo size="text-xl" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center mx-4">
            <ul className="flex items-center gap-1.5 p-1.5 bg-slate-100/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-xs">
              {!isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/"
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive("/")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive("/about")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive("/contact")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive("/blog")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      Blogs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* Dashboard */}
                  <li>
                    <Link
                      to="/dashboard"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group ${
                        location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                            ? "text-[#6366F1]"
                            : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7" height="9" rx="1" />
                        <rect x="14" y="3" width="7" height="5" rx="1" />
                        <rect x="14" y="12" width="7" height="9" rx="1" />
                        <rect x="3" y="16" width="7" height="5" rx="1" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  {/* Near Me */}
                  <li>
                    <Link
                      to="/dashboard/search"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group ${
                        isActive("/dashboard/search")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/search") ? "text-[#FF2A6D]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>Near Me</span>
                    </Link>
                  </li>

                  {/* Browse Members */}
                  <li>
                    <Link
                      to="/dashboard/members"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group ${
                        isActive("/dashboard/members")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/members") ? "text-[#2563EB]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>Browse Members</span>
                    </Link>
                  </li>

                  {/* My Matches */}
                  <li>
                    <Link
                      to="/dashboard/matches"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group ${
                        isActive("/dashboard/matches")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/matches") ? "text-[#FF2A6D]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      <span>My Matches</span>
                    </Link>
                  </li>

                  {/* Edit Profile */}
                  <li>
                    <Link
                      to="/dashboard/edit-profile"
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group ${
                        isActive("/dashboard/edit-profile")
                          ? "bg-white text-[#002060] font-bold shadow-xs"
                          : "text-slate-600 hover:text-[#002060] hover:bg-white/60"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/edit-profile") ? "text-[#F59E0B]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                      <span>Edit Profile</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <>

                {/* Notification Bell */}
                {localStorage.getItem("accessToken") && <NotificationBell />}

                {/* Profile Icon / Avatar Dropdown */}
                <div ref={desktopProfileDropdownRef} className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-95 cursor-pointer focus:outline-none group relative p-1 rounded-full hover:bg-slate-50 transition-all duration-300 hover:ring-2 hover:ring-[#FF2A6D]/20 active:scale-95"
                    title="User Profile Menu"
                  >
                    {profile?.image_url || profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_image ? (
                      <img
                        src={profile.image_url || profile.profile_picture_url || profile.profilePhoto || profile.profile_image}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#FF2A6D] shadow-sm group-hover:border-[#002060] transition-colors"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#002060] to-[#FF2A6D] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {profile?.first_name?.charAt(0) || profile?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <svg
                      className={`w-4 h-4 text-slate-500 group-hover:text-[#002060] transition-all duration-300 ${
                        isProfileDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] rounded-2xl py-3 z-50 animate-fade-in transition-all duration-300">
                      {/* User Info Header Card */}
                      <div className="px-5 py-3.5 border-b border-slate-50 bg-slate-50/50 rounded-t-xl flex items-center gap-3">
                        {profile?.image_url || profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_image ? (
                          <img
                            src={profile.image_url || profile.profile_picture_url || profile.profilePhoto || profile.profile_image}
                            alt="Profile"
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#002060] to-[#FF2A6D] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                            {profile?.first_name?.charAt(0) || profile?.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                            {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : "User"}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {profile?.email || "No email provided"}
                          </p>
                          <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 tracking-wider uppercase border border-indigo-100/50">
                            Member
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <div className="px-2 pt-2 space-y-0.5">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                        >
                          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <p className="leading-tight">Dashboard</p>
                            <p className="text-[10px] text-slate-400 font-normal">View your dashboard</p>
                          </div>
                        </Link>

                        <Link
                          to="/edit-profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                        >
                          <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <p className="leading-tight">Edit Profile</p>
                            <p className="text-[10px] text-slate-400 font-normal">Update your info</p>
                          </div>
                        </Link>

                        <Link
                          to="/cart"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                        >
                          <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="leading-tight">My Cart</span>
                              {cartCount > 0 && (
                                <span className="bg-[#FF2A6D] text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
                                  {cartCount}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-normal">Checkout plans</p>
                          </div>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 my-2"></div>

                      <div className="px-2">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-bold transition-all duration-200 group"
                        >
                          <span className="p-1.5 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </span>
                          <div className="text-left">
                            <p className="leading-tight">Logout</p>
                            <p className="text-[10px] text-red-400 font-normal">Sign out of app</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-[#FF2A6D] hover:bg-[#e0105a] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">

            {isLoggedIn && localStorage.getItem("accessToken") && (
              <div className="mr-1">
                <NotificationBell />
              </div>
            )}

            {/* Mobile Profile Icon / Avatar Dropdown */}
            {isLoggedIn && (
              <div ref={mobileProfileDropdownRef} className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-1 hover:opacity-95 cursor-pointer focus:outline-none group relative p-1 rounded-full hover:bg-slate-50 transition-all duration-300 hover:ring-2 hover:ring-[#FF2A6D]/20 active:scale-95"
                  title="User Profile Menu"
                >
                  {profile?.image_url || profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_image ? (
                    <img
                      src={profile.image_url || profile.profile_picture_url || profile.profilePhoto || profile.profile_image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#FF2A6D] shadow-sm group-hover:border-[#002060] transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#002060] to-[#FF2A6D] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {profile?.first_name?.charAt(0) || profile?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 text-slate-500 group-hover:text-[#002060] transition-all duration-300 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mobile Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 max-w-xs bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl py-3 z-50 animate-fade-in transition-all duration-300 max-h-[80vh] overflow-y-auto">
                    {/* User Info Header Card */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-xl flex items-center gap-3">
                      {profile?.image_url || profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_image ? (
                        <img
                          src={profile.image_url || profile.profile_picture_url || profile.profilePhoto || profile.profile_image}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002060] to-[#FF2A6D] flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                          {profile?.first_name?.charAt(0) || profile?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                          {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : profile?.name || "User"}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {profile?.email || "No email provided"}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Items (Sidebar items on mobile) */}
                    <div className="px-2 pt-2 space-y-0.5">
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Navigation Menu
                      </div>

                      {/* Dashboard */}
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="9" rx="1" />
                            <rect x="14" y="3" width="7" height="5" rx="1" />
                            <rect x="14" y="12" width="7" height="9" rx="1" />
                            <rect x="3" y="16" width="7" height="5" rx="1" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Dashboard</span>
                      </Link>

                      {/* View Profile */}
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21a8 8 0 0 0-16 0" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">View Profile</span>
                      </Link>

                      {/* Edit Profile */}
                      <Link
                        to="/dashboard/edit-profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Edit Profile</span>
                      </Link>

                      {/* Messages */}
                      <Link
                        to="/dashboard/messages"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Messages</span>
                      </Link>

                      {/* Advanced Search */}
                      <Link
                        to="/dashboard/search"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Advanced Search</span>
                      </Link>

                      {/* My Matches */}
                      <Link
                        to="/dashboard/matches"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-rose-50 text-[#FF2A6D] group-hover:bg-rose-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">My Matches</span>
                      </Link>

                      {/* AI Suggestions */}
                      <Link
                        to="/dashboard/ai-suggestions"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">AI Suggestions</span>
                      </Link>

                      {/* Browse Members */}
                      <Link
                        to="/dashboard/members"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Browse Members</span>
                      </Link>

                      {/* Plan */}
                      <Link
                        to="/dashboard/plans"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Plan</span>
                      </Link>

                      {/* Settings */}
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Settings</span>
                      </Link>

                      {/* My Cart */}
                      <Link
                        to="/cart"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="leading-tight">My Cart</span>
                          {cartCount > 0 && (
                            <span className="bg-[#FF2A6D] text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
                              {cartCount}
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Blogs */}
                      <Link
                        to="/blog"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        </span>
                        <span className="leading-tight flex-1">Blogs</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 my-2"></div>

                    {/* Logout */}
                    <div className="px-2">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-bold transition-all duration-200 group"
                      >
                        <span className="p-1.5 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </span>
                        <span className="leading-tight">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <button
                ref={mobileMenuButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-[#002060] hover:bg-slate-50 transition-all active:scale-95"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl z-50 transition-all duration-300 ease-in-out overflow-hidden rounded-b-2xl ${
            isMobileMenuOpen ? "max-h-[550px] opacity-100 py-4" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 space-y-1">
            {!isLoggedIn && (
              <>
                <Link
                  to="/"
                  className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
              </>
            )}
            {isLoggedIn && (
              <>
                {/* Mobile Menu Profile Header Section */}
                <div className="px-4 py-3 mb-3 bg-slate-50/50 rounded-xl flex items-center gap-3 border border-slate-100/50">
                  {profile?.image_url || profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_image ? (
                    <img
                      src={profile.image_url || profile.profile_picture_url || profile.profilePhoto || profile.profile_image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002060] to-[#FF2A6D] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {profile?.first_name?.charAt(0) || profile?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-snug">
                      {profile?.first_name ? `${profile.first_name} ${profile.last_name || ""}` : "User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {profile?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/members"
                  className="flex items-center gap-3 py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">👥</span>
                  <span>Members</span>
                </Link>
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-3 py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">✏️</span>
                  <span>Edit Profile</span>
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-between py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">🛒</span>
                    <span>My Cart</span>
                  </span>
                  {cartCount > 0 && (
                    <span className="bg-[#FF2A6D] text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {!isLoggedIn && (
              <Link
                to="/contact"
                className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            )}
            <Link
              to="/blog"
              className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>

            <div className="border-t border-slate-100 pt-4 pb-2 mt-2">
              {!isLoggedIn ? (
                <div className="flex gap-3 px-2">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 text-center text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-xs transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2.5 text-center bg-[#FF2A6D] hover:bg-[#e0105a] text-white rounded-xl font-bold text-xs transition shadow-sm hover:shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-sm"
                >
                  <span className="text-lg">🚪</span>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
