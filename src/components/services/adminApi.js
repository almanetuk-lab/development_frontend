// src/services/adminApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Send httpOnly cookies with every request
});

// No request interceptor needed — cookies are sent automatically

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      // Auto redirect if token expired
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

// Admin APIs
export const adminAPI = {
  // Login 
  // login: (credentials) => api.post('/api/admin/login', credentials),

  // Get All Users 
  getUsers: () => api.get('/api/admin/users'),

    // Get User Details by ID -
  getUserDetails: (userId) => api.get(`/api/admin/getdetails/${userId}`),
  
  // Approve User - POST /api/admin/approvedUser
  approveUser: (userId, adminId) => 
    api.post('/api/admin/approveUser', { 
      id: userId, 
      approved_by: adminId 
    }),
  
  // On-Hold User - POST /api/admin/on-hold
  onHoldUser: (userId, reason) => 
    api.post('/api/admin/on-hold', { 
      user_id: userId, 
      reason: reason 
    }),
  
  // Deactivate User - POST /api/admin/deactivate
  deactivateUser: (userId, reason) => 
    api.post('/api/admin/deactivate', { 
      user_id: userId, 
      reason: reason 
    }),

      // SEARCH PROFILES - Add this line only
  searchProfiles: (searchParams) => api.get('/search', { params: searchParams }),

   // NOTIFICATION APIS ADDED
  getUserNotifications: (userId) => 
    api.get(`/api/notifications/${userId}`),
  
  markNotificationAsRead: (notificationId) => 
    api.put(`/api/notifications/read/${notificationId}`),


  getMemberApproval: () =>
  api.get('/api/settings/get-member-approval'),

//  UPDATE MEMBER APPROVAL SETTING
updateMemberApproval: (data) =>
  api.put('/api/settings/update-member-approval', data),

  // Get Audit Logs
  getAuditLogs: (params) => api.get('/api/admin/audit-logs', { params }),

  // Get Contact Us form submissions
  getContactMessages: () => api.get('/api/admin/contact-messages'),

  // Get Newsletter subscriptions list
  getNewsletterSubscriptions: () => api.get('/api/admin/newsletter-subscriptions'),

  // Delete Contact message submission
  deleteContactMessage: (id) => api.delete(`/api/admin/contact-messages/${id}`),

  // Delete Newsletter subscription entry
  deleteNewsletterSubscription: (id) => api.delete(`/api/admin/newsletter-subscriptions/${id}`),
};

export default api;