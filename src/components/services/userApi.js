// src/services/userApi.js
import axios from "axios";
import { installSuspensionHandler } from "./suspension";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";


const userApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Send httpOnly cookies with every request
});

// Ends the session and shows the suspension popup on 403 ACCOUNT_SUSPENDED
installSuspensionHandler(userApi);

// No request interceptor needed — cookies are sent automatically

// 🔐 USER 401 HANDLING
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

//  USER APIs
export const userAPI = {
  // 🔐 PLAN STATUS
  getPlanStatus: () => userApi.get("/api/me/plan-status"),

  // 💬 CHAT (if needed later)
  getMessages: (userId) =>
    userApi.get(`/api/messages/${userId}`),
};

export default userApi;
