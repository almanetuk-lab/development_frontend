
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/api";
import api from "../services/api";
import io from "socket.io-client";
import { chatApi } from "../services/chatApi";
import { userAPI } from "../services/userApi";

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePlan, setActivePlan] = useState({ active: false, days_left: 0, plan_name: "Free Plan" });
  const [planLoading, setPlanLoading] = useState(true);

  const fetchPlanStatus = async () => {
    try {
      setPlanLoading(true);
      const res = await userAPI.getPlanStatus();
      if (res.data) {
        let planData = res.data;
        if (typeof planData.allowed_features === "string") {
          try {
            planData.allowed_features = JSON.parse(planData.allowed_features);
          } catch (e) {}
        }
        setActivePlan(planData);
      }
    } catch (error) {
      console.error("❌ Error fetching plan status in context:", error);
      setActivePlan({ active: false, days_left: 0, plan_name: "Free Plan" });
    } finally {
      setPlanLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      console.log("🔄 Loading FRESH profile data from API...");
      const data = await getUserProfile();
      console.log("📊 API response:", data);

      let userProfile = data?.data || data;

      if (userProfile) {
        console.log("✅ User profile received:", userProfile);

        //   Remove mixed format
        let cleanPrompts = {};

        if (userProfile.prompts && typeof userProfile.prompts === "object") {
          console.log("🔍 Cleaning prompts:", userProfile.prompts);

          for (const [key, value] of Object.entries(userProfile.prompts)) {
            // Skip 'question-key' wrapper
            if (key !== "question-key") {
              cleanPrompts[key] = value;
            }
          }

          console.log("✅ Cleaned prompts:", cleanPrompts);
        }

        // Parse ways_i_spend_time
        let parsedWaysISpendTime = {};
        if (userProfile.ways_i_spend_time) {
          if (typeof userProfile.ways_i_spend_time === 'string') {
            try {
              parsedWaysISpendTime = JSON.parse(userProfile.ways_i_spend_time);
            } catch (error) {
              console.error("Error parsing ways_i_spend_time:", error);
              parsedWaysISpendTime = {};
            }
          } else if (typeof userProfile.ways_i_spend_time === 'object') {
            parsedWaysISpendTime = userProfile.ways_i_spend_time;
          }
        }

        // Create clean profile
        const completeProfile = {
          // Personal Information
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          full_name: userProfile.full_name || "",
          username: userProfile.username || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          gender: userProfile.gender || "",
          marital_status: userProfile.marital_status || "",
          city: userProfile.city || "",
          country: userProfile.country || "",
          state: userProfile.state || "",
          pincode: userProfile.pincode || "",
          address: userProfile.address || "",
          dob: userProfile.dob || "",
          age: userProfile.age || "",
          height: userProfile.height || "",
          professional_identity: userProfile.professional_identity || "",
          zodiac_sign: userProfile.zodiac_sign || "",
          languages_spoken: Array.isArray(userProfile.languages_spoken)
            ? userProfile.languages_spoken
            : userProfile.languages_spoken || [],
          profession: userProfile.profession || "",
          company: userProfile.company || "",
          position: userProfile.position || "",
          company_type: userProfile.company_type || "",
          experience: userProfile.experience || "",
          education: userProfile.education || "",
          headline: userProfile.headline || "",
          education_institution_name: userProfile.education_institution_name || "",

          //  CLEAN PROMPTS
          prompts: cleanPrompts,

          work_environment: userProfile.work_environment || "",
          interaction_style: userProfile.interaction_style || "",
          work_rhythm: userProfile.work_rhythm || "",
          career_decision_style: userProfile.career_decision_style || "",
          work_demand_response: userProfile.work_demand_response || "",
          about_me: userProfile.about_me || "",
          skills: Array.isArray(userProfile.skills)
            ? userProfile.skills
            : userProfile.skills || [],
          hobbies: Array.isArray(userProfile.hobbies)
            ? userProfile.hobbies
            : userProfile.hobbies || [],
          interests: Array.isArray(userProfile.interests)
            ? userProfile.interests
            : userProfile.interests || [],
          self_expression: userProfile.self_expression || "",
          freetime_style: userProfile.freetime_style || "",
          health_activity_level: userProfile.health_activity_level || "",
          pets_preference: userProfile.pets_preference || "",
          religious_belief: userProfile.religious_belief || "",
          smoking: userProfile.smoking || "",
          drinking: userProfile.drinking || "",
          interested_in: userProfile.interested_in || "",
          relationship_goal: userProfile.relationship_goal || "",
          children_preference: userProfile.children_preference || "",

          love_language_affection: userProfile.love_language_affection || "",

          preference_of_closeness: userProfile.preference_of_closeness || "",
          approach_to_physical_closeness: userProfile.approach_to_physical_closeness || "",
          relationship_values: userProfile.relationship_values || "",
          values_in_others: userProfile.values_in_others || "",
          relationship_pace: userProfile.relationship_pace || "",
          life_rhythms: userProfile.life_rhythms || {},
          ways_i_spend_time: parsedWaysISpendTime,
          id: userProfile.id || null,
          user_id: userProfile.user_id || null,
          is_submitted: userProfile.is_submitted || false,
          profile_picture_url: userProfile.profile_picture_url || "",
          profilePhoto: userProfile.profilePhoto || "",
          image_url: userProfile.image_url || "",
          intent_tags: userProfile.intent_tags || null,
          latitude: userProfile.latitude || null,
          longitude: userProfile.longitude || null,
          last_updated: new Date().toISOString(),
        };

        console.log("✅ Setting clean profile:", completeProfile);
        setProfile(completeProfile);
        // Keep non-sensitive UI cache in localStorage
        localStorage.setItem("user_id", completeProfile.user_id);
        localStorage.setItem("userProfile", JSON.stringify(completeProfile));
      } else {
        console.warn("⚠️ No user profile data");
        loadCachedProfile();
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      loadCachedProfile();
    } finally {
      setLoading(false);
    }
  };

  const loadCachedProfile = () => {
    const cachedUser = localStorage.getItem("userProfile");
    if (cachedUser) {
      try {
        const cachedProfile = JSON.parse(cachedUser);
        console.log("📂 Using cached profile data");
        setProfile(cachedProfile);
        localStorage.setItem("user_id", cachedProfile.user_id);
      } catch (parseError) {
        console.error("❌ Error parsing cached data:", parseError);
        localStorage.removeItem("userProfile");
        setProfile(null);
      }
    } else {
      console.log("📭 No cached data available");
      setProfile(null);
    }
  };

  // On mount: check if user is authenticated via cookie-based auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔐 Checking authentication via /api/auth/check...");
        const res = await api.get("/api/auth/check");
        if (res.data?.authenticated) {
          console.log("✅ User is authenticated");
          setIsAuthenticated(true);
          // Load full profile and plan
          await loadProfile();
          await fetchPlanStatus();
        } else {
          console.log("⚠️ User is not authenticated");
          setIsAuthenticated(false);
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        // 401 means not authenticated — this is expected for logged-out users
        console.log("⏸️ Not authenticated (no valid cookie)");
        setIsAuthenticated(false);
        setProfile(null);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const updateProfile = (newProfileData) => {
    console.log("🔄 Updating profile with:", newProfileData);

    const updatedProfile = {
      ...profile,
      ...newProfileData,
      last_updated: new Date().toISOString(),
    };

    console.log("✅ Final updated profile:", updatedProfile);
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [lastSeenMap, setLastSeenMap] = useState({});

  // Fetch all notifications from API
  const fetchNotifications = async () => {
    if (!profile?.user_id) return;
    setNotificationsLoading(true);
    try {
      const res = await chatApi.getUserNotifications(profile.user_id);
      const data = res.data || [];
      const mappedData = data.map((n) => ({
        ...n,
        is_reaction: n.type === "reaction",
      }));
      setNotifications(mappedData);
      const unread = mappedData.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Mark single notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await chatApi.markChatAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    if (!profile?.user_id) return;
    try {
      await chatApi.markAllNotificationsAsRead(profile.user_id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
    }
  };

  // Setup single global websocket connection
  useEffect(() => {
    if (!profile?.user_id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    console.log("🔌 Initializing global socket for user:", profile.user_id);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
    const newSocket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("🔌 Global Socket connected. Registering user:", profile.user_id);
      newSocket.emit("register_user", profile.user_id);
    });

    newSocket.on("new_notification", (notif) => {
      console.log("🔔 Global socket received notification:", notif);
      const mappedNotif = {
        ...notif,
        is_reaction: notif.type === "reaction",
      };
      setNotifications((prev) => [mappedNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Online presence tracking
    newSocket.on("online_users_list", (userIds) => {
      setOnlineUsers(new Set(userIds.map(String)));
    });

    newSocket.on("user_status_change", ({ userId, isOnline, lastSeen }) => {
      const uId = String(userId);
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(uId);
        } else {
          next.delete(uId);
        }
        return next;
      });

      if (!isOnline && lastSeen) {
        setLastSeenMap((prev) => ({
          ...prev,
          [uId]: lastSeen,
        }));
      }
    });

    setSocket(newSocket);

    // Fetch initial notifications once when the user opens the app or logs in
    fetchNotifications();

    return () => {
      console.log("🔌 Disconnecting global socket for user:", profile.user_id);
      newSocket.disconnect();
    };
  }, [profile?.user_id]);

  // Logout — calls API to clear cookies then clears local state
  const logout = async () => {
    console.log("🚪 Logging out...");
    try {
      await api.post("/api/logout");
    } catch (err) {
      console.error("Logout API call failed (continuing anyway):", err);
    }
    clearProfile();
  };

  const clearProfile = () => {
    console.log("🚪 Clearing ALL user data");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setNotifications([]);
    setUnreadCount(0);
    setProfile(null);
    setIsAuthenticated(false);
    setActivePlan({ active: false, days_left: 0, plan_name: "Free Plan" });
    setPlanLoading(false);
    // Clear non-sensitive UI cache
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user_id");
  };

  const refreshProfile = async () => {
    console.log("🔄 Manually refreshing profile");
    setLoading(true);
    setIsAuthenticated(true);
    await loadProfile();
    await fetchPlanStatus();
  };

  const hasCompleteProfile = () => {
    return (
      profile &&
      profile.is_submitted &&
      (profile.first_name || profile.full_name) &&
      profile.email
    );
  };

  const isFeatureAllowed = (featureKey) => {
    if (planLoading) return true; // prevent flashing while loading plan
    if (!activePlan || !activePlan.active) {
      // By default, if they have no active plan, we can allow a default set of features
      const defaultFreeFeatures = {
        edit_profile: true,
        basic_search: true,
        dashboard: true,
      };
      return !!defaultFreeFeatures[featureKey];
    }
    
    // Check allowed_features
    let features = activePlan.allowed_features;
    if (typeof features === "string") {
      try {
        features = JSON.parse(features);
      } catch (e) {}
    }

    if (features) {
      if (Array.isArray(features)) {
        return features.includes(featureKey);
      }
      if (typeof features === "object") {
        if (features[featureKey] !== undefined) {
          return !!features[featureKey];
        }
        // Aliases mapping for common feature names / modal keys
        const aliases = {
          messaging: "message",
          messages: "message",
          search: "advance_search",
          basic: "basic_search",
          advance: "advance_search",
          suggestions: "ai_suggestion",
          matches: "my_matches",
          members: "browse_members",
          profiles: "profile",
        };
        const mappedKey = aliases[featureKey];
        if (mappedKey && features[mappedKey] !== undefined) {
          return !!features[mappedKey];
        }
      }
    }
    
    // Legacy support: if allowed_features is not defined on the plan, allow all features by default
    return true;
  };

  const isUserOnline = (userId) => onlineUsers.has(String(userId));
  const getLastSeen = (userId) => lastSeenMap[String(userId)] || null;

  const value = {
    // Auth state (replaces AuthProvider)
    isAuthenticated,
    loading,
    logout,
    // Profile state
    profile,
    updateProfile,
    clearProfile,
    refreshProfile,
    hasCompleteProfile: hasCompleteProfile(),
    // Plan state
    activePlan,
    planLoading,
    refreshPlanStatus: fetchPlanStatus,
    isFeatureAllowed,
    // Notifications
    notifications,
    unreadCount,
    notificationsLoading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    // Socket & presence
    socket,
    onlineUsers,
    isUserOnline,
    lastSeenMap,
    getLastSeen,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
