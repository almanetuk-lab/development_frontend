import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Logo from "../comman/Logo";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        `/api/reset-password/${token}`,
        { password }
      );

      setMessage(response.data.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Reset link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 sm:py-12 md:py-16 relative overflow-hidden">
      {/* Flat solid geometric stripes (pink and blue) running in the background */}
      <div className="absolute top-0 left-[-15%] sm:left-[-10%] w-[55%] sm:w-[30%] h-full bg-[#E3F2FD] transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100"></div>
      <div className="absolute top-0 right-[-15%] sm:right-[-10%] w-[55%] sm:w-[30%] h-full bg-pink-100/50 transform -skew-x-12 z-0 pointer-events-none opacity-60 sm:opacity-100"></div>

      <div className="w-full max-w-md bg-white border border-slate-100/80 shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 relative z-10 animate-fade-in">
        
        <div className="text-center mb-6 sm:mb-8">
          <Logo size="text-2xl sm:text-3xl" className="justify-center" />
          <p className="text-xs sm:text-sm text-slate-500 mt-2">Set a new password</p>
        </div>

        {message && (
          <div className="bg-[#E3F2FD] border border-blue-100 text-slate-700 px-4 py-2.5 sm:py-3 rounded-xl mb-5 sm:mb-6 text-xs sm:text-sm text-center font-medium animate-pulse">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] outline-none transition bg-white text-slate-800 placeholder-slate-400 text-sm shadow-inner"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 mt-2 font-bold text-white bg-[#FF2A6D] hover:bg-[#e0105a] rounded-xl hover:shadow-lg transition-all duration-200 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center pt-3 sm:pt-4 border-t border-slate-100">
          <Link
            to="/login"
            className="font-bold text-[#FF2A6D] hover:text-[#e0105a] transition text-xs sm:text-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}