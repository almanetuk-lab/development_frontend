// src/components/home/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import io from 'socket.io-client';

// Notification Bell Component (same as before)
const NotificationBell = () => {
  // ... (NotificationBell component code remains exactly the same as your original)
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const { profile } = useUserProfile();

  // Get user ID from profile
  const getUserId = () => {
    try {
      if (profile?.id) return profile.id;
      if (profile?.user_id) return profile.user_id;
      
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.id) return userData.id;
      if (userData.user_id) return userData.user_id;
      
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Socket.IO connection
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      console.log('No user ID found for notifications');
      return;
    }

    const socket = io('https://backend-q0wc.onrender.com');
    
    // Register user for real-time notifications
    socket.emit('register_user', userId);
    console.log('Registered user for notifications:', userId);

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      console.log('New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile]);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const userId = getUserId();
    const token = localStorage.getItem('accessToken');
    
    if (!userId || !token) {
      console.error('User ID or token not found');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching notifications for user:', userId);
      
      const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Notifications response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Notifications data:', data);
        setNotifications(data);
        
        // Calculate unread count
        const unread = data.filter(notif => !notif.is_read).length;
        setUnreadCount(unread);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const response = await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        console.error('Failed to mark as read:', response.status);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Token not found');
      return;
    }

    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      
      for (const notif of unreadNotifications) {
        await fetch(`https://backend-q0wc.onrender.com/api/notifications/read/${notif.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!showDropdown) {
      fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
      >
        {/* Bell Icon */}
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs sm:text-sm text-amber-600 hover:text-amber-800 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 sm:max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-gray-500 mt-2 text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <svg 
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.44 5.97 5.97 0 01-3.79-1.44M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-amber-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full ml-2 mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={fetchNotifications}
              className="w-full text-center text-xs sm:text-sm text-amber-600 hover:text-amber-800 font-medium py-2"
            >
              Refresh Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Header Component - PROPERLY RESPONSIVE
function Header() {
  const navigate = useNavigate();
  const { profile, clearProfile } = useUserProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Login status check
  const checkLoginStatus = () => {
    const userToken = localStorage.getItem("accessToken");
    const adminToken = localStorage.getItem("adminToken");
    return !!(userToken || adminToken);
  };

  const isLoggedIn = checkLoginStatus();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    localStorage.removeItem("user");
    clearProfile();
    setIsMobileMenuOpen(false);
    window.location.href = '/#/';
  };

  // Close mobile menu when clicking on a link
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header - Different layout for different screens */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-amber-600">
                Mingle <span className="text-gray-800">Hub</span>
              </h1>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex lg:ml-8 lg:space-x-4">
              <Link to="/" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-2">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-2">
                About
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-2">
                    Dashboard
                  </Link>
                  <Link to="/members" className="text-amber-600 font-medium border-b-2 border-amber-600 px-3 py-2">
                    Members
                  </Link>
                  <Link to="/edit-profile" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-2">
                    Edit Profile
                  </Link>
                </>
              )}
              
              <Link to="/contact" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-2">
                Contact Us
              </Link>
              <Link to="/blogs" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200 px-3 py-2">
                Blogs
              </Link>
            </nav>
          </div>

          {/* Desktop Auth Section - Hidden on mobile */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {isLoggedIn ? (
              <>
                {localStorage.getItem("accessToken") && <NotificationBell />}
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-semibold text-sm">
                      {profile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm">
                    {localStorage.getItem("adminToken") ? "Admin" : `Hi, ${profile?.name?.split(' ')[0] || 'User'}`}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/admin-login" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200">
                  Admin Login
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200">
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Visible only on mobile/tablet */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Show notification bell on mobile for logged-in users */}
            {isLoggedIn && localStorage.getItem("accessToken") && <NotificationBell />}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Shows on small screens */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2 border border-gray-200">
              {/* Navigation Links */}
              <Link
                to="/"
                onClick={handleMobileLinkClick}
                className="text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={handleMobileLinkClick}
                className="text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
              >
                About
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleMobileLinkClick}
                    className="text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/members"
                    onClick={handleMobileLinkClick}
                    className="text-amber-600 bg-white block px-3 py-3 rounded-md text-base font-medium border-l-4 border-amber-600"
                  >
                    Members
                  </Link>
                  <Link
                    to="/edit-profile"
                    onClick={handleMobileLinkClick}
                    className="text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                </>
              )}
              
              <Link
                to="/contact"
                onClick={handleMobileLinkClick}
                className="text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
              >
                Contact Us
              </Link>
              <Link
                to="/blogs"
                onClick={handleMobileLinkClick}
                className="text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
              >
                Blogs
              </Link>

              {/* Auth Section for Mobile */}
              <div className="border-t border-gray-200 mt-4 pt-4">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center px-3 py-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-600 font-semibold">
                          {profile?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {localStorage.getItem("adminToken") ? "Admin User" : profile?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {localStorage.getItem("adminToken") ? "Administrator" : "Member"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full bg-amber-600 text-white px-3 py-3 rounded-md text-base font-semibold hover:bg-amber-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/admin-login"
                      onClick={handleMobileLinkClick}
                      className="w-full text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium text-center border border-gray-300 transition-colors duration-200"
                    >
                      Admin Login
                    </Link>
                    <Link
                      to="/login"
                      onClick={handleMobileLinkClick}
                      className="w-full text-gray-700 hover:text-amber-600 hover:bg-white block px-3 py-3 rounded-md text-base font-medium text-center border border-gray-300 transition-colors duration-200"
                    >
                      User Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={handleMobileLinkClick}
                      className="w-full bg-amber-600 text-white block px-3 py-3 rounded-md text-base font-semibold hover:bg-amber-700 transition-colors duration-200 text-center"
                    >
                      Register Free
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;


