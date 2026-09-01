
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/api";
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
  const [activePlan, setActivePlan] = useState({ active: false, days_left: 0, plan_name: "Free Plan" });
  const [planLoading, setPlanLoading] = useState(true);

  const fetchPlanStatus = async () => {
    let token = localStorage.getItem("accessToken");
    if (!token) {
      setActivePlan({ active: false, days_left: 0, plan_name: "Free Plan" });
      setPlanLoading(false);
      return;
    }
    try {
      setPlanLoading(true);
      const res = await userAPI.getPlanStatus();
      if (res.data) {
        setActivePlan(res.data);
      }
    } catch (error) {
      console.error("❌ Error fetching plan status in context:", error);
      setActivePlan({ active: false, days_left: 0, plan_name: "Free Plan" });
    } finally {
      setPlanLoading(false);
    }
  };

  const loadProfile = async () => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("🚫 No token found - clearing profile");
      clearProfile();
      setLoading(false);
      return;
    }

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

          // love_language_affection: Array.isArray(userProfile.love_language_affection)
          //   ? userProfile.love_language_affection
          //   : userProfile.love_language_affection || [],

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      loadProfile();
      fetchPlanStatus();
    } else {
      console.log("⏸️ No token - clearing profile data");
      clearProfile();
      setLoading(false);
    }
  }, []);

  const updateProfile = (newProfileData) => {
    console.log("🔄 Updating profile with:", newProfileData);

    const updatedProfile = {
      ...profile,
      ...newProfileData,
      //       life_rhythms: newProfileData.life_rhythms || profile?.life_rhythms || {},
      // ways_i_spend_time: newProfileData.ways_i_spend_time || profile?.ways_i_spend_time || {},
      // last_updated: new Date().toISOString(),
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

    newSocket.on("user_status_change", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(String(userId));
        } else {
          next.delete(String(userId));
        }
        return next;
      });
    });

    setSocket(newSocket);

    // Fetch initial notifications once when the user opens the app or logs in
    fetchNotifications();

    return () => {
      console.log("🔌 Disconnecting global socket for user:", profile.user_id);
      newSocket.disconnect();
    };
  }, [profile?.user_id]);

  const clearProfile = () => {
    console.log("🚪 Clearing ALL user data");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setNotifications([]);
    setUnreadCount(0);
    setProfile(null);
    setActivePlan({ active: false, days_left: 0, plan_name: "Free Plan" });
    setPlanLoading(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user_id");
  };

  const refreshProfile = () => {
    console.log("🔄 Manually refreshing profile");
    setLoading(true);
    loadProfile();
    fetchPlanStatus();
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
    
    // If they have an active plan, check allowed_features
    if (activePlan.allowed_features) {
      if (Array.isArray(activePlan.allowed_features)) {
        return activePlan.allowed_features.includes(featureKey);
      }
      if (typeof activePlan.allowed_features === 'object') {
        return !!activePlan.allowed_features[featureKey];
      }
    }
    
    // Legacy support: if allowed_features is not defined on the plan, allow all features by default
    return true;
  };

  const isUserOnline = (userId) => onlineUsers.has(String(userId));

  const value = {
    profile,
    updateProfile,
    clearProfile,
    refreshProfile,
    loading,
    hasCompleteProfile: hasCompleteProfile(),
    activePlan,
    planLoading,
    refreshPlanStatus: fetchPlanStatus,
    isFeatureAllowed,
    notifications,
    unreadCount,
    notificationsLoading,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    socket,
    onlineUsers,
    isUserOnline,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
// export default UserProfileContext;













