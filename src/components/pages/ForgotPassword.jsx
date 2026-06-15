/* src/pages/ForgotPassword.jsx */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // backend call (future-ready)
      const response = await api.post("/api/forgotpassword", { email });
      setMessage(response.data.message);
      
      // temporary simulation
      console.log(`Simulated reset link sent to ${email}`);
      setMessage(
        "Password reset link sent (simulated). Check your email!"
      );
    } catch (err) {
      console.error(err);
      setMessage("Failed to send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-blue-100 animate-fade-in">
        {/* Header with Intentional Connections - HOME PAGE STYLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold">
            <span className="text-blue-700">Intentional</span>
            <span className="text-pink-500"> Connections</span>
          </h1>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        {message && (
          <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md mb-4 text-sm text-center">
            {message}
          </div>
        )}

        {/* Form with BLUE theme */}
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
              placeholder="Enter your registered email"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            />
          </div>

          {/* BLUE BUTTON like home page */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 font-bold text-white rounded-lg shadow-md transition duration-200 ${
              loading 
                ? "bg-blue-600 cursor-not-allowed opacity-90" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Sending Email..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login section with blue text */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}











