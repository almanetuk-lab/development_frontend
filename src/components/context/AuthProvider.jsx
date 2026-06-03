import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const [loading, setLoading] = useState(true);

  // Set default headers for Axios instance (ensure token is attached to initial requests)
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);


  // page reload par user fetch
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken && !user) { // Only fetch if accessToken exists but user is not yet set
        try {
          console.log("🔄 AuthProvider: Fetching user on page load with token.");
          const res = await api.get("/api/me");
          
          const userData = res.data.data || res.data.user || res.data; // Flexible data extraction
          console.log("✅ AuthContext User Data fetched:", userData);
          
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (err) {
          console.error("❌ AuthProvider: Failed to fetch user on load, logging out.", err);
          logout(); // invalid token
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [accessToken, user]); // Depend on accessToken and user state

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/api/login", { email, password });
      const { accessToken, refreshToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user); // Set user from login response

      setLoading(false);
      return true;
    } catch (err) {
      console.error("❌ Login failed:", err);
      // logout(); 
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    console.log("🗑️ AuthProvider: Logging out.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    // Clear Axios default header
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user && !!accessToken, // Check both user and token
        loading,
        login,
        logout,
      }}
    >
      {/* Render children only when not loading to avoid flickering */}
      {loading ? <div className="text-center align-top text-2xl">Please Wait For Loading....</div> : children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};





















































































