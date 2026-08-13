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
      // Automatically mark all notifications as read on opening
      if (unreadCount > 0) {
        markAllNotificationsAsRead();
      }
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
        className="relative p-2 text-slate-600 hover:text-[#002060] transition-all duration-300 hover:bg-slate-50 hover:ring-2 hover:ring-[#FF2A6D]/20 active:scale-95 rounded-full cursor-pointer focus:outline-none"
        title="Notifications"
      >
        <FaBell className="w-5 h-5 transition-transform duration-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-[#FF2A6D] text-white text-[10px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-96 max-w-sm bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] rounded-2xl py-1.5 z-50 animate-fade-in transition-all duration-300">
          {/* HEADER */}
          <div className="px-5 py-3.5 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllNotificationsAsRead} 
                className="text-xs text-[#FF2A6D] hover:text-[#e0105a] font-bold transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-7 w-7 border-2 border-slate-200 border-t-[#FF2A6D] mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm font-semibold">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No new notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`
                    px-5 py-4 border-b border-slate-50 last:border-0 transition-colors
                    ${notification.source === 'admin' 
                      ? 'bg-slate-50/50 cursor-default' 
                      : 'cursor-pointer hover:bg-slate-50'
                    }
                    ${!notification.is_read && notification.source !== 'admin' ? 'bg-[#FF2A6D]/5 hover:bg-[#FF2A6D]/10' : ''}
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
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm
                      ${notification.source === 'admin' 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        : notification.is_reaction
                        ? 'bg-pink-50 text-[#FF2A6D] border border-pink-100'
                        : 'bg-blue-50 text-[#002060] border border-blue-100'
                      }
                    `}>
                      {notification.source === 'admin' ? (
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      ) : notification.is_reaction ? (
                        <svg className="w-5 h-5 text-[#FF2A6D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#002060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-slate-800 truncate">
                          {notification.source === 'admin' 
                            ? notification.title || 'Admin Update'
                            : notification.sender_name || 'User'
                          }
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0 mt-0.5">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 mt-1 break-words leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1.5">
                          {notification.source === 'admin' ? (
                            <>
                              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100/50 uppercase tracking-wider">
                                Admin
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                System
                              </span>
                            </>
                          ) : (
                            <>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                notification.is_reaction 
                                  ? 'bg-pink-50 text-[#FF2A6D] border-pink-100/50' 
                                  : 'bg-blue-50 text-[#002060] border-blue-100/50'
                              }`}>
                                {notification.is_reaction ? 'Reaction' : 'Message'}
                              </span>
                              {!notification.is_read && (
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF2A6D] animate-ping" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="p-2.5 border-t border-slate-50 bg-slate-50/50 rounded-b-2xl">
            <button
              onClick={fetchNotifications}
              className="w-full text-xs text-slate-500 hover:text-[#002060] font-bold py-2 hover:bg-white rounded-xl transition-all duration-200 shadow-sm border border-slate-100 flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              <svg 
                className={`w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`}
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
