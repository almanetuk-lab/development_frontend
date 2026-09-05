import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";

console.log("api_url:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Send httpOnly cookies with every request
});

// Response interceptor for automatic token refresh (no request interceptor needed — cookies are automatic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;

    // If 401 and haven't retried yet, attempt to refresh the cookie-based token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log("🔄 Token expired, trying to refresh...");
      
      try {
        // Call refresh endpoint — cookies are sent automatically
        await axios.post(
          `${API_BASE_URL}/api/refreshtoken`,
          {},
          { withCredentials: true }
        );

        console.log("✅ Token refreshed via cookie");
        
        // Retry original request (new cookie is already set by the server)
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError.response?.data || refreshError.message);
        
        // Redirect to login
        window.location.href = '/#/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Normalize response — no longer extracts tokens
export const normalizeAuthResponse = (data = {}) => {
  const user = data?.user_profile || data?.user || data?.profile_info || null;
  return { user };
};

// Login API
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/api/login", { email, password });
    const data = res.data;
    // Cookies are set automatically by the server response
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Newsletter Subscription API
export const subscribeNewsletter = async (email) => {
  try {
    const res = await api.post("/api/newsletter/subscribe", { email });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Register API  
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/api/register", formData);
    const data = res.data;
    // Cookies are set automatically by the server response
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Google Sign-In / Sign-Up API (used by both Login and Register pages)
// `code` is the one-time authorization code from the OAuth popup (auth-code flow)
export const googleAuth = async (code) => {
  try {
    const res = await api.post("/api/auth/google", { code });
    const data = res.data;
    // Cookies are set automatically by the server response
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Update Profile API - SAME (Already correct)
export const updateUserProfile = async (profileData) => {
  try {
    const res = await api.put("/api/editProfile", profileData);
    return res.data.profile;  //  Already returns {..., prompts: {...}}
  } catch (err) {
    console.error("Update Profile Error:", err.response?.data || err.message);
    throw err;
  }
};

// Update user location in DB (via Express backend)
export const updateUserLocation = async (latitude, longitude) => {
  try {
    const res = await api.put("/api/profiles/location", { latitude, longitude });
    return res.data;
  } catch (err) {
    console.error("Update Location Error:", err.response?.data || err.message);
    throw err;
  }
};

// Fetch nearby profiles (via Express backend)
export const getNearbyProfiles = async (latitude, longitude, radiusInKm = 50) => {
  try {
    const res = await api.get("/api/profiles/nearby", {
      params: { latitude, longitude, radiusInKm }
    });
    return res.data.data;
  } catch (err) {
    console.error("Get Nearby Profiles Error:", err.response?.data || err.message);
    throw err;
  }
};



// Get User Profile API - FIXED
export const getUserProfile = async () => {
  try {
    const res = await api.get("/api/me");
    
    //  FIX: Combine data and prompts like UPDATE API format
    const normalizedProfile = {
      ...res.data.data,          // All profile fields
      prompts: res.data.prompts  // Add prompts inside
    };
    
    console.log("🔄 Normalized Profile:", normalizedProfile);
    return normalizedProfile;  // Now matches UPDATE API format
  } catch (err) {
    console.error("GET Profile API Error:", err);
    throw err;
  }
};

//  Image Upload API HAI
export const uploadImage = (formData) => {
  return api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Save Profile Image API
export const saveProfileImage = (user_id, imageUrl) => {
  return api.post('/api/saveProfileImage', {
    user_id,
    imageUrl,
  });
};

//  NEW: Remove Profile Image API
export const removeProfileImage = (user_id) => {
  return api.post('/api/remove/profile-picture', {
    user_id,
  });
};

// Refresh Token API — simplified for cookie-based auth
export const refreshAuthToken = async () => {
  try {
    console.log("🔄 Attempting token refresh...");
    
    await axios.post(
      `${API_BASE_URL}/api/refreshtoken`,
      {},
      { withCredentials: true }
    );

    return { success: true };
  } catch (error) {
    console.error("❌ Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
};

// Admin APIs
export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login', credentials),
};

// AI Agent Config APIs
export const getAiAgentConfig = async () => {
  const res = await api.get("/api/ai-agent/config");
  return res.data.data ?? res.data;
};

export const updateAiAgentConfig = async ({ enabled, instructions }) => {
  const res = await api.put("/api/ai-agent/config", { enabled, instructions });
  return res.data.data ?? res.data;
};

export default api;
