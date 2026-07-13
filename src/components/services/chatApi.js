

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== api intersptr NEW CODE start =====
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== CHAT APIS ====================

export const chatApi = {
  // 🔍 Search users
  searchUsers: (searchQuery) => {
    return api.get(`/api/users?search=${encodeURIComponent(searchQuery)}`);
  },

  getPlanStatus: () => userApi.get("/api/me/plan-status"),

  // SEARCH PROFILES
  searchProfiles: (searchParams) =>
    api.get("/search", { params: searchParams }),

  // Get messages between users
  getMessages: (userId, currentUserId) => {
    return api.get(`/api/messages/${userId}?myUserId=${currentUserId}`);
  },

  // Send message
  sendMessage: (messageData) => {
    return api.post("/api/messages", messageData);
  },

  // for recent message
  getRecentChats: (myUserId) => {
    return api.get(`/api/chats/recent/${myUserId}`);
  },

  // Upload file
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/chat/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },


  //  // NOTIFICATION APIS ADDED
  // getUserNotifications: (userId) => 
  //   api.get(`/api/notifications/${userId}`),

  // markNotificationAsRead: (notificationId) => 
  //   api.put(`/api/notifications/read/${notificationId}`),



  // Add reaction to message
  addReaction: (reactionData) => {
    return api.post("/api/reactions", reactionData);
  },

  // Get reactions for conversation
  getReactions: (userA, userB) => {
    return api.get(`/api/reactions?userA=${userA}&userB=${userB}`);
  },

  markChatAsRead: (notificationId) => {
    return api.put(`/api/notifications/read/${notificationId}`);
  },

  // Get user notifications
  getUserNotifications: (userId) => {
    return api.get(`/api/notifications/${userId}`);
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: (userId) => {
    return api.put(`/api/notifications/read/messages/${userId}`);
  },

  // DELETE MESSAGE API
  deleteMessage: async (messageId) => {
    const currentUser = localStorage.getItem("currentUser");
    let userId = "";

    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        userId = userData.user_id || userData.id;
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const response = await api.delete(
      `/api/messages/${messageId}?userId=${userId}`
    );
    return response;
  },

  //   getUserNotifications: (userId) => {
  //   return api.get(`/api/notifications/${userId}`);
  // },

  // markNotificationAsRead: (notificationId) => {
  //   return api.put(`/api/notifications/read/${notificationId}`);
  // },
};


// ==================== HELPER FUNCTIONS ====================

export const getCurrentUserId = () => {
  let user = localStorage.getItem("currentUser") || '{"user_id": "10"}';
  try {
    const userData = JSON.parse(user);
    return userData.user_id || userData.id || "10";
  } catch {
    return "10";
  }
};

export const getSuggestedMatches = async () => {
  try {
    const userId = getCurrentUserId();
    const response = await api.get(`/api/my_matches/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested matches:", error);
    throw error;
  }
};

export const getAISuggestions = async () => {
  try {
    const response = await api.get(`/api/matches/suggestions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AI suggestions matches:", error);
    throw error;
  }
};

export const getAICompatibilityReport = async (targetUserId) => {
  try {
    const response = await api.get(`/api/matches/compatibility/${targetUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AI compatibility report:", error);
    throw error;
  }
};

// ==================== HANDSHAKE & STRESS SYNCHRONIZATION (Module 3) ====================

/**
 * Initiates the Structural Handshake Protocol between the logged-in user and a target user.
 * Returns full compatibility markers AND Stress-Cycle Delta Synchronization data.
 * @param {number|string} targetUserId
 * @returns {object} { message, data: { compatibility_markers, risk_flags, handshake_summary, stressSynchronization, ... } }
 */
export const initiateHandshake = async (targetUserId) => {
  try {
    const response = await api.post(`/api/handshake/${targetUserId}`);
    return response.data;
  } catch (error) {
    console.error("Error initiating handshake:", error);
    throw error;
  }
};


// ==================== QUERY REFINEMENT APIs (Point #7) ====================

export const setRefinedQuery = async (selected_priorities, raw_query = "", emotional_state = "") => {
  try {
    const response = await api.post(`/api/matches/refine-query`, {
      selected_priorities,
      raw_query,
      emotional_state,
    });
    return response.data;
  } catch (error) {
    console.error("Error setting refined query:", error);
    throw error;
  }
};

export const getActiveRefinedQuery = async () => {
  try {
    const response = await api.get(`/api/matches/refine-query/active`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active refined query:", error);
    throw error;
  }
};

export const clearRefinedQuery = async () => {
  try {
    const response = await api.delete(`/api/matches/refine-query/active`);
    return response.data;
  } catch (error) {
    console.error("Error clearing refined query:", error);
    throw error;
  }
};

export default api;









