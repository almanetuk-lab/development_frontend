import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";
import { FaLinkedin } from "react-icons/fa";
//import LinkedInLoginButton from "../social/LinkedInLoginButton";
import LinkedInLoginButton from "../social/LinkedInLoginButton";
export default function Login() {
  const navigate = useNavigate();
  const { updateProfile, refreshProfile } = useUserProfile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token, refresh, user } = await loginUser({ email, password });

      if (!token) throw new Error("No token received from server");

      // Save tokens & user info
      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);

      //  FIXED: Save user data to localStorage for chat module
      if (user) {
        console.log(" Login successful, updating profile context");
        updateProfile(user);

        //  YEH LINE ADD KI HAI - Chat module ke liye
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("💾 User data saved to localStorage for chat:", user);
      }

      // Auto refresh profile data from API
      setTimeout(() => {
        refreshProfile();
      }, 500);

      // alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


const handleLinkedInLogin = async () => {
    setLinkedinLoading(true);
    try {
        console.log('🔗 Getting LinkedIn auth URL...');
        
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
        const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
        
        console.log('📞 Calling backend for LinkedIn URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend LinkedIn response:', data);
        
        //  IMPORTANT: Backend { url: '...' } 
        if (data.url) {
            console.log('🚀 Redirecting to LinkedIn login...');
            window.location.href = data.url;
        } else {
            throw new Error('No LinkedIn URL received from backend');
        }
        
    } catch (error) {
        console.error('❌ LinkedIn login error:', error);
        alert(`Login failed: ${error.message}. Please try again.`);
    } finally {
        setLinkedinLoading(false);
    }
};

//  Agar user already logged in hai to directly dashboard redirect karo
  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("🔄 User already logged in, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-blue-100 animate-fade-in">
        {/* UI CHANGE: Header with Intentional Connections - HOME PAGE STYLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">
            <span className="text-grey-400">Intentional</span>
            <span className="text-pink-500"> Connections</span>
          </h1>
          <p className="text-gray-600 mt-2">Login to continue your journey</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* UI CHANGE: Form layout with BLUE theme */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="mr-2 h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* UI CHANGE: BLUE BUTTON like home page */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 font-bold text-white rounded-lg shadow-md transition duration-200 ${
              loading
                ? "bg-blue-600 cursor-not-allowed opacity-90"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Logging in..." : "Login to Your Account"}
          </button>
        </form>
        <div className="text-center">
      
          <button
            onClick={handleLinkedInLogin}
            disabled={linkedinLoading}
            className="w-120  mx-auto mt-5 py-3 px-4 bg-blue-600 hover:bg-[#00669C] text-white rounded-lg shadow-sm hover:shadow-md transition duration-200 flex items-center justify-center gap-3 font-medium"
          >
            {linkedinLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting to LinkedIn...</span>
              </>
            ) : (
              <>
                <FaLinkedin className="text-2xl" />
                <span>Continue with LinkedIn</span>
              </>
            )}
          </button>

          <p className="text-gray-500 text-xs mt-3">
            Secure login via LinkedIn. We'll never post without permission.
          </p>
        </div>
            {/* <LinkedInLoginButton/> */}

        {/* UI CHANGE: Create account section with blue text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

//  Alag Logout Component for Header/Other pages
export function LogoutButton() {
  const { clearProfile } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🚪 Logging out...");

    // Clear authentication only, keep profile data
    clearProfile();

    //  FIXED: Also remove chat user data from localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("cart"); //ik add to cart remove to localstorage
    alert("Logged out successfully!");
    navigate("/login");

    // Optional: Page refresh for clean state
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
