import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser, googleAuth } from "../services/api";
import { useUserProfile } from "../context/UseProfileContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaLinkedin, FaApple, FaGoogle } from "react-icons/fa";
import Logo from "../comman/Logo";


export default function Register() {
  const navigate = useNavigate();
  const { updateProfile, refreshProfile } = useUserProfile() || {
    updateProfile: () => {},
    refreshProfile: () => {},
  };

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profession: "",
    username: "",
    about_me: "",
    interests: [],
    marital_status: "Single",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true);
    try {
      console.log('🔗 Getting LinkedIn auth URL...');
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';
      const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
      console.log('📞 Calling backend for LinkedIn URL:', apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Backend LinkedIn response:', data);

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

  const handleGoogleSuccess = async (codeResponse) => {
    setError("");
    setGoogleLoading(true);
    try {
      const code = codeResponse?.code;
      if (!code) throw new Error("No authorization code received from Google");

      const { token, refresh, user } = await googleAuth(code);
      if (!token) throw new Error("No token received from server");

      localStorage.setItem("accessToken", token);
      if (refresh) localStorage.setItem("refreshToken", refresh);

      if (user) {
        updateProfile(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
      }

      setTimeout(() => {
        refreshProfile();
      }, 500);

      navigate("/dashboard");
    } catch (err) {
      console.error("Google sign-up error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Google sign-up failed";
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    console.error("Google sign-up error:", errorResponse?.error || errorResponse);
    setError("Google sign-up failed. Please try again.");
    setGoogleLoading(false);
  };

  const handleGoogleNonOAuthError = (nonOAuthError) => {
    if (nonOAuthError?.type !== "popup_closed") {
      setError("Google sign-up failed. Please try again.");
    }
    setGoogleLoading(false);
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    onNonOAuthError: handleGoogleNonOAuthError,
  });

  const handleGoogleClick = () => {
    setError("");
    setGoogleLoading(true);
    googleLogin();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (updateProfile) {
        updateProfile(null);
      }

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        profession: form.profession,
        username: form.username,
        about_me: form.about_me || null,
        interests: form.interests,
        marital_status: form.marital_status,
      };

      await registerUser(payload);
      alert("Registration successful! Please login with your new account.");

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (updateProfile) {
        updateProfile(null);
      }

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 relative overflow-hidden">
      {/* Flat solid geometric stripes (pink and blue) running in the background */}
      <div className="absolute top-0 left-[-15%] sm:left-[-10%] w-[55%] sm:w-[30%] h-full bg-[#E3F2FD] transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100"></div>
      <div className="absolute top-0 right-[-15%] sm:right-[-10%] w-[55%] sm:w-[30%] h-full bg-pink-100/50 transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100"></div>

      <div className="max-w-lg w-full bg-white border border-slate-100/80 shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Logo size="text-2xl sm:text-3xl" className="justify-center" />
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Create your account and start your journey
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 sm:py-3 rounded-xl mb-5 sm:mb-6 text-xs sm:text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Social Authentication */}
        <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
          <button
            type="button"
            onClick={handleLinkedInLogin}
            disabled={linkedinLoading}
            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-[#0077B5] hover:bg-[#00669c] text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {linkedinLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting to LinkedIn...</span>
              </>
            ) : (
              <>
                <FaLinkedin size={18} />
                <span>Register with LinkedIn</span>
              </>
            )}
          </button>

          <Link
            to="/Coming-soon"
            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-neutral-900 hover:bg-black text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm"
          >
            <FaApple size={18} />
            <span>Register with Apple</span>
          </Link>

          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={googleLoading}
            className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:gap-3 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <FaGoogle size={18} className="text-red-500" />
                <span>Register with Google</span>
              </>
            )}
          </button>
        </div>

        {/* OR Divider */}
        <div className="flex items-center mb-5 sm:mb-6">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="mx-3 sm:mx-4 text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Doe"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="john_doe"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
                Profession
              </label>
              <input
                type="text"
                name="profession"
                placeholder="Software Engineer"
                value={form.profession}
                onChange={handleChange}
                required
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
              About Me
            </label>
            <textarea
              name="about_me"
              value={form.about_me}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-3.5 pr-12 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 mt-4 font-bold text-white bg-[#FF2A6D] hover:bg-[#e0105a] rounded-xl hover:shadow-lg transition-all duration-200 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center pt-3 sm:pt-4 border-t border-slate-100">
          <p className="text-slate-500 text-xs sm:text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
              }}
              className="font-bold text-[#FF2A6D] hover:text-[#e0105a] transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
