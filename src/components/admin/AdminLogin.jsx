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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/login`, 
        formData
      );
      
      if (response.data.status === "success") {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        navigate('/admin');
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
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#E3F2FD] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Flat solid skewed geometric background stripes (matching landing/user login) */}
      <div className="absolute top-0 left-[-15%] sm:left-[-10%] w-[55%] sm:w-[30%] h-full bg-[#E3F2FD] transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100"></div>
      <div className="absolute top-0 right-[-15%] sm:right-[-10%] w-[55%] sm:w-[30%] h-full bg-pink-100/40 transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100"></div>
      
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-100 relative z-10 animate-scaleIn">
        
        {/* Header - HOME PAGE STYLE */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#FF2A6D] to-[#002060] rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-base">🛡️</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-center mb-1 tracking-tight text-[#002060]">
            <span>Intentional</span>
            <span className="text-[#FF2A6D]"> Connections</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-2">Admin Portal Login</p>
        </div>
 
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-pulse">
            <span className="text-red-500 text-base">⚠️</span>
            <p className="text-red-700 text-xs font-semibold">{error}</p>
          </div>
        )}
 
        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
          </div>
 
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
          </div>
 
          {/* BRAND NAVY BLUE BUTTON */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002060] hover:bg-[#001740] text-white py-3 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              'Sign In as Admin'
            )}
          </button>
        </form>
 
        {/* Footer */}
        <div className="mt-8 text-center border-t border-slate-100 pt-5">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>🔒</span>
            <p>Secure Admin Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AdminLogin;


















