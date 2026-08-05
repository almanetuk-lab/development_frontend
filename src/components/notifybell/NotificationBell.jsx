// components/NotificationBell.jsx 
import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    notificationsLoading: loading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useUserProfile();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    if (notification.source === 'admin') {
      console.log("Admin notification - no action");
      return;
    }
    
    markNotificationAsRead(notification.id);
    
    if (notification.sender_id) {
      navigate("/dashboard/messages", {
        state: {
          selectedUser: {
            id: notification.sender_id,
            name: notification.sender_name
          }
        }
      });
    } else {
      navigate("/dashboard/messages");
    }
    
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    if (!showDropdown) {
      fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMins = Math.floor((now - date) / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL ICON */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* HEADER */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllNotificationsAsRead} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`
                    p-4 border-b border-gray-100 transition
                    ${notification.source === 'admin' 
                      ? 'bg-gray-50 cursor-default hover:bg-gray-50' 
                      : 'cursor-pointer hover:bg-amber-50'
                    }
                    ${!notification.is_read && notification.source !== 'admin' ? 'bg-amber-50' : ''}
                  `}
                  onClick={() => {
                    if (notification.source !== 'admin') {
                      handleNotificationClick(notification);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* ICON */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg
                      ${notification.source === 'admin' 
                        ? 'bg-purple-100 text-purple-600'
                        : notification.is_reaction
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-blue-100 text-blue-600'
                      }
                    `}>
                      {notification.source === 'admin' ? '👨‍💼' : 
                       notification.is_reaction ? (notification.reaction_emoji || '❤️') : '💬'}
                    </div>
                    
                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800">
                          {notification.source === 'admin' 
                            ? notification.title || 'Admin Notification'
                            : notification.sender_name || 'User'
                          }
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {notification.source === 'admin' ? (
                          <>
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                            <span className="text-xs text-gray-400">🔒 Read only</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                              {notification.is_reaction ? 'Reaction' : 'Message'}
                            </span>
                            {!notification.is_read && (
                              <span className="text-xs text-amber-600">● New</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={fetchNotifications}
              className="w-full text-sm text-gray-600 hover:text-amber-600 font-medium py-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
