// src/components/home/Header.jsx (Refined, Premium UI Design)
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import NotificationBell from "../notifybell/NotificationBell";
import Logo from "../comman/Logo";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const desktopProfileDropdownRef = useRef(null);
  const mobileProfileDropdownRef = useRef(null);

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
        !mobileMenuRef.current.contains(event.target)
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
          <div className="flex items-center z-50">
            <Logo size="text-xl" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-6">
              {!isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/about"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      About Us
                    </Link>
                  </li>
                </>
              )}

              {!isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/contact"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Blogs
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
                  <div className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-72 max-w-xs bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] rounded-2xl py-3 z-50 animate-fade-in transition-all duration-300">
                    {/* User Info Header Card */}
                    <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50 rounded-t-xl flex items-center gap-3">
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

                    {/* Dropdown Items */}
                    <div className="px-2 pt-2 space-y-0.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200"
                      >
                        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                          </svg>
                        </span>
                        <span className="leading-tight">Dashboard</span>
                      </Link>

                      <Link
                        to="/edit-profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200"
                      >
                        <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                        <span className="leading-tight">Edit Profile</span>
                      </Link>

                      <Link
                        to="/cart"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-[#002060] font-semibold transition-all duration-200"
                      >
                        <span className="p-1.5 rounded-lg bg-pink-50 text-pink-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </span>
                        <div className="flex-1 flex items-center justify-between">
                          <span className="leading-tight">My Cart</span>
                          {cartCount > 0 && (
                            <span className="bg-[#FF2A6D] text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold shadow-sm animate-pulse">
                              {cartCount}
                            </span>
                          )}
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
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-bold transition-all duration-200"
                      >
                        <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
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

            <button
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
