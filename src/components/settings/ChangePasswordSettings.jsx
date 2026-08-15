import React, { useState } from "react";

export default function ChangePasswordSettings() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" }); // Reset message on typing
  };

  const toggleShow = (field) => {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";

      const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password.");
      }

      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-key text-indigo-600"></i>
          Security & Password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Update your account password regularly to keep your personal data and digital twin secure.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-250"
              : "bg-rose-50 text-rose-700 border-rose-250"
          }`}
        >
          {message.type === "success" ? (
            <i className="fa-solid fa-circle-check text-emerald-500 text-lg"></i>
          ) : (
            <i className="fa-solid fa-circle-exclamation text-rose-500 text-lg"></i>
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPass.current ? "text" : "password"}
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150 pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <i className={`fa-solid ${showPass.current ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPass.new ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150 pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <i className={`fa-solid ${showPass.new ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Must be at least 6 characters long.
          </p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPass.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition duration-150 pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              <i className={`fa-solid ${showPass.confirm ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-bold rounded-xl shadow-md transition duration-200 hover:opacity-95 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            style={{ backgroundColor: "#002060" }}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Password...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock"></i>
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
