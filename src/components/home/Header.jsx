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
  const mobileMenuRef = useRef(null);

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
    window.location.href = "/#/";

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
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
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-50 transition-all">
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

              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/members"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/edit-profile"
                      className="text-slate-600 hover:text-[#002060] hover:bg-slate-50 px-3 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
                </>
              )}

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
            </ul>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Cart with Counter */}
                <div className="relative mr-2">
                  <Link
                    to="/cart"
                    className="text-slate-600 hover:text-[#002060] font-semibold transition-colors duration-200 flex items-center gap-1"
                  >
                    <span>Cart</span>
                    <span>🛒</span>
                  </Link>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[#FF2A6D] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* Notification Bell */}
                {localStorage.getItem("accessToken") && <NotificationBell />}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                >
                  Logout
                </button>
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
          <div className="lg:hidden flex items-center gap-4">
            {isLoggedIn && (
              <div className="relative mr-2">
                <Link
                  to="/cart"
                  className="text-slate-600 hover:text-slate-800 transition-colors duration-200 flex items-center"
                >
                  <span>🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[#FF2A6D] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {isLoggedIn && localStorage.getItem("accessToken") && (
              <div className="mr-2">
                <NotificationBell />
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
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
            isMobileMenuOpen ? "max-h-[500px] opacity-100 py-4" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 space-y-1">
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
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/members"
                  className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Members
                </Link>
                <Link
                  to="/edit-profile"
                  className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Edit Profile
                </Link>
              </>
            )}
            <Link
              to="/contact"
              className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link
              to="/blog"
              className="block py-2.5 px-4 text-slate-600 hover:text-[#002060] hover:bg-slate-50 rounded-xl transition font-semibold text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>

            <div className="border-t border-slate-100 pt-4 pb-2 mt-2">
              {isLoggedIn ? (
                <div className="flex items-center justify-between px-4">
                  <span className="text-xs text-slate-400 font-semibold truncate max-w-[160px]">
                    {localStorage.getItem("adminToken")
                      ? "Admin User"
                      : profile?.first_name && profile?.last_name
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.first_name || profile?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-[#FF2A6D] hover:bg-[#e0105a] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm animate-pulse"
                  >
                    Logout
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
