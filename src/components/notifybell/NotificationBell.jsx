
// components/NotificationBell.jsx 
import React, { useState, useEffect, useRef } from "react";
import { adminAPI } from "../services/adminApi";
import { chatApi } from "../services/chatApi";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const getUserId = () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData.user_id || userData.id;
      }
    } catch (error) {}
    
    const userId = localStorage.getItem("user_id") || localStorage.getItem("userId");
    if (userId) return userId;
    
    return "62";
  };

  const extractSenderInfo = (notification) => {
    let senderId = null;
    let senderName = "User";
    
    if (notification.sender_name) {
      senderName = notification.sender_name;
      senderId = notification.sender_id;
    }
    else if (notification.from_user_name) {
      senderName = notification.from_user_name;
      senderId = notification.from_user_id;
    }
    else if (notification.metadata) {
      try {
        const metadata = typeof notification.metadata === 'string' 
          ? JSON.parse(notification.metadata) 
          : notification.metadata;
        senderId = metadata.sender_id || metadata.user_id;
        senderName = metadata.sender_name || metadata.name || "User";
      } catch (error) {}
    }
    else {
      const message = notification.message || notification.content || "";
      if (message.includes("sent you a new message")) {
        const match = message.match(/^(.*?)\s+sent you a new message/);
        if (match && match[1]) {
          senderName = match[1].trim();
        }
      }
    }
    
    return { senderId, senderName };
  };

  const cleanUserName = (name) => {
    if (!name) return "User";
    return name.replace(/\d+$/, "").trim() || name;
  };

  const extractReactionEmoji = (notification) => {
    const message = notification.message || notification.content || "";
    if (message.includes("❤️")) return "❤️";
    if (message.includes("😂")) return "😂";
    if (message.includes("👍")) return "👍";
    if (message.includes("🔥")) return "🔥";
    return "❤️";
  };

  //  FIXED: Only show type:null for ADMIN notifications
  const fetchNotifications = async () => {
    const userId = getUserId();
    
    if (!userId) return;

    try {
      setLoading(true);
      
      let userNotifications = [];
      let adminNotifications = [];
      
      // 1. CHAT NOTIFICATIONS (User Messages)
      try {
        const response = await chatApi.getUserNotifications(userId);
        
        if (response.data) {
          let chatNotifs = [];
          
          if (Array.isArray(response.data)) {
            chatNotifs = response.data;
          } else if (response.data.notifications && Array.isArray(response.data.notifications)) {
            chatNotifs = response.data.notifications;
          } else if (response.data.messages && Array.isArray(response.data.messages)) {
            chatNotifs = response.data.messages;
          }
          
          //  FILTER: Sirf type: "Message" ya "reaction" wale rakho
          chatNotifs = chatNotifs.filter(notif => {
            // Admin ke messages mat dikhao
            if (notif.type === null) return false; 
            if (notif.title === "Account Approved" || notif.title === "Account On Hold") return false;
            
            return true;
          });
          
          const formattedChatNotifs = chatNotifs.map(notif => {
            const { senderId, senderName } = extractSenderInfo(notif);
            const isReaction = notif.type === "reaction" || (notif.message || "").includes("reacted");
            
            return {
              id: notif.id,
              type: isReaction ? 'reaction' : 'user',
              source: 'user',
              sender_id: senderId || notif.sender_id || notif.from_user_id,
              sender_name: cleanUserName(senderName),
              message: notif.message || notif.content || "sent you a message",
              created_at: notif.created_at || notif.timestamp,
              is_read: notif.is_read || false,
              is_reaction: isReaction,
              reaction_emoji: isReaction ? extractReactionEmoji(notif) : null
            };
          });
          
          userNotifications = [...userNotifications, ...formattedChatNotifs];
        }
      } catch (chatError) {}

      // 2. ADMIN NOTIFICATIONS (type: null wale)
      try {
        const adminResponse = await chatApi.getUserNotifications(userId); // Same API se
        
        if (adminResponse.data && Array.isArray(adminResponse.data)) {
          const adminMsgs = adminResponse.data.filter(notif => 
            notif.type === null || 
            notif.title === "Account Approved" || 
            notif.title === "Account On Hold"
          );
          
          const formattedAdminNotifs = adminMsgs.map(notif => ({
            id: notif.id,
            type: 'admin',
            source: 'admin',
            sender_name: "Admin",
            message: notif.message || notif.content || "System notification",
            created_at: notif.created_at || notif.timestamp,
            is_read: true, // Admin always read
            title: notif.title || "Admin Notification"
          }));
          
          adminNotifications = formattedAdminNotifs;
        }
      } catch (adminError) {}
      
      // Combine both
      const allNotifications = [...adminNotifications, ...userNotifications]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setNotifications(allNotifications);
      
      // Count unread (only user messages)
      const unread = userNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification) => {
    if (notification.source === 'admin') return;
    
    try {
      await chatApi.markNotificationAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {}
  };

  const handleNotificationClick = (notification) => {
    if (notification.source === 'admin') {
      console.log("Admin notification - no action");
      return;
    }
    
    markAsRead(notification);
    
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

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => n.source !== 'admin' ? { ...n, is_read: true } : n)
    );
    setUnreadCount(0);
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
                <button onClick={markAllAsRead} className="text-sm text-amber-600">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* WELCOME MESSAGE */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-gray-200">
            {/* <p className="font-medium text-gray-800">Welcome back, {currentUser?.name || "User"}!</p> */}
            {/* <p className="text-sm text-gray-600">Ready to find your perfect match?</p> */}
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













































































































































































































 












