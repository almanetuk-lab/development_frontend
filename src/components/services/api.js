import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

console.log("api_url:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ONLY REQUEST INTERCEPTOR Token attach karne ke liye hai 
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

// ADDED: RESPONSE INTERCEPTOR for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 error hai aur pehle try nahi kiya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log("🔄 Token expired, trying to refresh...");
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.log("⚠️ No refresh token available");
          // Logout user
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = '/login';
          return Promise.reject(error);
        }

        //  ACTUAL REFRESH TOKEN API CALL
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/refreshtoken`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            }
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        
        if (newAccessToken) {
          // Save new access token
          localStorage.setItem("accessToken", newAccessToken);
          console.log("✅ New access token saved");
          
          // Update original request header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Retry original request
          return api(originalRequest);
        } else {
          throw new Error("No access token received from refresh");
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError.response?.data || refreshError.message);
        
        // Logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Normalize response
export const normalizeAuthResponse = (data = {}) => {
  const token = data?.accessToken || data?.token || data?.access_token || null;
  const refresh = data?.refreshToken || data?.refresh_token || null;
  const user = data?.user_profile || data?.user || data?.profile_info || null;
  
  //  Save refresh token if available
  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
  }
  
  return { token, refresh, user };
};

// Login API
export const loginUser = async ({ email, password }) => {
  try {
    const res = await api.post("/api/login", { email, password });
    const data = res.data;
    
    // Manual token save (Interceptor ki jagah)
    if (data.accessToken || data.token) {
      localStorage.setItem("accessToken", data.accessToken || data.token);
    }
    
    //  Save refresh token
    if (data.refreshToken || data.refresh_token) {
      localStorage.setItem("refreshToken", data.refreshToken || data.refresh_token);
    }
    
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Register API  
export const registerUser = async (formData) => {
  try {
    const res = await api.post("/api/register", formData);
    const data = res.data;
    
    // Manual token save
    if (data.accessToken || data.token) {
      localStorage.setItem("accessToken", data.accessToken || data.token);
    }
    
    // Save refresh token
    if (data.refreshToken || data.refresh_token) {
      localStorage.setItem("refreshToken", data.refreshToken || data.refresh_token);
    }
    
    return normalizeAuthResponse(data);
  } catch (err) {
    throw err;
  }
};

// Update Profile API -  YEHA SE YAHA TAK KA CODE SAME HAI
// export const updateUserProfile = async (profileData) => {
//   try {
//     const res = await api.put("/api/editProfile", profileData);
//     return res.data;
//   } catch (err) {
//     console.error("Update Profile Error:", err.response?.data || err.message);
//     throw err;
//   }
// };


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

// // Get User Profile API
// export const getUserProfile = async () => {
//   try {
//     const res = await api.get("/api/me");
//     return res.data;
//   } catch (err) {
//     throw err;
//   }
// };

//  Image Upload API HAI
export const uploadImage = (formData) => {
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Save Profile Image API
export const saveProfileImage = (user_id, imageUrl) => {
  return api.post('/saveProfileImage', {
    user_id,
    imageUrl,
  });
};

//  NEW: Remove Profile Image API
export const removeProfileImage = (user_id) => {
  return api.post('/remove/profile-picture', {
    user_id,
  });
};

//  UPDATED: Refresh Token API (Now actual API call)
export const refreshAuthToken = async () => {
  try {
    console.log("🔄 Attempting token refresh...");
    
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/refreshtoken`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      }
    );

    const newAccessToken = response.data.accessToken;
    
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      return { 
        token: newAccessToken, 
        refresh: refreshToken,
        success: true 
      };
    }
    
    throw new Error("No access token received from refresh");
  } catch (error) {
    console.error("❌ Token refresh failed:", error.response?.data || error.message);
    throw error;
  }
};

// Admin APIs
export const adminAPI = {
  login: (credentials) => api.post('/api/admin/login', credentials),
};

export default api;












































































































