import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Environment variable se
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/login`, 
        formData
      );
      
      if (response.data.status === "success") {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        navigate('/admin-dashboard');
      } else {
        setError(response.data.message || 'Login failed!');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      // Clear all admin related data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      sessionStorage.removeItem('adminSession');
      
      // Clear any other related storage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('admin')) {
          localStorage.removeItem(key);
        }
      });
      
      // Force redirect to home page
      window.location.href = '/#/';
      
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/#/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md border border-blue-100">
        
        {/* Header - HOME PAGE STYLE */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <span className="text-2xl text-blue-600">🔐</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">
            <span className="text-blue-700">Intentional</span>
            <span className="text-pink-500"> Connections</span>
          </h1>
          <p className="text-gray-600 text-sm mt-2">Admin Panel Login</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* BLUE BUTTON like home page */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold shadow-md hover:shadow-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              'Sign In as Admin'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span className="text-blue-500">🔒</span>
            <p>Secure Admin Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


















