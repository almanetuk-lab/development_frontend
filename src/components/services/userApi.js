// src/services/userApi.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";


const userApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 🔐 USER TOKEN
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // USER token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔐 USER 401 HANDLING
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

//  USER APIs
export const userAPI = {
  // 🔐 PLAN STATUS
  getPlanStatus: () => userApi.get("/api/me/plan-status"),

  // 🔍 SEARCH MEMBERS (USED IN MemberPage)
  searchProfiles: (params) =>
    userApi.get("/search", { params }),

  // 💬 CHAT (if needed later)
  getMessages: (userId) =>
    userApi.get(`/api/messages/${userId}`),
};

export default userApi;
