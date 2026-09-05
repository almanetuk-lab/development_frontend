// ProtectedRoute.jsx — API-based admin auth check using cookie
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthed, setIsAuthed] = useState(null); // null = loading

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';
        // Hit any admin-protected endpoint to verify the cookie is valid
        // Using admin/users as a lightweight check (the verifyAdminToken middleware will validate)
        await axios.get(`${API_BASE_URL}/api/admin/audit-logs?page=1&limit=1`, {
          withCredentials: true,
        });
        setIsAuthed(true);
      } catch {
        setIsAuthed(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAuthed === null) {
    return <div className="flex items-center justify-center h-screen text-slate-500">Loading...</div>;
  }

  if (!isAuthed) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
