// Deprecated AuthProvider — Consolidated into UseProfileContext.jsx
// Use useUserProfile() from UseProfileContext.jsx for authentication & profile management.
import React from "react";
import { useUserProfile } from "./UseProfileContext";

export const AuthProvider = ({ children }) => {
  return <>{children}</>;
};

export const useAuth = () => {
  const profileContext = useUserProfile();
  return {
    user: profileContext.profile,
    isAuthenticated: profileContext.isAuthenticated,
    loading: profileContext.loading,
    logout: profileContext.logout,
  };
};

export default AuthProvider;
