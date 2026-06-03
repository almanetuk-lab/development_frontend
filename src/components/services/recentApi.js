// import api from "./axiosConfig"; 
import api from "./axiosConfig";


const viewApi = {
  // ===============================
  //  TRACK PROFILE VIEW
  // ===============================
  trackProfileView: async (viewedId) => {
    try {
      const response = await api.post(`/api/view/viewers/${viewedId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error tracking profile view:", error);
      throw error;
    }
  },

  // ===============================
  // GET RECENT VIEWERS
  // ===============================
  getRecentViewers: async (userId) => {
    try {
      const response = await api.get(
        `/api/view/${userId}/recentViewers`
      );

      return {
        newViewersCount: response.data?.newViewersCount || 0,
        newViewers: response.data?.newViewers || [],
      };
    } catch (error) {
      console.error("❌ Error fetching recent viewers:", error);
      return {
        newViewersCount: 0,
        newViewers: [],
      };
    }
  },

  // ===============================
  //  GET USER PROFILE
  // ===============================
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      return {};
    }
  },

  // ===============================
  // DASHBOARD SUMMARY
  // ===============================
  getDashboardSummary: async (userId) => {
    try {
      const [viewersData, profileData] = await Promise.all([
        recentApi.getRecentViewers(userId),
        recentApi.getUserProfile(userId),
      ]);

      const today = new Date().toDateString();

      const todaysViewers =
        viewersData.newViewers?.filter((viewer) => {
          const date =
            viewer.viewed_at || viewer.created_at;
          if (!date) return false;
          return new Date(date).toDateString() === today;
        }) || [];

      return {
        profile_views:
          viewersData.newViewersCount ||
          viewersData.newViewers.length,

        recent_viewers: viewersData.newViewers,
        today_viewers: todaysViewers.length,
        user_profile: profileData,

        // temp/static
        matches_count: 24,
        connections_count: 56,
        messages_count: 12,
      };
    } catch (error) {
      console.error("❌ Dashboard summary error:", error);
      return {
        profile_views: 0,
        recent_viewers: [],
        today_viewers: 0,
        user_profile: {},
      };
    }
  },
};

export default viewApi;
