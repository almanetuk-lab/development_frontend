// src/components/home/Header.jsx (Fixed Version)
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import NotificationBell from "../notifybell/NotificationBell";

import bglogo from "../../assets/alternate.png";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

// Main Header Component
function Header() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // FIXED: Original login status check preserved
  const checkLoginStatus = () => {
    const userToken = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("adminToken");
    return !!(userToken || adminToken);
  };

  const isLoggedIn = checkLoginStatus();

  // FIXED: Original logout function preserved
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

  // Close mobile menu when clicking outside
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
    // Function to get cart count
    const getCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        return cart.length;
      } catch {
        return 0;
      }
    };

    // Update cart count
    const updateCartCount = () => {
      const count = getCartCount();
      setCartCount(count);
      console.log("🛒 Cart count:", count);
    };

    // Initial update
    updateCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // useEffect(() => {
  //   const updateCartCount = () => {
  //     try {
  //       const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  //       setCartCount(cart.length);
  //     } catch (error) {
  //       console.error("Error updating cart count:", error);
  //       setCartCount(0);
  //     }
  //   };

  //   updateCartCount();
  //   window.addEventListener("storage", updateCartCount);
  //   window.addEventListener("cartUpdated", updateCartCount);
  //   window.addEventListener("load", updateCartCount);
  //   window.addEventListener("focus", updateCartCount);

  //   return () => {
  //     window.removeEventListener("storage", updateCartCount);
  //     window.removeEventListener("cartUpdated", updateCartCount);
  //     window.removeEventListener("load", updateCartCount);
  //     window.removeEventListener("focus", updateCartCount);
  //   };
  // }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Header Row */}
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <div className="flex items-center z-50">
            <Link to="/" className="">
              <img
                src={bglogo}
                alt="Logo"
                className="h-5 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex gap-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                >
                  Home
                </Link>
              </li>

              {/* ADDED: About Us Link */}
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>

              {/* FIXED: Original navigation links preserved */}
              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/members"
                      className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                    >
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/edit-profile"
                      className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                    >
                      Edit Profile
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200"
                >
                  Blogs
                </Link>
              </li>
              {/* 
              {/* Social Links /}
              <li className="flex items-center gap-4 ml-4">
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-[#4D6D9E] transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={18} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-[#4D6D9E] transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-[#4D6D9E] transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={18} />
                </a> 
              </li> */}
            </ul>
          </nav>

          {/* Desktop Auth Section - ORIGINAL LOGIC PRESERVED */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Cart with Counter */}
                <div className="relative">
                  <Link
                    to="/cart"
                    className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200 flex items-center"
                  >
                    Cart 🛒
                  </Link>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[#FF66CC] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* Notification Bell - Original preserved */}
                {localStorage.getItem("accessToken") && <NotificationBell />}

                {/* Logout Button - Original preserved */}
                <button
                  onClick={handleLogout}
                  className="bg-[#727bf1] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#041cfa] transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* FIXED: Original login links preserved */}
               <Link
                  to="/login"
                  className="bg-[#727bf1] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#041cfa] transition-all duration-200"
                >
                  Login
                </Link>

                {/* <Link
                  to="/admin-login"
                  className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200 px-3 py-1"
                >
                  Admin Login
                </Link> */}

                <Link
                  to="/register"
                  className="bg-[#727bf1] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#041cfa] transition-all duration-200"
                >
                  Register 
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Cart for mobile - Original preserved */}
            {isLoggedIn && (
              <div className="relative mr-2">
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-[#4D6D9E] font-medium transition-colors duration-200 flex items-center"
                >
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[#FF66CC] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Notification Bell for mobile - Original preserved */}
            {isLoggedIn && localStorage.getItem("accessToken") && (
              <div className="mr-2">
               <NotificationBell />
                 
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Menu Content - ORIGINAL LOGIC PRESERVED */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Navigation Links */}
            <nav className="mb-6">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>

                {/* ADDED: About Us Link in Mobile */}
                <li>
                  <Link
                    to="/about"
                    className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                </li>

                {/* FIXED: Original mobile navigation preserved */}
                {isLoggedIn && (
                  <>
                    <li>
                      <Link
                        to="/dashboard"
                        className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/members"
                        className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Members
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/edit-profile"
                        className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link
                    to="/contact"
                    className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </li>

                <li>
                  <Link
                    to="/blog"
                    className="block py-3 px-4 text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Social Links in Mobile Menu */}
            <div className="flex justify-center gap-4 mb-6">
              <a
                href="#"
                className="text-gray-500 hover:text-[#4D6D9E] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#4D6D9E] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#4D6D9E] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>

            {/* Mobile Auth Section - ORIGINAL LOGIC PRESERVED */}
            <div className="border-t border-gray-200 pt-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm text-gray-600">
                      {localStorage.getItem("adminToken")
                        ? "Admin User"
                        : profile?.first_name && profile?.last_name
                        ? `Hello, ${profile.first_name} ${profile.last_name}`
                        : `Hello, ${
                            profile?.first_name || profile?.name || "User"
                          }`}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-[#FF66CC] text-white py-3 rounded-lg font-semibold hover:bg-[#ff4dc2] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* FIXED: Original Admin Login preserved */}
                  {/* <Link
                    to="/admin-login"
                    className="block py-3 px-4 text-center text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Login
                  </Link> */}

                  <Link
                    to="/login"
                    className="block py-3 px-4 text-center text-gray-700 hover:text-[#4D6D9E] hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="block py-3 px-4 text-center bg-[#FF66CC] text-white rounded-lg font-semibold hover:bg-[#ff4dc2] transition-colors"
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

export default Header;




































































































