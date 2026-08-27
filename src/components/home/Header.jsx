import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import NotificationBell from "../notifybell/NotificationBell";
import Logo from "../comman/Logo";
import ComingSoonModal from "../comman/ComingSoonModal";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, clearProfile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
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
    if (location.state?.showComingSoon) {
      setIsComingSoonOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

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
                      <i
                        className={`fa-solid fa-chart-pie text-sm transition-transform duration-200 group-hover:scale-110 ${
                          location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                            ? "text-[#6366F1]"
                            : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                      ></i>
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
                      <i
                        className={`fa-solid fa-location-dot text-sm transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/search") ? "text-[#FF2A6D]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                      ></i>
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
                      <i
                        className={`fa-solid fa-users text-sm transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/members") ? "text-[#2563EB]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                      ></i>
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
                      <i
                        className={`fa-solid fa-heart text-sm transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/matches") ? "text-[#FF2A6D]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                      ></i>
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
                      <i
                        className={`fa-solid fa-user-pen text-sm transition-transform duration-200 group-hover:scale-110 ${
                          isActive("/dashboard/edit-profile") ? "text-[#F59E0B]" : "text-slate-400 group-hover:text-[#002060]"
                        }`}
                      ></i>
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
                            <i className="fa-solid fa-chart-pie text-sm"></i>
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
                            <i className="fa-solid fa-user-pen text-sm"></i>
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
                            <i className="fa-solid fa-cart-shopping text-sm"></i>
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
                            <i className="fa-solid fa-right-from-bracket text-sm"></i>
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
                {/* Temporarily commented out login and register buttons
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
                */}
                <button
                  onClick={() => setIsComingSoonOpen(true)}
                  className="bg-[#FF2A6D] hover:bg-[#e0105a] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Coming soon
                </button>
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
                          <i className="fa-solid fa-chart-pie text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-id-card text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-user-pen text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-comment-dots text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-magnifying-glass-plus text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-heart text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-wand-magic-sparkles text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-users text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-credit-card text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-gears text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-cart-shopping text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-book-open text-sm w-4 text-center"></i>
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
                          <i className="fa-solid fa-right-from-bracket text-sm w-4 text-center"></i>
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
                  className="flex items-center gap-3 py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-chart-pie text-slate-400 group-hover:text-[#002060] text-base w-5 text-center transition-colors shrink-0"></i>
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/members"
                  className="flex items-center gap-3 py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-users text-slate-400 group-hover:text-[#002060] text-base w-5 text-center transition-colors shrink-0"></i>
                  <span>Members</span>
                </Link>
                <Link
                  to="/edit-profile"
                  className="flex items-center gap-3 py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-user-pen text-slate-400 group-hover:text-[#002060] text-base w-5 text-center transition-colors shrink-0"></i>
                  <span>Edit Profile</span>
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-between py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    <i className="fa-solid fa-cart-shopping text-slate-400 group-hover:text-[#002060] text-base w-5 text-center transition-colors shrink-0"></i>
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
                <div className="flex gap-3 px-2 flex-col w-full">
                  {/* Temporarily commented out mobile login and register buttons
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
                  */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsComingSoonOpen(true);
                    }}
                    className="w-full py-2.5 text-center bg-[#FF2A6D] hover:bg-[#e0105a] text-white rounded-xl font-bold text-xs transition shadow-sm hover:shadow-md"
                  >
                    Coming soon
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-sm group"
                >
                  <i className="fa-solid fa-right-from-bracket text-red-400 group-hover:text-red-600 text-base w-5 text-center transition-colors shrink-0"></i>
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
    </header>
  );
}
