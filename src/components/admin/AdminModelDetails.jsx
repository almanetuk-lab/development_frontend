import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";

// LifeRhythmsDisplay Component
function LifeRhythmsDisplay({ data }) {
  if (!data || typeof data !== "object") {
    return (
      <div className="text-center py-4 sm:py-8">
        <p className="text-gray-500 italic text-sm sm:text-base">No life rhythms data available</p>
      </div>
    );
  }

  let rhythmsData = data;
  if (typeof data === "string") {
    try {
      rhythmsData = JSON.parse(data);
    } catch (error) {
      console.error("Error parsing life rhythms:", error);
      return (
        <div className="text-center py-4 sm:py-8">
          <p className="text-gray-500 italic text-sm sm:text-base">No life rhythms data available</p>
        </div>
      );
    }
  }

  if (Object.keys(rhythmsData).length === 0) {
    return (
      <div className="text-center py-4 sm:py-8">
        <p className="text-gray-500 italic text-sm sm:text-base">No life rhythms data available</p>
      </div>
    );
  }

  const rhythmSections = {
    work_rhythm: { title: "Work Rhythm", icon: "💼" },
    social_energy: { title: "Social Energy", icon: "👥" },
    life_pace: { title: "Life Pace", icon: "⏱️" },
    emotional_style: { title: "Emotional Style", icon: "💖" },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {Object.entries(rhythmSections).map(([key, section]) => {
        const rhythmData = rhythmsData[key];
        if (!rhythmData) return null;

        return (
          <div
            key={key}
            className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="text-lg sm:text-xl">{section.icon}</span>
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                {section.title}
              </h4>
            </div>

            <div className="ml-7 sm:ml-9">
              {rhythmData.combination ? (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Combination:
                  </p>
                  <p className="text-gray-900 font-medium text-base sm:text-lg mt-1">
                    {rhythmData.combination}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-gray-600 mt-1 sm:mt-2 italic text-sm">
                      "{rhythmData.statement}"
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Style:</p>
                  <p className="text-gray-900 font-medium text-base sm:text-lg mt-1">
                    {rhythmData.single}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-gray-600 mt-1 sm:mt-2 italic text-sm">
                      "{rhythmData.statement}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// InterestsDisplay Component
function InterestsDisplay({ data, type = "simple" }) {
  if (!data) {
    return (
      <div className="text-center py-4 sm:py-8">
        <p className="text-gray-500 italic text-sm sm:text-base">No interests data available</p>
      </div>
    );
  }

  if (typeof data === "string") {
    const interestsArray = data.split(",").map(item => item.trim()).filter(item => item);
    
    if (interestsArray.length === 0) {
      return (
        <div className="text-center py-4 sm:py-8">
          <p className="text-gray-500 italic text-sm sm:text-base">No interests added yet</p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {interestsArray.map((interest, idx) => (
          <span
            key={idx}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-full"
          >
            {interest}
          </span>
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div className="text-center py-4 sm:py-8">
          <p className="text-gray-500 italic text-sm sm:text-base">No interests added yet</p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {data.map((interest, idx) => (
          <span
            key={idx}
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-100 text-gray-800 text-xs sm:text-sm rounded-full"
          >
            {interest}
          </span>
        ))}
      </div>
    );
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    let interestsObj = data;
    if (typeof data === "string") {
      try {
        interestsObj = JSON.parse(data);
      } catch (error) {
        console.error("Error parsing interests:", error);
        return (
          <div className="text-center py-4 sm:py-8">
            <p className="text-gray-500 italic text-sm sm:text-base">Error loading interests</p>
          </div>
        );
      }
    }

    const categoriesConfig = {
      creative_cultural: {
        label: "Creative & Cultural",
        color: "bg-purple-100 text-purple-800",
      },
      lifestyle_exploration: {
        label: "Lifestyle & Exploration",
        color: "bg-green-100 text-green-800",
      },
      mind_purpose: {
        label: "Mind & Purpose",
        color: "bg-blue-100 text-blue-800",
      },
      sports_activity: {
        label: "Sports & Activity",
        color: "bg-red-100 text-red-800",
      },
      music_genres: {
        label: "Music Genres",
        color: "bg-yellow-100 text-yellow-800",
      },
    };

    const allInterests = [];
    Object.values(interestsObj).forEach(items => {
      if (Array.isArray(items)) {
        allInterests.push(...items);
      }
    });

    if (allInterests.length === 0) {
      return (
        <div className="text-center py-4 sm:py-8">
          <p className="text-gray-500 italic text-sm sm:text-base">No interests categories added yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(interestsObj).map(([category, items]) => {
          const config = categoriesConfig[category];
          if (!items || !Array.isArray(items) || items.length === 0) return null;

          return (
            <div key={category} className="mb-3 sm:mb-4">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <h4 className="font-medium text-gray-700 text-sm sm:text-base">
                  {config?.label || category.replace("_", " ").toUpperCase()}
                </h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {items.length} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {items.map((interest, index) => (
                  <span
                    key={index}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full ${
                      config?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 text-sm sm:text-base">Total Interests:</span>
            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-indigo-100 text-indigo-800 text-xs sm:text-sm font-medium rounded-full">
              {allInterests.length} interests
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4 sm:py-8">
      <p className="text-gray-500 italic text-sm sm:text-base">No interests data available</p>
    </div>
  );
}

// ProfileQuestionsDisplay Component
function ProfileQuestionsDisplay({ data }) {
  if (!data) {
    return (
      <div className="text-center py-4 sm:py-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl">💭</span>
        </div>
        <p className="text-gray-500 italic text-sm sm:text-base mb-2 sm:mb-3">No profile questions answered yet</p>
      </div>
    );
  }

  let profileQuestions = {};
  
  if (data?.prompts?.["question-key"]) {
    profileQuestions = data.prompts["question-key"];
  }
  else if (data?.prompts && typeof data.prompts === 'object') {
    profileQuestions = data.prompts;
  }
  else if (Array.isArray(data?.profile_prompts) && data.profile_prompts.length > 0) {
    data.profile_prompts.forEach(prompt => {
      if (prompt?.question_key && prompt?.answer) {
        profileQuestions[prompt.question_key] = prompt.answer;
      }
    });
  }
  else if (data?.profile_questions && typeof data.profile_questions === 'object') {
    profileQuestions = data.profile_questions;
  }

  if (Object.keys(profileQuestions).length === 0) {
    return (
      <div className="text-center py-4 sm:py-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl">💭</span>
        </div>
        <p className="text-gray-500 italic text-sm sm:text-base mb-2 sm:mb-3">No profile questions answered yet</p>
      </div>
    );
  }

  const questionsConfig = {
    small_habit: { 
      label: "A small habit that says a lot about me…", 
      icon: "✨" 
    },
    life_goal: { 
      label: "What I'm genuinely trying to build in my life right now…", 
      icon: "🏗️" 
    },
    home_moment: { 
      label: "A moment that felt like home to me…", 
      icon: "🏠" 
    },
    belief_that_shapes_life: { 
      label: "One belief that quietly shapes how I live…", 
      icon: "🌟" 
    },
    appreciate_people: { 
      label: "Something I always appreciate in people…", 
      icon: "👥" 
    },
    if_someone_knows_me: { 
      label: "If someone really knows me, they know…", 
      icon: "🤔" 
    },
    what_makes_me_understood: { 
      label: "What makes me feel truly understood…", 
      icon: "💬" 
    },
    usual_day: { 
      label: "How my usual day looks like…", 
      icon: "📅" 
    }
  };

  const answeredQuestions = Object.keys(profileQuestions).filter(
    key => profileQuestions[key] && profileQuestions[key].trim()
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex-1">
            <p className="font-medium text-green-800 text-sm sm:text-base">
              {answeredQuestions.length} out of {Object.keys(questionsConfig).length} questions answered
            </p>
            <p className="text-xs sm:text-sm text-green-600">
              Click on any question to see the full answer
            </p>
          </div>
          <div className="bg-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-green-200">
            <span className="text-green-700 text-xs sm:text-sm font-medium">
              {Math.round((answeredQuestions.length / Object.keys(questionsConfig).length) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(questionsConfig).map(([questionKey, config]) => {
          const answer = profileQuestions[questionKey] || '';
          const hasAnswer = answer && answer.trim() !== '';
          
          return (
            <div 
              key={questionKey} 
              className={`border rounded-lg p-3 sm:p-5 transition-all duration-200 hover:shadow-sm ${
                hasAnswer 
                  ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  hasAnswer ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <span className="text-base sm:text-lg">{config.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1.5 sm:mb-2 gap-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2">
                      {config.label}
                    </h4>
                    {hasAnswer ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        Not answered
                      </span>
                    )}
                  </div>
                  
                  {hasAnswer ? (
                    <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-white border border-green-100 rounded-lg">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        "{answer}"
                      </p>
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-green-50 flex justify-end">
                        <span className="text-xs text-green-600">
                          💭 Personal reflection
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-white border border-dashed border-gray-200 rounded-lg text-center">
                      <p className="text-gray-400 italic text-xs sm:text-sm">
                        This question hasn't been answered yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// InfoItem Component
function InfoItem({ label, value, full = false, type = "text" }) {
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "number" && isNaN(val)) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && Object.keys(val).length === 0) return false;
    return true;
  };

  const displayValue = hasValue(value) ? value : null;

  if (!displayValue) {
    return (
      <div className={full ? "col-span-2" : ""}>
        <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-400 italic text-xs sm:text-sm">Not provided</p>
      </div>
    );
  }

  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1">{label}</p>
      {type === "email" ? (
        <a
          href={`mailto:${displayValue}`}
          className="text-blue-600 hover:text-blue-800 hover:underline text-xs sm:text-sm break-words"
        >
          {displayValue}
        </a>
      ) : (
        <p className="text-gray-700 text-xs sm:text-sm break-words">
          {Array.isArray(displayValue) ? displayValue.join(", ") : displayValue}
        </p>
      )}
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">{children}</div>
    </div>
  );
}

// MAIN COMPONENT
export default function AdminModelDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchModelDetails();
  }, [userId]);

  const fetchModelDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(userId);
      
      if (response.data.status === "success") {
        const userData = response.data.user;
        console.log("🔍 API Response Data:", userData); 
        
        const normalizedUser = {
          ...userData,
          status: (
            userData.status ||
            userData.current_status ||
            "in process"
          ).toLowerCase(),
          current_status: (
            userData.current_status ||
            userData.status ||
            "in process"
          ).toLowerCase(),
        };
        setModel(normalizedUser);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("Error loading model details");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("adminData"));
      await adminAPI.approveUser(userId, adminData?.id);
      
      setModel(prev => ({
        ...prev,
        status: "approve",
        current_status: "approve"
      }));
      
      alert("User approved successfully!");
    } catch (error) {
      console.error("Approve error:", error);
      alert("Error approving user");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOnHold = async () => {
    const reason = prompt("Please enter reason for putting user on hold:");
    if (!reason) return;

    try {
      await adminAPI.onHoldUser(userId, reason);
      
      setModel(prev => ({
        ...prev,
        status: "on hold",
        current_status: "on hold"
      }));
      
      alert("User put on hold successfully!");
    } catch (error) {
      console.error("On Hold error:", error);
      alert("Error putting user on hold");
    }
  };

  const handleDeactivate = async () => {
    const reason = prompt("Please enter reason for deactivation:");
    if (!reason) return;

    try {
      await adminAPI.deactivateUser(userId, reason);
      
      setModel(prev => ({
        ...prev,
        status: "deactivate",
        current_status: "deactivate"
      }));
      
      alert("User deactivated successfully!");
    } catch (error) {
      console.error("Deactivate error:", error);
      alert("Error deactivating user");
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return dateString || "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading model details...</p>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 text-base sm:text-lg mb-4">{error || "Model not found"}</p>
          <button
            onClick={() => navigate("#/admin/dashboard")}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
        {/* Header with Actions */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Model Profile</h1>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-1 sm:mt-2">
                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold
                  ${model.status === "approve" ? "bg-green-100 text-green-800" :
                    model.status === "in process" ? "bg-yellow-100 text-yellow-800" :
                    model.status === "on hold" ? "bg-orange-100 text-orange-800" :
                    "bg-red-100 text-red-800"}`}>
                  {model.status?.toUpperCase() || "IN PROCESS"}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 px-2 rounded-xl bg-gray-100">
                  ID: {model.user_id || model.id}
                </span>
              </div>
          

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden px-3 py-1.5 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <span className="text-gray-700 font-medium">Actions</span>
              <span className="ml-2">{showMobileMenu ? "▲" : "▼"}</span>
            </button>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden sm:flex flex-wrap gap-2">
            <button
              onClick={handleBack} 
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-xs sm:text-sm"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={handleOnHold}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-xs sm:text-sm"
            >
              On Hold
            </button>
            <button
              onClick={handleDeactivate}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs sm:text-sm"
            >
              Deactivate
            </button>
            <button
              onClick={handleApprove}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs sm:text-sm"
            >
              Approve User
            </button>
          </div>
            </div>

          {/* Action Buttons - Mobile (Collapsible) */}
          {showMobileMenu && (
            <div className="sm:hidden grid grid-cols-2 gap-2 animate-fadeIn">
              <button
                onClick={handleBack} 
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-xs"
              >
                Back
              </button>
              <button
                onClick={handleOnHold}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-xs"
              >
                On Hold
              </button>
              <button
                onClick={handleDeactivate}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
              >
                Deactivate
              </button>
              <button
                onClick={handleApprove}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
              >
                Approve
              </button>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg">
          <div className="relative">
            {model.image_url ? (
              <img
                src={model.image_url}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-2xl sm:text-4xl font-bold text-gray-400">
                  {(model.first_name?.[0] || model.name?.[0] || "M").toUpperCase()}
                </span>
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white ${
              model.status === "approve" ? "bg-green-500" :
              model.status === "in process" ? "bg-yellow-500" :
              model.status === "on hold" ? "bg-orange-500" :
              "bg-red-500"
            }`}></div>
          </div>

          <div className="text-center flex-1 w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
              {model.first_name || model.last_name
                ? `${model.first_name || ""} ${model.last_name || ""}`.trim()
                : model.name || "Model"}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-1 sm:mt-2 break-words">
              {model.profession || "No Profession"}
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-center">
              {model.email && (
                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs">
                  📧 {model.email}
                </span>
              )}
              {model.phone && (
                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs">
                  📱 {model.phone}
                </span>
              )}
              {model.city && (
                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs">
                  📍 {model.city}
                </span>
              )}
              {model.age && (
                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs">
                  {model.age} years
                </span>
              )}
              {model.gender && (
                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs">
                  {model.gender}
                </span>
              )}
              {model.marital_status && (
                <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs">
                  {model.marital_status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-4 sm:mb-6">
          {/* Mobile Tab Selector */}
          <div className="sm:hidden mb-3">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="0">Basic Information</option>
              <option value="1">Lifestyle & Work</option>
              <option value="2">Life Rhythms</option>
              <option value="3">Profile Q&A</option>
            </select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 0, label: "Basic Information", number: "1" },
              { id: 1, label: "Lifestyle & Work", number: "2" },
              { id: 2, label: "Life Rhythms", number: "3" },
              { id: 3, label: "Profile Q&A", number: "4" }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex-shrink-0 py-2 px-3 text-center font-medium transition-colors min-w-[120px] ${
                  activeTab === tab.id
                    ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                    {tab.number}
                  </span>
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tab Indicator */}
        <div className="sm:hidden mb-4">
          <div className="flex items-center justify-between px-2 py-1.5 bg-indigo-50 rounded-lg">
            <span className="text-xs font-medium text-indigo-600">
              {activeTab === 0 ? "Basic Information" :
               activeTab === 1 ? "Lifestyle & Work" :
               activeTab === 2 ? "Life Rhythms" : "Profile Q&A"}
            </span>
            <span className="text-xs text-indigo-500 bg-white px-2 py-0.5 rounded-full">
              Page {activeTab + 1} of 4
            </span>
          </div>
        </div>

        {/* PAGE 1: BASIC INFORMATION */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <Section title="Personal Information">
                <InfoItem label="First Name" value={model.first_name} />
                <InfoItem label="Last Name" value={model.last_name} />
                <InfoItem label="User Name" value={model.username} type="UserName" />
                <InfoItem label="Email" value={model.email} type="email" />
                <InfoItem label="Phone" value={model.phone} />
                <InfoItem label="Date of Birth" value={formatDateForDisplay(model.dob)} />
                <InfoItem label="Age" value={model.age} />
                <InfoItem label="Gender" value={model.gender} />
                <InfoItem label="Marital Status" value={model.marital_status} />
                <InfoItem label="City" value={model.city} />
                <InfoItem label="Country" value={model.country} />
                <InfoItem label="State" value={model.state} />
                <InfoItem label="Pincode" value={model.pincode} />
                <InfoItem label="Address" value={model.address} full />
              </Section>

              <Section title="Personal Details">
                <InfoItem label="Height in Inches" value={model.height} />
                <InfoItem label="Professional Identity" value={model.professional_identity} />
                <InfoItem label="Zodiac Sign" value={model.zodiac_sign} />
                <InfoItem
                  label="Languages Spoken"
                  value={
                    Array.isArray(model.languages_spoken)
                      ? model.languages_spoken.join(", ")
                      : model.languages_spoken
                  }
                />
              </Section>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Section title="Professional Information">
                <InfoItem label="Headline" value={model.headline} />
                <InfoItem label="Profession" value={model.profession} />
                <InfoItem label="Company" value={model.company} />
                <InfoItem label="Position" value={model.position} />
                <InfoItem label="Company Type" value={model.company_type} />
                <InfoItem
                  label="Experience"
                  value={model.experience ? `${model.experience} years` : ""}
                />
                <InfoItem label="Education" value={model.education} />
                <InfoItem
                  label="Education Institution"
                  value={model.education_institution_name}
                />
              </Section>

              <Section title="About Me">
                <InfoItem label="About" value={model.about_me} full />
                <InfoItem
                  label="Hobbies"
                  value={
                    Array.isArray(model.hobbies)
                      ? model.hobbies.join(", ")
                      : model.hobbies
                  }
                />
              </Section>

              <Section title="Skills & Interests">
                <InfoItem
                  label="Skills"
                  value={
                    Array.isArray(model.skills)
                      ? model.skills.join(", ")
                      : typeof model.skills === "object"
                      ? Object.keys(model.skills || {}).join(", ")
                      : model.skills
                  }
                  full
                />
                <InfoItem
                  label="Interests"
                  value={
                    Array.isArray(model.interests)
                      ? model.interests.join(", ")
                      : model.interests
                  }
                  full
                />
              </Section>
            </div>
          </div>
        )}

        {/* PAGE 2: LIFESTYLE & WORK */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <Section title="Lifestyle">
                <InfoItem label="Self Expression" value={model.self_expression} />
                <InfoItem label="Free Time Style" value={model.freetime_style} />
                <InfoItem label="Health Activity Level" value={model.health_activity_level} />
                <InfoItem label="Pets Preference" value={model.pets_preference} />
                <InfoItem label="Religious Belief" value={model.religious_belief} />
                <InfoItem label="Smoking" value={model.smoking} />
                <InfoItem label="Drinking" value={model.drinking} />
              </Section>

              <Section title="Relationship Preferences">
                <InfoItem label="Interested In" value={model.interested_in} />
                <InfoItem label="Relationship Goal" value={model.relationship_goal} />
                <InfoItem label="Children Preference" value={model.children_preference} />
              </Section>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Section title="Work Style">
                <InfoItem label="Work Environment" value={model.work_environment} />
                <InfoItem label="Interaction Style" value={model.interaction_style} />
                <InfoItem label="Work Rhythm" value={model.work_rhythm} />
                <InfoItem label="Career Decision Style" value={model.career_decision_style} />
                <InfoItem label="Work Demand Response" value={model.work_demand_response} />
              </Section>

              <Section title="Relationship Styles">
                <InfoItem label="Love Language" value={model.love_language_affection} />
                <InfoItem label="Preference of Closeness" value={model.preference_of_closeness} />
                <InfoItem label="Approach to Physical Closeness" value={model.approach_to_physical_closeness} />
                <InfoItem label="Relationship Values" value={model.relationship_values} />
                <InfoItem label="Values in Others" value={model.values_in_others} />
                <InfoItem label="Relationship Pace" value={model.relationship_pace} />
              </Section>
            </div>
          </div>
        )}

        {/* PAGE 3: LIFE RHYTHMS & INTERESTS */}
        {activeTab === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl">🎵</span>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Life Rhythms & Interests
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">Personal rhythms and passions</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-base sm:text-lg">🎵</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Life Rhythms</h3>
                  </div>
                  <LifeRhythmsDisplay data={model.life_rhythms} />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-base sm:text-lg">🎯</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Interests & Passions</h3>
                  </div>
                  <InterestsDisplay 
                    data={model.ways_i_spend_time || model.interests_categories || model.interests} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: PROFILE QUESTIONS */}
        {activeTab === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg sm:text-xl">💭</span>
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                    Profile Questions & Answers
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Get to know more about this person through their answers
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-base sm:text-lg">💭</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Get to Know Me
                </h3>
              </div>
              
              <ProfileQuestionsDisplay data={model} />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
          <button
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg transition flex items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
            onClick={() => setActiveTab(activeTab - 1)}
            disabled={activeTab === 0}
          >
            <span className="text-sm sm:text-base">←</span>
            <span className="text-xs sm:text-sm">Previous</span>
          </button>

          <div className="flex gap-1.5 sm:gap-2 order-first sm:order-none mb-3 sm:mb-0">
            {[0, 1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm ${
                  activeTab === page
                    ? "bg-indigo-100 text-indigo-600 font-medium"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>

          <button
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg transition flex items-center justify-center gap-1 sm:gap-2 ${
              activeTab === 3
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
            onClick={() => setActiveTab(activeTab + 1)}
            disabled={activeTab === 3}
          >
            <span className="text-xs sm:text-sm">Next</span>
            <span className="text-sm sm:text-base">→</span>
          </button>
        </div>
      </div>

      {/* Add CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}


































































































// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { adminAPI } from "../services/adminApi";

// // LifeRhythmsDisplay Component
// function LifeRhythmsDisplay({ data }) {
//   if (!data || typeof data !== "object") {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 italic">No life rhythms data available</p>
//       </div>
//     );
//   }

//   // Check if data is a string (JSON stringified)
//   let rhythmsData = data;
//   if (typeof data === "string") {
//     try {
//       rhythmsData = JSON.parse(data);
//     } catch (error) {
//       console.error("Error parsing life rhythms:", error);
//       return (
//         <div className="text-center py-8">
//           <p className="text-gray-500 italic">No life rhythms data available</p>
//         </div>
//       );
//     }
//   }

//   if (Object.keys(rhythmsData).length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 italic">No life rhythms data available</p>
//       </div>
//     );
//   }

//   const rhythmSections = {
//     work_rhythm: { title: "Work Rhythm", icon: "💼" },
//     social_energy: { title: "Social Energy", icon: "👥" },
//     life_pace: { title: "Life Pace", icon: "⏱️" },
//     emotional_style: { title: "Emotional Style", icon: "💖" },
//   };

//   return (
//     <div className="space-y-6">
//       {Object.entries(rhythmSections).map(([key, section]) => {
//         const rhythmData = rhythmsData[key];
//         if (!rhythmData) return null;

//         return (
//           <div
//             key={key}
//             className="bg-white border border-gray-200 rounded-lg p-4"
//           >
//             <div className="flex items-center gap-3 mb-3">
//               <span className="text-xl">{section.icon}</span>
//               <h4 className="text-lg font-semibold text-gray-800">
//                 {section.title}
//               </h4>
//             </div>

//             <div className="ml-9">
//               {rhythmData.combination ? (
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">
//                     Combination:
//                   </p>
//                   <p className="text-gray-900 font-medium text-lg mt-1">
//                     {rhythmData.combination}
//                   </p>
//                   {rhythmData.statement && (
//                     <p className="text-gray-600 mt-2 italic">
//                       "{rhythmData.statement}"
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Style:</p>
//                   <p className="text-gray-900 font-medium text-lg mt-1">
//                     {rhythmData.single}
//                   </p>
//                   {rhythmData.statement && (
//                     <p className="text-gray-600 mt-2 italic">
//                       "{rhythmData.statement}"
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // InterestsDisplay Component
// function InterestsDisplay({ data, type = "simple" }) {
//   if (!data) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 italic">No interests data available</p>
//       </div>
//     );
//   }

//   // Handle string data (comma separated)
//   if (typeof data === "string") {
//     const interestsArray = data.split(",").map(item => item.trim()).filter(item => item);
    
//     if (interestsArray.length === 0) {
//       return (
//         <div className="text-center py-8">
//           <p className="text-gray-500 italic">No interests added yet</p>
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-wrap gap-2">
//         {interestsArray.map((interest, idx) => (
//           <span
//             key={idx}
//             className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full"
//           >
//             {interest}
//           </span>
//         ))}
//       </div>
//     );
//   }

//   // Handle array data
//   if (Array.isArray(data)) {
//     if (data.length === 0) {
//       return (
//         <div className="text-center py-8">
//           <p className="text-gray-500 italic">No interests added yet</p>
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-wrap gap-2">
//         {data.map((interest, idx) => (
//           <span
//             key={idx}
//             className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full"
//           >
//             {interest}
//           </span>
//         ))}
//       </div>
//     );
//   }

//   // Handle ways_i_spend_time (checkbox categories)
//   if (typeof data === "object" && !Array.isArray(data)) {
//     // If it's a JSON string
//     let interestsObj = data;
//     if (typeof data === "string") {
//       try {
//         interestsObj = JSON.parse(data);
//       } catch (error) {
//         console.error("Error parsing interests:", error);
//         return (
//           <div className="text-center py-8">
//             <p className="text-gray-500 italic">Error loading interests</p>
//           </div>
//         );
//       }
//     }

//     const categoriesConfig = {
//       creative_cultural: {
//         label: "Creative & Cultural",
//         color: "bg-purple-100 text-purple-800",
//       },
//       lifestyle_exploration: {
//         label: "Lifestyle & Exploration",
//         color: "bg-green-100 text-green-800",
//       },
//       mind_purpose: {
//         label: "Mind & Purpose",
//         color: "bg-blue-100 text-blue-800",
//       },
//       sports_activity: {
//         label: "Sports & Activity",
//         color: "bg-red-100 text-red-800",
//       },
//       music_genres: {
//         label: "Music Genres",
//         color: "bg-yellow-100 text-yellow-800",
//       },
//     };

//     const allInterests = [];
//     Object.values(interestsObj).forEach(items => {
//       if (Array.isArray(items)) {
//         allInterests.push(...items);
//       }
//     });

//     if (allInterests.length === 0) {
//       return (
//         <div className="text-center py-8">
//           <p className="text-gray-500 italic">No interests categories added yet</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-6">
//         {Object.entries(interestsObj).map(([category, items]) => {
//           const config = categoriesConfig[category];
//           if (!items || !Array.isArray(items) || items.length === 0) return null;

//           return (
//             <div key={category} className="mb-4">
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="font-medium text-gray-700">
//                   {config?.label || category.replace("_", " ").toUpperCase()}
//                 </h4>
//                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                   {items.length} selected
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {items.map((interest, index) => (
//                   <span
//                     key={index}
//                     className={`px-3 py-1.5 text-sm rounded-full ${
//                       config?.color || "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           );
//         })}

//         <div className="mt-6 pt-4 border-t border-gray-100">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-gray-700">Total Interests:</span>
//             <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
//               {allInterests.length} interests
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="text-center py-8">
//       <p className="text-gray-500 italic">No interests data available</p>
//     </div>
//   );
// }

// //  ProfileQuestionsDisplay Component
// function ProfileQuestionsDisplay({ data }) {
//   if (!data) {
//     return (
//       <div className="text-center py-8">
//         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//           <span className="text-xl">💭</span>
//         </div>
//         <p className="text-gray-500 italic mb-3">No profile questions answered yet</p>
//       </div>
//     );
//   }

//   // Extract questions from different possible locations
//   let profileQuestions = {};
  
//   // Priority 1: Check prompts["question-key"]
//   if (data?.prompts?.["question-key"]) {
//     profileQuestions = data.prompts["question-key"];
//   }
//   // Priority 2: Check prompts directly
//   else if (data?.prompts && typeof data.prompts === 'object') {
//     profileQuestions = data.prompts;
//   }
//   // Priority 3: Check profile_prompts array
//   else if (Array.isArray(data?.profile_prompts) && data.profile_prompts.length > 0) {
//     data.profile_prompts.forEach(prompt => {
//       if (prompt?.question_key && prompt?.answer) {
//         profileQuestions[prompt.question_key] = prompt.answer;
//       }
//     });
//   }
//   // Priority 4: Check profile_questions
//   else if (data?.profile_questions && typeof data.profile_questions === 'object') {
//     profileQuestions = data.profile_questions;
//   }

//   if (Object.keys(profileQuestions).length === 0) {
//     return (
//       <div className="text-center py-8">
//         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//           <span className="text-xl">💭</span>
//         </div>
//         <p className="text-gray-500 italic mb-3">No profile questions answered yet</p>
//       </div>
//     );
//   }

//   const questionsConfig = {
//     small_habit: { 
//       label: "A small habit that says a lot about me…", 
//       icon: "✨" 
//     },
//     life_goal: { 
//       label: "What I'm genuinely trying to build in my life right now…", 
//       icon: "🏗️" 
//     },
//     home_moment: { 
//       label: "A moment that felt like home to me…", 
//       icon: "🏠" 
//     },
//     belief_that_shapes_life: { 
//       label: "One belief that quietly shapes how I live…", 
//       icon: "🌟" 
//     },
//     appreciate_people: { 
//       label: "Something I always appreciate in people…", 
//       icon: "👥" 
//     },
//     if_someone_knows_me: { 
//       label: "If someone really knows me, they know…", 
//       icon: "🤔" 
//     },
//     what_makes_me_understood: { 
//       label: "What makes me feel truly understood…", 
//       icon: "💬" 
//     },
//     usual_day: { 
//       label: "How my usual day looks like…", 
//       icon: "📅" 
//     }
//   };

//   const answeredQuestions = Object.keys(profileQuestions).filter(
//     key => profileQuestions[key] && profileQuestions[key].trim()
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center mb-6 p-4 bg-green-50 rounded-lg">
//         <div>
//           <p className="font-medium text-green-800">
//             {answeredQuestions.length} out of {Object.keys(questionsConfig).length} questions answered
//           </p>
//           <p className="text-sm text-green-600">
//             Click on any question to see the full answer
//           </p>
//         </div>
//         <div className="bg-white px-3 py-1 rounded-full border border-green-200">
//           <span className="text-green-700 text-sm font-medium">
//             {Math.round((answeredQuestions.length / Object.keys(questionsConfig).length) * 100)}% Complete
//           </span>
//         </div>
//       </div>
      
//       <div className="space-y-6">
//         {Object.entries(questionsConfig).map(([questionKey, config]) => {
//           const answer = profileQuestions[questionKey] || '';
//           const hasAnswer = answer && answer.trim() !== '';
          
//           return (
//             <div 
//               key={questionKey} 
//               className={`border rounded-lg p-5 transition-all duration-200 hover:shadow-sm ${
//                 hasAnswer 
//                   ? 'border-green-200 bg-green-50 hover:bg-green-100' 
//                   : 'border-gray-200 bg-gray-50'
//               }`}
//             >
//               <div className="flex items-start gap-4">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                   hasAnswer ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
//                 }`}>
//                   <span className="text-lg">{config.icon}</span>
//                 </div>
                
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start mb-2">
//                     <h4 className="font-medium text-gray-800 text-base">
//                       {config.label}
//                     </h4>
//                     {hasAnswer ? (
//                       <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                         Answered
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">
//                         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
//                         Not answered
//                       </span>
//                     )}
//                   </div>
                  
//                   {hasAnswer ? (
//                     <div className="mt-3 p-4 bg-white border border-green-100 rounded-lg">
//                       <p className="text-gray-700 leading-relaxed">
//                         "{answer}"
//                       </p>
//                       <div className="mt-3 pt-3 border-t border-green-50 flex justify-end">
//                         <span className="text-xs text-green-600">
//                           💭 Personal reflection
//                         </span>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="mt-3 p-4 bg-white border border-dashed border-gray-200 rounded-lg text-center">
//                       <p className="text-gray-400 italic text-sm">
//                         This question hasn't been answered yet
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // InfoItem Component
// function InfoItem({ label, value, full = false, type = "text" }) {
//   const hasValue = (val) => {
//     if (val === null || val === undefined) return false;
//     if (typeof val === "string" && val.trim() === "") return false;
//     if (typeof val === "number" && isNaN(val)) return false;
//     if (Array.isArray(val) && val.length === 0) return false;
//     if (typeof val === "object" && Object.keys(val).length === 0) return false;
//     return true;
//   };

//   const displayValue = hasValue(value) ? value : null;

//   if (!displayValue) {
//     return (
//       <div className={full ? "col-span-2" : ""}>
//         <p className="text-sm font-medium text-gray-500">{label}</p>
//         <p className="text-gray-400 italic text-sm">Not provided</p>
//       </div>
//     );
//   }

//   return (
//     <div className={full ? "col-span-2" : ""}>
//       <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
//       {type === "email" ? (
//         <a
//           href={`mailto:${displayValue}`}
//           className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
//         >
//           {displayValue}
//         </a>
//       ) : (
//         <p className="text-gray-700 text-sm">
//           {Array.isArray(displayValue) ? displayValue.join(", ") : displayValue}
//         </p>
//       )}
//     </div>
//   );
// }

// //  Section Component
// function Section({ title, children }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
//         {title}
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
//     </div>
//   );
// }

// // MAIN COMPONENT
// export default function AdminModelDetails() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [model, setModel] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState(0);

//   // Fetch model data from API
//   useEffect(() => {
//     fetchModelDetails();
//   }, [userId]);

//   const fetchModelDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await adminAPI.getUserDetails(userId);
      
//       if (response.data.status === "success") {
//         const userData = response.data.user;
//         console.log("🔍 API Response Data:", userData); 
        
//         const normalizedUser = {
//           ...userData,
//           status: (
//             userData.status ||
//             userData.current_status ||
//             "in process"
//           ).toLowerCase(),
//           current_status: (
//             userData.current_status ||
//             userData.status ||
//             "in process"
//           ).toLowerCase(),
//         };
//         setModel(normalizedUser);
//       } else {
//         setError("Failed to fetch user data");
//       }
//     } catch (err) {
//       setError("Error loading model details");
//       console.error("API Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  Admin Actions
//   const handleApprove = async () => {
//     try {
//       const adminData = JSON.parse(localStorage.getItem("adminData"));
//       await adminAPI.approveUser(userId, adminData?.id);
      
//       setModel(prev => ({
//         ...prev,
//         status: "approve",
//         current_status: "approve"
//       }));
      
//       alert("User approved successfully!");
//     } catch (error) {
//       console.error("Approve error:", error);
//       alert("Error approving user");
//     }
//   };
//  const handleBack = () => {
//     navigate(-1);
//   };
//   const handleOnHold = async () => {
//     const reason = prompt("Please enter reason for putting user on hold:");
//     if (!reason) return;

//     try {
//       await adminAPI.onHoldUser(userId, reason);
      
//       setModel(prev => ({
//         ...prev,
//         status: "on hold",
//         current_status: "on hold"
//       }));
      
//       alert("User put on hold successfully!");
//     } catch (error) {
//       console.error("On Hold error:", error);
//       alert("Error putting user on hold");
//     }
//   };

//   const handleDeactivate = async () => {
//     const reason = prompt("Please enter reason for deactivation:");
//     if (!reason) return;

//     try {
//       await adminAPI.deactivateUser(userId, reason);
      
//       setModel(prev => ({
//         ...prev,
//         status: "deactivate",
//         current_status: "deactivate"
//       }));
      
//       alert("User deactivated successfully!");
//     } catch (error) {
//       console.error("Deactivate error:", error);
//       alert("Error deactivating user");
//     }
//   };

//   const formatDateForDisplay = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//     } catch (error) {
//       return dateString || "";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading model details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !model) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500 text-lg mb-4">{error || "Model not found"}</p>
//           <button
//             onClick={() => navigate("#/admin/dashboard")}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
//         {/* Header with Actions */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Model Profile</h1>
//             <div className="flex items-center gap-3 mt-2">
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold
//                 ${model.status === "approve" ? "bg-green-100 text-green-800" :
//                   model.status === "in process" ? "bg-yellow-100 text-yellow-800" :
//                   model.status === "on hold" ? "bg-orange-100 text-orange-800" :
//                   "bg-red-100 text-red-800"}`}>
//                 {model.status?.toUpperCase() || "IN PROCESS"}
//               </span>
//               <span className="text-sm text-gray-600">
//                 ID: #{model.user_id || model.id}
//               </span>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={handleBack} 
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
//             >
//               Back to Dashboard
//             </button>
       
            
//             <button
//               onClick={handleOnHold}
//               className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
//             >
//               On Hold
//             </button>
//             <button
//               onClick={handleDeactivate}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
//             >
//               Deactivate
//             </button>
//             <button
//               onClick={handleApprove}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
//             >
//               Approve User
//             </button>
//           </div>
//         </div>

//         {/* Profile Header */}
//         <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
//           {model.image_url ? (
//             <img
//               src={model.image_url}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
//             />
//           ) : (
//             <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
//               <span className="text-4xl font-bold text-gray-400">
//                 {(model.first_name?.[0] || model.name?.[0] || "M").toUpperCase()}
//               </span>
//             </div>
//           )}

//           <div className="text-center md:text-left flex-1">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               {model.first_name || model.last_name
//                 ? `${model.first_name || ""} ${model.last_name || ""}`.trim()
//                 : model.name || "Model"}
//             </h1>

//             <p className="text-lg md:text-xl text-gray-600 mt-2">
//               {model.headline || model.profession || "No Profession"}
//             </p>

//             <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
//               {model.email && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   📧 {model.email}
//                 </span>
//               )}
//               {model.phone && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   📱 {model.phone}
//                 </span>
//               )}
//               {model.city && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   📍 {model.city}
//                 </span>
//               )}
//               {model.age && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {model.age} years
//                 </span>
//               )}
//               {model.gender && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {model.gender}
//                 </span>
//               )}
//               {model.marital_status && (
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
//                   {model.marital_status}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs Navigation */}
//         <div className="mb-6">
//           <div className="flex border-b border-gray-200">
//             <button
//               className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
//                 activeTab === 0
//                   ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//               onClick={() => setActiveTab(0)}
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
//                   1
//                 </span>
//                 Basic Information
//               </span>
//             </button>
//             <button
//               className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
//                 activeTab === 1
//                   ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//               onClick={() => setActiveTab(1)}
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
//                   2
//                 </span>
//                 Lifestyle & Work
//               </span>
//             </button>
//             <button
//               className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
//                 activeTab === 2
//                   ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//               onClick={() => setActiveTab(2)}
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
//                   3
//                 </span>
//                 Life Rhythms
//               </span>
//             </button>
//             <button
//               className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
//                 activeTab === 3
//                   ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//               }`}
//               onClick={() => setActiveTab(3)}
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
//                   4
//                 </span>
//                 Profile Q&A
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* PAGE 1: BASIC INFORMATION */}
//         {activeTab === 0 && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="space-y-6">
//               <Section title="Personal Information">
//                 <InfoItem label="First Name" value={model.first_name} />
//                 <InfoItem label="Last Name" value={model.last_name} />
//                 <InfoItem label="User Name" value={model.username} type="UserName" />
//                 <InfoItem label="Email" value={model.email} type="email" />
//                 <InfoItem label="Phone" value={model.phone} />
//                 <InfoItem label="Date of Birth" value={formatDateForDisplay(model.dob)} />
//                 <InfoItem label="Age" value={model.age} />
//                 <InfoItem label="Gender" value={model.gender} />
//                 <InfoItem label="Marital Status" value={model.marital_status} />
//                 <InfoItem label="City" value={model.city} />
//                 <InfoItem label="Country" value={model.country} />
//                 <InfoItem label="State" value={model.state} />
//                 <InfoItem label="Pincode" value={model.pincode} />
//                 <InfoItem label="Address" value={model.address} full />
//               </Section>

//               <Section title="Personal Details">
//                 <InfoItem label="Height in Inches" value={model.height} />
//                 <InfoItem label="Professional Identity" value={model.professional_identity} />
//                 <InfoItem label="Zodiac Sign" value={model.zodiac_sign} />
//                 <InfoItem
//                   label="Languages Spoken"
//                   value={
//                     Array.isArray(model.languages_spoken)
//                       ? model.languages_spoken.join(", ")
//                       : model.languages_spoken
//                   }
//                 />
//               </Section>
//             </div>

//             <div className="space-y-6">
//               <Section title="Professional Information">
//                 <InfoItem label="Headline" value={model.headline} />
//                 <InfoItem label="Profession" value={model.profession} />
//                 <InfoItem label="Company" value={model.company} />
//                 <InfoItem label="Position" value={model.position} />
//                 <InfoItem label="Company Type" value={model.company_type} />
//                 <InfoItem
//                   label="Experience"
//                   value={model.experience ? `${model.experience} years` : ""}
//                 />
//                 <InfoItem label="Education" value={model.education} />
//                 <InfoItem
//                   label="Education Institution"
//                   value={model.education_institution_name}
//                 />
//               </Section>

//               <Section title="About Me">
//                 <InfoItem label="About" value={model.about_me} full />
//                 <InfoItem
//                   label="Hobbies"
//                   value={
//                     Array.isArray(model.hobbies)
//                       ? model.hobbies.join(", ")
//                       : model.hobbies
//                   }
//                 />
//               </Section>

//               <Section title="Skills & Interests">
//                 <InfoItem
//                   label="Skills"
//                   value={
//                     Array.isArray(model.skills)
//                       ? model.skills.join(", ")
//                       : typeof model.skills === "object"
//                       ? Object.keys(model.skills || {}).join(", ")
//                       : model.skills
//                   }
//                   full
//                 />
//                 <InfoItem
//                   label="Interests"
//                   value={
//                     Array.isArray(model.interests)
//                       ? model.interests.join(", ")
//                       : model.interests
//                   }
//                   full
//                 />
//               </Section>
//             </div>
//           </div>
//         )}

//         {/* PAGE 2: LIFESTYLE & WORK */}
//         {activeTab === 1 && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="space-y-6">
//               <Section title="Lifestyle">
//                 <InfoItem label="Self Expression" value={model.self_expression} />
//                 <InfoItem label="Free Time Style" value={model.freetime_style} />
//                 <InfoItem label="Health Activity Level" value={model.health_activity_level} />
//                 <InfoItem label="Pets Preference" value={model.pets_preference} />
//                 <InfoItem label="Religious Belief" value={model.religious_belief} />
//                 <InfoItem label="Smoking" value={model.smoking} />
//                 <InfoItem label="Drinking" value={model.drinking} />
//               </Section>

//               <Section title="Relationship Preferences">
//                 <InfoItem label="Interested In" value={model.interested_in} />
//                 <InfoItem label="Relationship Goal" value={model.relationship_goal} />
//                 <InfoItem label="Children Preference" value={model.children_preference} />
//               </Section>
//             </div>

//             <div className="space-y-6">
//               <Section title="Work Style">
//                 <InfoItem label="Work Environment" value={model.work_environment} />
//                 <InfoItem label="Interaction Style" value={model.interaction_style} />
//                 <InfoItem label="Work Rhythm" value={model.work_rhythm} />
//                 <InfoItem label="Career Decision Style" value={model.career_decision_style} />
//                 <InfoItem label="Work Demand Response" value={model.work_demand_response} />
//               </Section>

//               <Section title="Relationship Styles">
//                 <InfoItem label="Love Language" value={model.love_language_affection} />
//                 <InfoItem label="Preference of Closeness" value={model.preference_of_closeness} />
//                 <InfoItem label="Approach to Physical Closeness" value={model.approach_to_physical_closeness} />
//                 <InfoItem label="Relationship Values" value={model.relationship_values} />
//                 <InfoItem label="Values in Others" value={model.values_in_others} />
//                 <InfoItem label="Relationship Pace" value={model.relationship_pace} />
//               </Section>
//             </div>
//           </div>
//         )}

//         {/* PAGE 3: LIFE RHYTHMS & INTERESTS */}
//         {activeTab === 2 && (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                   <span className="text-xl">🎵</span>
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Life Rhythms & Interests
//                   </h2>
//                   <p className="text-gray-600">Personal rhythms and passions</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="space-y-6">
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                       <span className="text-lg">🎵</span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800">Life Rhythms</h3>
//                   </div>
//                   <LifeRhythmsDisplay data={model.life_rhythms} />
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="bg-white border border-gray-200 rounded-lg p-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <span className="text-lg">🎯</span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800">Interests & Passions</h3>
//                   </div>
//                   {/* Try different sources for interests */}
//                   <InterestsDisplay 
//                     data={model.ways_i_spend_time || model.interests_categories || model.interests} 
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* PAGE 4: PROFILE QUESTIONS */}
//         {activeTab === 3 && (
//           <div className="space-y-6">
//             <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6 mb-6">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                   <span className="text-xl">💭</span>
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     Profile Questions & Answers
//                   </h2>
//                   <p className="text-gray-600">
//                     Get to know more about this person through their answers
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 rounded-lg p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <span className="text-lg">💭</span>
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Get to Know Me
//                 </h3>
//               </div>
              
//               <ProfileQuestionsDisplay data={model} />
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between items-center mt-8 pt-6 border-t">
//           <button
//             className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
//               activeTab === 0
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-gray-500 text-white hover:bg-gray-600"
//             }`}
//             onClick={() => setActiveTab(activeTab - 1)}
//             disabled={activeTab === 0}
//           >
//             ← Previous
//           </button>

//           <div className="flex gap-2">
//             {[0, 1, 2, 3].map((page) => (
//               <button
//                 key={page}
//                 className={`px-4 py-2 rounded-lg text-sm ${
//                   activeTab === page
//                     ? "bg-indigo-100 text-indigo-600 font-medium"
//                     : "bg-gray-100 text-gray-500 hover:bg-gray-200"
//                 }`}
//                 onClick={() => setActiveTab(page)}
//               >
//                 {page === 0 ? "Page 1" : 
//                  page === 1 ? "Page 2" : 
//                  page === 2 ? "Page 3" : 
//                  "Page 4"}
//               </button>
//             ))}
//           </div>

//           <button
//             className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
//               activeTab === 3
//                 ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 : "bg-indigo-600 text-white hover:bg-indigo-700"
//             }`}
//             onClick={() => setActiveTab(activeTab + 1)}
//             disabled={activeTab === 3}
//           >
//             Next →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }






