
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

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
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
//     { id: "profile", label: "Profile Settings", icon: "👤", component: ProfileSettings },
//     { id: "account", label: "Account", icon: "🔐", component: AccountSettings },
//     { id: "notifications", label: "Notifications", icon: "🔔", component: NotificationSettings },
//     { id: "privacy", label: "Privacy", icon: "🛡️", component: PrivacySettings },
    { id: "subscription", label: "Subscription", icon: "💳", component: SubscriptionSettings },
//     { id: "preferences", label: "Preferences", icon: "⚙️", component: PreferencesSettings },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
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