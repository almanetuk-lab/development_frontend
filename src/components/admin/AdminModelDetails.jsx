import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";
import ImageModal from "../comman/ImageModal";
import { toast } from "react-toastify";

// LifeRhythmsDisplay Component
function LifeRhythmsDisplay({ data }) {
  if (!data || typeof data !== "object") {
    return (
      <div className="text-center py-6">
        <p className="text-slate-400 italic text-xs font-semibold">No life rhythms data available</p>
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
        <div className="text-center py-6">
          <p className="text-slate-400 italic text-xs font-semibold">No life rhythms data available</p>
        </div>
      );
    }
  }

  if (Object.keys(rhythmsData).length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-400 italic text-xs font-semibold">No life rhythms data available</p>
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
    <div className="space-y-4">
      {Object.entries(rhythmSections).map(([key, section]) => {
        const rhythmData = rhythmsData[key];
        if (!rhythmData) return null;

        return (
          <div
            key={key}
            className="bg-slate-50 border border-slate-100 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{section.icon}</span>
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                {section.title}
              </h4>
            </div>

            <div className="ml-6">
              {rhythmData.combination ? (
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {rhythmData.combination}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-[11px] text-slate-500 mt-1 italic font-medium">
                      "{rhythmData.statement}"
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-[11px] font-bold text-slate-600">
                    {rhythmData.type || rhythmData.style || "Standard"}
                  </p>
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
      <div className="text-center py-6">
        <p className="text-slate-400 italic text-xs font-semibold">No interests data available</p>
      </div>
    );
  }

  if (typeof data === "string") {
    const interestsArray = data.split(",").map(item => item.trim()).filter(item => item);
    if (interestsArray.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-slate-400 italic text-xs font-semibold">No interests added yet</p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {interestsArray.map((interest, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-xl"
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
        <div className="text-center py-6">
          <p className="text-slate-400 italic text-xs font-semibold">No interests added yet</p>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {data.map((interest, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-xl"
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
          <div className="text-center py-6">
            <p className="text-slate-400 italic text-xs font-semibold">Error loading interests</p>
          </div>
        );
      }
    }

    const categoriesConfig = {
      creative_cultural: {
        label: "Creative & Cultural",
        color: "bg-purple-50 text-purple-700 border-purple-100",
      },
      lifestyle_exploration: {
        label: "Lifestyle & Exploration",
        color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      },
      mind_purpose: {
        label: "Mind & Purpose",
        color: "bg-blue-50 text-blue-700 border-blue-100",
      },
      sports_activity: {
        label: "Sports & Activity",
        color: "bg-rose-50 text-rose-700 border-rose-100",
      },
      music_genres: {
        label: "Music Genres",
        color: "bg-amber-50 text-amber-700 border-amber-100",
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
        <div className="text-center py-6">
          <p className="text-slate-400 italic text-xs font-semibold">No interests categories added yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(interestsObj).map(([category, items]) => {
          const config = categoriesConfig[category];
          if (!items || !Array.isArray(items) || items.length === 0) return null;

          return (
            <div key={category} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                  {config?.label || category.replace(/_/g, " ").toUpperCase()}
                </h4>
                <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                  {items.length} Selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((interest, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border ${
                      config?.color || "bg-slate-50 text-slate-600 border-slate-100"
                    }`}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Total Interests Listed:</span>
          <span className="px-3 py-1 bg-[#002060]/5 text-[#002060] text-xs font-bold rounded-full">
            {allInterests.length} Items
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <p className="text-slate-400 italic text-xs font-semibold">No interests data available</p>
    </div>
  );
}

// ProfileQuestionsDisplay Component
function ProfileQuestionsDisplay({ data }) {
  if (!data) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-400 italic text-xs font-semibold">No profile questions answered yet</p>
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

  const answeredQuestions = Object.keys(profileQuestions).filter(
    key => profileQuestions[key] && profileQuestions[key].trim()
  );

  if (answeredQuestions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-slate-400 italic text-xs font-semibold">No profile questions answered yet</p>
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

  return (
    <div className="space-y-4">
      {Object.entries(questionsConfig).map(([questionKey, config]) => {
        const answer = profileQuestions[questionKey] || '';
        const hasAnswer = answer && answer.trim() !== '';
        if (!hasAnswer) return null;
        
        return (
          <div 
            key={questionKey} 
            className="border border-slate-150 bg-slate-50/50 rounded-2xl p-4.5"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="text-sm">{config.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider mb-2">
                  {config.label}
                </h4>
                <div className="p-4 bg-white border border-slate-100 rounded-xl">
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                    "{answer}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// InfoItem Component
function InfoItem({ label, value, full = false, type = "text" }) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return (
    <div className={`p-3.5 bg-slate-50 rounded-xl border border-slate-100/50 ${full ? "col-span-1 sm:col-span-2" : ""}`}>
      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
      <span className="text-xs font-bold text-slate-800 break-words">{value}</span>
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  const hasChildren = React.Children.toArray(children).some(child => child !== null);
  if (!hasChildren) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5.5 shadow-xs space-y-4">
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {children}
      </div>
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [modalImage, setModalImage] = useState({ isOpen: false, url: "", title: "" });

  useEffect(() => {
    fetchModelDetails();
  }, [userId]);

  const fetchModelDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(userId);
      
      if (response.data.status === "success") {
        const userData = response.data.user;
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
        setError(response.data.message || "Failed to load model details");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while loading profile details.");
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
      toast.success("User profile approved successfully");
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve user profile");
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
      toast.success("User profile placed on hold");
    } catch (error) {
      console.error("On Hold error:", error);
      toast.error("Failed to update user status");
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
      toast.success("User profile deactivated");
    } catch (error) {
      console.error("Deactivate error:", error);
      toast.error("Failed to deactivate user");
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
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#FF2A6D]"></div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200/60 rounded-3xl max-w-lg mx-auto shadow-xs">
        <p className="text-slate-500 text-sm font-semibold mb-4">{error || "Model profile not found"}</p>
        <button
          onClick={handleBack}
          className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition hover:bg-slate-800 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
      {/* Action Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Model Profile Review</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full border
                ${model.status === "approve" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  model.status === "in process" ? "bg-amber-50 text-amber-700 border-amber-100" :
                  model.status === "on hold" ? "bg-orange-50 text-orange-700 border-orange-100" :
                  "bg-rose-50 text-rose-700 border-rose-100"}`}>
                {model.status || "IN PROCESS"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-150">
                ID: {model.user_id || model.id}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden px-4.5 py-2.5 bg-slate-50 border border-slate-250 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
          >
            <span>Actions Menu</span>
            <span className="text-[10px]">{showMobileMenu ? "▲" : "▼"}</span>
          </button>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden sm:flex flex-wrap gap-2.5">
          <button
            onClick={handleBack} 
            className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Back to List
          </button>
          
          <button
            onClick={handleOnHold}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            On Hold
          </button>
          <button
            onClick={handleDeactivate}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Deactivate
          </button>
          <button
            onClick={handleApprove}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
          >
            Approve Profile
          </button>
        </div>

        {/* Action Buttons - Mobile */}
        {showMobileMenu && (
          <div className="sm:hidden grid grid-cols-2 gap-2.5 bg-slate-50 p-4 border border-slate-100 rounded-2xl animate-fade-in">
            <button
              onClick={handleBack} 
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleOnHold}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              On Hold
            </button>
            <button
              onClick={handleDeactivate}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Deactivate
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Approve
            </button>
          </div>
        )}
      </div>

      {/* Profile Header Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          {model.image_url ? (
            <div
              className="relative cursor-pointer group shrink-0"
              onClick={() =>
                setModalImage({
                  isOpen: true,
                  url: model.image_url,
                  title: model.first_name
                    ? `${model.first_name} ${model.last_name || ""}`
                    : "Profile Picture",
                })
              }
              title="Click to view full image"
            >
              <img
                src={model.image_url}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-slate-50 shadow-xs group-hover:scale-[1.02] transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[9px] font-black bg-black/60 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  View Large
                </span>
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 border border-slate-200/50 flex items-center justify-center shadow-xs shrink-0">
              <span className="text-2xl font-black text-slate-400 uppercase select-none">
                {(model.first_name?.[0] || model.name?.[0] || "M").toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="text-center md:text-left flex-1 w-full space-y-1">
          <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
            {model.first_name || model.last_name
              ? `${model.first_name || ""} ${model.last_name || ""}`.trim()
              : model.name || "Model Profile"}
          </h1>
          <p className="text-xs font-bold text-slate-500">
            {model.profession || "No Profession Specified"}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2 justify-center md:justify-start">
            {model.email && (
              <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                📧 {model.email}
              </span>
            )}
            {model.phone && (
              <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                📱 {model.phone}
              </span>
            )}
            {model.city && (
              <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                📍 {model.city}
              </span>
            )}
            {model.age && (
              <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                🎂 {model.age} Years Old
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE DETAILS GRID - Single Scrollable Page */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column Section */}
        <div className="space-y-6">
          <Section title="Personal Information">
            <InfoItem label="First Name" value={model.first_name} />
            <InfoItem label="Last Name" value={model.last_name} />
            <InfoItem label="User Name" value={model.username} />
            <InfoItem label="Email" value={model.email} />
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

          <Section title="Lifestyle & Beliefs">
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

        {/* Right Column Section */}
        <div className="space-y-6">
          <Section title="Professional Details">
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

          <Section title="Skills & Interests Summary">
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

      {/* Rhythms, Interests & Prompts Section - Full Width */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6.5 space-y-6">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
          Life Rhythms & Passions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50/20">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>🎵</span> Life Rhythms
            </h4>
            <LifeRhythmsDisplay data={model.life_rhythms} />
          </div>

          <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50/20">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>🎯</span> Interests & Passions
            </h4>
            <InterestsDisplay 
              data={model.ways_i_spend_time || model.interests_categories || model.interests} 
            />
          </div>
        </div>
      </div>

      {/* Profile Prompts - Full Width */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6.5">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">
          Q&A Profile Prompts
        </h3>
        <ProfileQuestionsDisplay data={model} />
      </div>

      {/* Image Modal for viewing photo details */}
      <ImageModal
        isOpen={modalImage.isOpen}
        imageUrl={modalImage.url}
        title={modalImage.title}
        onClose={() => setModalImage({ isOpen: false, url: "", title: "" })}
      />
    </div>
  );
}
