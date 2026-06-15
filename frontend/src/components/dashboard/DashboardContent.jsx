
// // src/components/dashboard/DashboardHome.jsx
// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import StatCard from "../comman/StatCard";
// import MatchCard from "../comman/MatchCard";
// import ActivityItem from "../comman/ActivityItem";
// import QuickAction from "../comman/QuickAction";

// export default function DashboardHome({ profile }) {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");

//   // Memoized matches data
//   const randomMatches = useMemo(() => [
//     { 
//       id: 1, 
//       name: "Priya Sharma", 
//       profession: "Software Engineer", 
//       city: "Mumbai",
//       age: 28,
//       online: true
//     },
//     { 
//       id: 2, 
//       name: "Rahul Kumar", 
//       profession: "UI/UX Designer", 
//       city: "Delhi",
//       age: 26,
//       online: false
//     },
//     { 
//       id: 3, 
//       name: "Anjali Singh", 
//       profession: "Marketing Manager", 
//       city: "Bangalore",
//       age: 30,
//       online: true
//     }
//   ], []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header - Single responsive version */}
//         <header className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 p-6">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             {/* Welcome Text */}
//             <div className="flex-1 min-w-0">
//               <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
//                 Welcome back,{" "}
//                 <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   {profile?.full_name?.split(' ')[0] || profile?.name?.split(' ')[0] || 'User'}!
//                 </span>
//               </h1>
//               <p className="text-gray-600 text-sm md:text-base lg:text-lg">
//                 Ready to find your perfect match? Start exploring now!
//               </p>
//             </div>
            
//             {/* Search Bar */}
//             <div className="w-full lg:w-96 flex-shrink-0">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search users by name, profession, or city..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-4 py-3 pl-12 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300 text-sm bg-gray-50 hover:bg-white"
//                 />
//                 <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
//                 {searchQuery && (
//                   <button 
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-lg"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//           {/* Left Column - Main Content */}
//           <div className="xl:col-span-2 space-y-6">
//             {/* Profile Card */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-2xl">
//               {/* Profile Header */}
//               <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Your Profile</h2>
//                 <div className="flex gap-2">
//                   <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-semibold border border-green-200">
//                     Active
//                   </span>
//                   <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold border border-blue-200">
//                     Verified
//                   </span>
//                 </div>
//               </div>
              
//               {/* Profile Content */}
//               <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
//                 {/* Profile Picture */}
//                 <div className="flex-shrink-0">
//                   {profile?.profile_picture_url || profile?.profilePhoto || profile?.profile_picture ? (
//                     <img
//                       src={profile.profile_picture_url || profile.profilePhoto || profile.profile_picture}
//                       alt="Profile"
//                       className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
//                       loading="lazy"
//                     />
//                   ) : (
//                     <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl">
//                       {profile?.full_name?.charAt(0) || profile?.name?.charAt(0) || 'U'}
//                     </div>
//                   )}
//                 </div>

//                 {/* Profile Info */}
//                 <div className="flex-1 w-full min-w-0 text-center sm:text-left">
//                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
//                     <div className="flex-1 min-w-0">
//                       <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//                         {profile?.full_name || profile?.name || "imran"}
//                       </h1>
//                       <p className="text-gray-600 text-lg mb-2">
//                         {profile?.profession || profile?.occupation || profile?.headline || "Software Engineer"}
//                       </p>
//                       <p className="text-gray-500 text-base flex items-center justify-center sm:justify-start gap-1">
//                         📍 {profile?.city || profile?.location || "INDORE"} • 
//                         {profile?.age ? ` ${profile.age} years` : " 24 years"}
//                       </p>
//                     </div>
                    
//                     <div className="flex gap-3 justify-center sm:justify-start">
//                       <button
//                         onClick={() => navigate("/dashboard/profile")}
//                         className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
//                       >
//                         <span>👁️</span>
//                         <span>View Profile</span>
//                       </button>
//                       <button
//                         onClick={() => navigate("/dashboard/edit-profile")}
//                         className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
//                       >
//                         <span>✏️</span>
//                         <span>Edit Profile</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Stats */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <StatCard label="Profile Views" value="128" trend="+12%" />
//                 <StatCard label="Matches" value="24" trend="+5%" />
//                 <StatCard label="Connections" value="56" trend="+8%" />
//                 <StatCard label="Messages" value="12" trend="+3%" />
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl">
//               <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Recent Activity</h3>
//               <div className="space-y-3">
//                 <ActivityItem 
//                   icon="👀"
//                   text="Your profile was viewed by 5 new people"
//                   time="2 hours ago"
//                 />
//                 <ActivityItem 
//                   icon="💖"
//                   text="You have 3 new matches waiting"
//                   time="5 hours ago"
//                 />
//                 <ActivityItem 
//                   icon="💬"
//                   text="You received 2 new messages"
//                   time="1 day ago"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className="space-y-6">
//             {/* Suggested Matches */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg md:text-xl font-semibold text-gray-800">Suggested Matches</h3>
//                 <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full font-semibold">
//                   3+
//                 </span>
//               </div>
//               <div className="space-y-4">
//                 {randomMatches.map((user) => (
//                   <MatchCard key={user.id} user={user} />
//                 ))}
//               </div>
//               <button 
//                 onClick={() => navigate("/dashboard/matches")}
//                 className="w-full mt-4 px-4 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold text-sm border border-gray-200 hover:border-gray-300"
//               >
//                 View All Matches
//               </button>
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white transition-all duration-300 hover:shadow-2xl">
//               <h3 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h3>
//               <div className="space-y-3">
//                 <QuickAction icon="⚡" label="Boost Profile" />
//                 <QuickAction icon="⭐" label="Go Premium" />
//                 <QuickAction icon="🔔" label="Notifications" />
//                 <QuickAction icon="🛡️" label="Privacy Settings" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


















