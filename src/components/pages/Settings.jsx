
// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import ProfileSettings from "../components/settings/ProfileSettings";
// import AccountSettings from "../components/settings/AccountSettings";
// import NotificationSettings from "../components/settings/NotificationSettings";
// import PrivacySettings from "../components/settings/PrivacySettings";
// import SubscriptionSettings from "../components/settings/SubscriptionSettings";
// import PreferencesSettings from "../components/settings/PreferencesSettings";
// import api from "../services/api";
// import SubscriptionSettings from "../setting/SubscriptionSettings";
import SubscriptionSettings from "../settings/SubscriptionSettings";
import PrivacySettings from "../settings/PrivacySettings";
import ChangePasswordSettings from "../settings/ChangePasswordSettings";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subscription"); // set default tab to subscription or privacy
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data
//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/api/user/profile");
//       setUserData(response.data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const tabs = [
    { id: "privacy", label: "Privacy & Data", icon: <i className="fa-solid fa-shield-halved"></i>, component: PrivacySettings },
    { id: "subscription", label: "Subscription", icon: <i className="fa-solid fa-credit-card"></i>, component: SubscriptionSettings },
    { id: "password", label: "Security & Password", icon: <i className="fa-solid fa-key"></i>, component: ChangePasswordSettings },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 border border-slate-250 hover:bg-slate-100 rounded-xl text-xs uppercase tracking-wider font-bold text-slate-600 transition"
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">Settings</h1>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar */}
            <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-200 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "font-semibold"
                        : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    style={
                      activeTab === tab.id
                        ? { backgroundColor: "rgba(0, 32, 96, 0.06)", color: "#002060" }
                        : {}
                    }
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-6">
              {ActiveComponent && (
                <ActiveComponent 
                  userData={userData} 
                  loading={loading}
                //   onUpdate={fetchUserData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}