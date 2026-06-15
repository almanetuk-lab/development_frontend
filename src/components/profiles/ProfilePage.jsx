import React, { useEffect, useRef, useState } from "react";
import { useUserProfile } from "../context/UseProfileContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../services/adminApi";
import profileViewApi from "../services/profileViewApi";

//  LifeRhythmsDisplay Component - Add kar diya
function LifeRhythmsDisplay({ data }) {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 italic">No life rhythms data available</p>
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
    <div className="space-y-6">
      {Object.entries(rhythmSections).map(([key, section]) => {
        const rhythmData = data[key];
        if (!rhythmData || (!rhythmData.single && !rhythmData.combination)) {
          return null;
        }

        return (
          <div
            key={key}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{section.icon}</span>
              <h4 className="text-lg font-semibold text-gray-800">
                {section.title}
              </h4>
            </div>

            <div className="ml-9">
              {rhythmData.combination ? (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Combination:
                  </p>
                  <p className="text-gray-900 font-medium text-lg mt-1">
                    {rhythmData.combination}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-gray-600 mt-2 italic">
                      "{rhythmData.statement}"
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700">Style:</p>
                  <p className="text-gray-900 font-medium text-lg mt-1">
                    {rhythmData.single}
                  </p>
                  {rhythmData.statement && (
                    <p className="text-gray-600 mt-2 italic">
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

export default function ProfilePage() {
  const { profile: currentUserProfile } = useUserProfile();
  const [displayProfile, setDisplayProfile] = useState(null);
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const hasTrackedRef = useRef(false);
  const [activeTab, setActiveTab] = useState(0); // 0: Basic, 1: Lifestyle, 2: Life Rhythms

  useEffect(() => {
    if (!currentUserProfile) return;

    const myId = currentUserProfile?.id || currentUserProfile?.user_id;
    const viewedId = userId;

    const isOwnProfile = !viewedId || myId == viewedId;
    setIsCurrentUser(isOwnProfile);

    if (!isOwnProfile && viewedId && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      (async () => {
        try {
          await profileViewApi.trackProfileView(viewedId);
        } catch (err) {
          console.error("❌ Profile view tracking failed:", err);
        }
      })();
    }

    // Data loading logic
    if (location.state?.userProfile) {
      setDisplayProfile(location.state.userProfile);
      setLoading(false);
      return;
    }

    if (!viewedId) {
      if (currentUserProfile) {
        setDisplayProfile(currentUserProfile);
        setLoading(false);
      } else {
        fetchCurrentUserData();
      }
      return;
    }

    fetchUserData(viewedId);
  }, [userId, location.state, currentUserProfile]);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      const currentUserId =
        currentUserProfile?.id || currentUserProfile?.user_id;
      if (currentUserId) {
        const response = await adminAPI.getUserDetails(currentUserId);
        if (response.data) {
          setDisplayProfile(response.data);
        } else {
          setDisplayProfile(currentUserProfile);
        }
      } else {
        setDisplayProfile(currentUserProfile);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setDisplayProfile(currentUserProfile);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserDetails(id);
      if (response.data) {
        setDisplayProfile(response.data);
      } else {
        setDisplayProfile({
          user_id: id,
          name: `User ${id}`,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setDisplayProfile({
        user_id: id,
        name: `User ${id}`,
        error: "Could not load profile",
      });
    } finally {
      setLoading(false);
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

  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (typeof value === "number" && isNaN(value)) return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === "object" && Object.keys(value).length === 0)
      return false;
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Profile not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Parse life rhythms data if it's a string
  const getLifeRhythmsData = () => {
    if (!displayProfile.life_rhythms) return null;

    if (typeof displayProfile.life_rhythms === "string") {
      try {
        return JSON.parse(displayProfile.life_rhythms);
      } catch (error) {
        console.error("Error parsing life rhythms:", error);
        return null;
      }
    }

    return displayProfile.life_rhythms;
  };

  const lifeRhythmsData = getLifeRhythmsData();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isCurrentUser ? "My Profile" : "User Profile"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {isCurrentUser && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-0 py-0 rounded"></span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              Go Back
            </button>

            {isCurrentUser && (
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                Edit Profile
              </button>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
          {displayProfile.image_url ? (
            <img
              src={displayProfile.image_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-4xl font-bold text-gray-400">
                {(
                  displayProfile.first_name?.[0] ||
                  displayProfile.name?.[0] ||
                  "U"
                ).toUpperCase()}
              </span>
            </div>
          )}

          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {displayProfile.first_name || displayProfile.last_name
                ? `${displayProfile.first_name || ""} ${displayProfile.last_name || ""
                  }`.trim()
                : displayProfile.name || "User"}
            </h1>

            {/* <p className="text-lg md:text-xl text-gray-600 mt-2">
              {displayProfile.headline ||
                displayProfile.profession ||
                "No Profession"}
            </p> */}

            <p className="text-lg md:text-xl text-gray-600 mt-2">
              {displayProfile.profession ||
                displayProfile.headline ||
                "No Profession"}
            </p>

            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {displayProfile.city && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  📍 {displayProfile.city}
                </span>
              )}

              {displayProfile.age && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {displayProfile.age} Age
                </span>
              )}

              {displayProfile.gender && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {displayProfile.gender}
                </span>
              )}

              {displayProfile.marital_status && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {displayProfile.marital_status}
                </span>
              )}
            </div>
          </div>
        </div>

        {/*  UPDATED TABS - NOW 3 PAGES */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 0
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab(0)}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  1
                </span>
                Basic Information
              </span>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 1
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab(1)}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  2
                </span>
                Lifestyle & Work
              </span>
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${activeTab === 2
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab(2)}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  3
                </span>
                Life Rhythms
              </span>
            </button>
          </div>
        </div>

        {/*  PAGE 1: BASIC INFORMATION */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Personal Information */}
            <div className="space-y-6">
              <Section title="Personal Information">
                <InfoItem
                  label="First Name"
                  value={displayProfile.first_name}
                />
                <InfoItem label="Last Name" value={displayProfile.last_name} />
                <InfoItem
                  label="User Name"
                  value={displayProfile.username}
                  type="UserName"
                />
                <InfoItem
                  label="Email"
                  value={displayProfile.email}
                  type="email"
                />
                <InfoItem label="Phone" value={displayProfile.phone} />
                {/* <InfoItem
                  label="Date of Birth"
                  value={formatDateForDisplay(displayProfile.dob)}
                /> */}

                <InfoItem
                  label="Date of Birth"
                  value={formatDateForDisplay(displayProfile.dob)}
                />

                <div>
                  <InfoItem label="Age" value={displayProfile.age} />

                  {displayProfile.ai_detected_at && (
                    <p className="text-xs text-indigo-600 mt-1">
                      AI estimated (±10% tolerance) •{" "}
                      {new Date(
                        displayProfile.ai_detected_at,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* <InfoItem label="Age" value={displayProfile.age} /> */}
                <InfoItem label="Gender" value={displayProfile.gender} />
                <InfoItem
                  label="Marital Status"
                  value={displayProfile.marital_status}
                />
                <InfoItem label="City" value={displayProfile.city} />
                <InfoItem label="Country" value={displayProfile.country} />
                <InfoItem label="State" value={displayProfile.state} />
                <InfoItem label="Pincode" value={displayProfile.pincode} />
                <InfoItem label="Address" value={displayProfile.address} full />
              </Section>

              {/* Personal Details */}
              <Section title="Personal Details">
                <InfoItem
                  label="Height in Inches"
                  value={displayProfile.height}
                />
                <InfoItem
                  label="Professional Identity"
                  value={displayProfile.professional_identity}
                />
                <InfoItem
                  label="Zodiac Sign"
                  value={displayProfile.zodiac_sign}
                />
                <InfoItem
                  label="Languages Spoken"
                  value={
                    Array.isArray(displayProfile.languages_spoken)
                      ? displayProfile.languages_spoken.join(", ")
                      : displayProfile.languages_spoken
                  }
                />
              </Section>
            </div>

            {/* RIGHT COLUMN - Professional & About */}
            <div className="space-y-6">
              <Section title="Professional Information">
                <InfoItem label="Headline" value={displayProfile.headline} />
                <InfoItem
                  label="Profession"
                  value={displayProfile.profession}
                />
                <InfoItem label="Company" value={displayProfile.company} />
                <InfoItem label="Position" value={displayProfile.position} />
                <InfoItem
                  label="Company Type"
                  value={displayProfile.company_type}
                />
                <InfoItem
                  label="Experience"
                  value={
                    hasValue(displayProfile.experience)
                      ? `${displayProfile.experience} years`
                      : ""
                  }
                />
                <InfoItem label="Education" value={displayProfile.education} />
                <InfoItem
                  label="Education Institution"
                  value={displayProfile.education_institution_name}
                />
              </Section>

              <Section title="About Me">
                <InfoItem label="About" value={displayProfile.about_me} full />
                <InfoItem
                  label="Hobbies"
                  value={
                    Array.isArray(displayProfile.hobbies)
                      ? displayProfile.hobbies.join(", ")
                      : displayProfile.hobbies
                  }
                />
              </Section>

              <Section title="Skills & Interests">
                <InfoItem
                  label="Skills"
                  value={
                    Array.isArray(displayProfile.skills)
                      ? displayProfile.skills.join(", ")
                      : typeof displayProfile.skills === "object"
                        ? Object.keys(displayProfile.skills || {}).join(", ")
                        : displayProfile.skills
                  }
                  full
                />
                <InfoItem
                  label="Interests"
                  value={
                    Array.isArray(displayProfile.interests)
                      ? displayProfile.interests.join(", ")
                      : displayProfile.interests
                  }
                  full
                />
              </Section>
            </div>
          </div>
        )}

        {/*  PAGE 2: LIFESTYLE & WORK */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN - Lifestyle */}
            <div className="space-y-6">
              <Section title="Lifestyle">
                <InfoItem
                  label="Self Expression"
                  value={displayProfile.self_expression}
                />
                <InfoItem
                  label="Free Time Style"
                  value={displayProfile.freetime_style}
                />
                <InfoItem
                  label="Health Activity Level"
                  value={displayProfile.health_activity_level}
                />
                <InfoItem
                  label="Pets Preference"
                  value={displayProfile.pets_preference}
                />
                <InfoItem
                  label="Religious Belief"
                  value={displayProfile.religious_belief}
                />
                <InfoItem label="Smoking" value={displayProfile.smoking} />
                <InfoItem label="Drinking" value={displayProfile.drinking} />
              </Section>

              <Section title="Relationship Preferences">
                <InfoItem
                  label="Interested In"
                  value={displayProfile.interested_in}
                />
                <InfoItem
                  label="Relationship Goal"
                  value={displayProfile.relationship_goal}
                />
                <InfoItem
                  label="Children Preference"
                  value={displayProfile.children_preference}
                />
              </Section>
            </div>

            {/* RIGHT COLUMN - Work & Relationships */}
            <div className="space-y-6">
              <Section title="Work Style">
                <InfoItem
                  label="Work Environment"
                  value={displayProfile.work_environment}
                />
                <InfoItem
                  label="Interaction Style"
                  value={displayProfile.interaction_style}
                />
                <InfoItem
                  label="Work Rhythm"
                  value={displayProfile.work_rhythm}
                />
                <InfoItem
                  label="Career Decision Style"
                  value={displayProfile.career_decision_style}
                />
                <InfoItem
                  label="Work Demand Response"
                  value={displayProfile.work_demand_response}
                />
              </Section>
              {/* 
              <Section title="Relationship Styles">
                <InfoItem
                  label="Love Language"
                  value={
                    Array.isArray(displayProfile.love_language_affection)
                      ? displayProfile.love_language_affection.join(", ")
                      : displayProfile.love_language_affection
                  }
                /> */}

              <Section title="Relationship Styles">
                <InfoItem
                  label="Love Language"
                  value={displayProfile.love_language_affection}
                />

                <InfoItem
                  label="Preference of Closeness"
                  value={displayProfile.preference_of_closeness}
                />
                <InfoItem
                  label="Approach to Physical Closeness"
                  value={displayProfile.approach_to_physical_closeness}
                />
                <InfoItem
                  label="Relationship Values"
                  value={displayProfile.relationship_values}
                />
                <InfoItem
                  label="Values in Others"
                  value={displayProfile.values_in_others}
                />
                <InfoItem
                  label="Relationship Pace"
                  value={displayProfile.relationship_pace}
                />
              </Section>
            </div>
          </div>
        )}

        {/*  NEW PAGE 3: LIFE RHYTHMS & INTERESTS */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎵</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Life Rhythms & Interests
                  </h2>
                  <p className="text-gray-600">
                    Your personal rhythms and passions
                  </p>
                </div>
              </div>
            </div>

            {/*  50-50 Layout for Life Rhythms and Interests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT SIDE - Life Rhythms (50%) */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎵</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Life Rhythms
                    </h3>
                  </div>

                  {lifeRhythmsData ? (
                    <LifeRhythmsDisplay data={lifeRhythmsData} />
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl">🎵</span>
                      </div>
                      <p className="text-gray-500 italic">
                        No life rhythms data available
                      </p>
                      {isCurrentUser && (
                        <button
                          onClick={() => navigate("/edit-profile")}
                          className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
                        >
                          Add Life Rhythms
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE - Interests (50%) */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">🎯</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Interests & Passions
                    </h3>
                  </div>

                  {/*  Interests Categories Display (Checkbox wala) */}
                  {displayProfile.ways_i_spend_time ? (
                    <div>
                      {/* Parse JSON if it's a string */}
                      {(() => {
                        let interestsData;
                        try {
                          interestsData =
                            typeof displayProfile.ways_i_spend_time === "string"
                              ? JSON.parse(displayProfile.ways_i_spend_time)
                              : displayProfile.ways_i_spend_time;
                        } catch (error) {
                          console.error(
                            "Error parsing ways_i_spend_time:",
                            error,
                          );
                          interestsData = {};
                        }

                        if (
                          !interestsData ||
                          typeof interestsData !== "object" ||
                          Object.keys(interestsData).length === 0
                        ) {
                          return (
                            <div className="text-center py-8">
                              <p className="text-gray-500 italic">
                                No interests categories added yet
                              </p>
                            </div>
                          );
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

                        return (
                          <div className="space-y-6">
                            {Object.entries(interestsData).map(
                              ([category, items]) => {
                                const config = categoriesConfig[category];
                                if (
                                  !items ||
                                  !Array.isArray(items) ||
                                  items.length === 0
                                )
                                  return null;

                                return (
                                  <div key={category} className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-gray-700">
                                        {config?.label ||
                                          category
                                            .replace("_", " ")
                                            .toUpperCase()}
                                      </h4>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {items.length} selected
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {items.map((interest, index) => (
                                        <span
                                          key={index}
                                          className={`px-3 py-1.5 text-sm rounded-full ${config?.color ||
                                            "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                          {interest}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            )}

                            {/* Total Count */}
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">
                                  Total Interests:
                                </span>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                                  {Object.values(interestsData).flat().length}{" "}
                                  interests
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div>
                      {displayProfile.interests ? (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              let interestsArray = [];

                              // Handle different formats
                              if (Array.isArray(displayProfile.interests)) {
                                interestsArray = displayProfile.interests;
                              } else if (
                                typeof displayProfile.interests === "string"
                              ) {
                                // Split comma separated string
                                interestsArray = displayProfile.interests
                                  .split(",")
                                  .map((item) => item.trim())
                                  .filter((item) => item !== "");
                              }

                              if (interestsArray.length === 0) {
                                return (
                                  <div className="text-center py-8">
                                    <p className="text-gray-500 italic">
                                      No interests added yet
                                    </p>
                                  </div>
                                );
                              }

                              return interestsArray.map((interest, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-full"
                                >
                                  {interest}
                                </span>
                              ));
                            })()}
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">
                                Total Interests:
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                                {(() => {
                                  if (Array.isArray(displayProfile.interests)) {
                                    return displayProfile.interests.length;
                                  } else if (
                                    typeof displayProfile.interests === "string"
                                  ) {
                                    return displayProfile.interests
                                      .split(",")
                                      .filter((i) => i.trim()).length;
                                  }
                                  return 0;
                                })()}{" "}
                                interests
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl">🎯</span>
                          </div>
                          <p className="text-gray-500 italic">
                            No interests added yet
                          </p>
                          {isCurrentUser && (
                            <button
                              onClick={() => navigate("/edit-profile")}
                              className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                            >
                              Add Interests
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/*  NEW: Profile Questions Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">💭</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Get to Know Me
                    </h3>
                  </div>

                  {(() => {
                    //  IMPORTANT: Display complete profile data for debugging
                    console.log(
                      "🔍 DEBUG - Complete displayProfile object:",
                      displayProfile,
                    );
                    console.log(
                      "🔍 displayProfile.prompts:",
                      displayProfile?.prompts,
                    );
                    console.log(
                      "🔍 displayProfile.prompts['question-key']:",
                      displayProfile?.prompts?.["question-key"],
                    );
                    console.log(
                      "🔍 displayProfile.profile_prompts:",
                      displayProfile?.profile_prompts,
                    );

                    //  FIXED: Extract profile questions with priority order
                    let profileQuestions = {};

                    // Priority 1: Check prompts["question-key"] (main source)
                    if (displayProfile?.prompts?.["question-key"]) {
                      console.log("✅ Using prompts['question-key']");
                      profileQuestions = displayProfile.prompts["question-key"];
                    }
                    // Priority 2: Check profile_prompts array
                    else if (
                      Array.isArray(displayProfile?.profile_prompts) &&
                      displayProfile.profile_prompts.length > 0
                    ) {
                      console.log("✅ Using profile_prompts array");
                      displayProfile.profile_prompts.forEach((prompt) => {
                        if (prompt?.question_key && prompt?.answer) {
                          profileQuestions[prompt.question_key] = prompt.answer;
                        }
                      });
                    }
                    // Priority 3: Check profile_questions
                    else if (
                      displayProfile?.profile_questions &&
                      typeof displayProfile.profile_questions === "object"
                    ) {
                      console.log("✅ Using profile_questions");
                      profileQuestions = displayProfile.profile_questions;
                    }
                    // Priority 4: Check prompts directly
                    else if (
                      displayProfile?.prompts &&
                      typeof displayProfile.prompts === "object"
                    ) {
                      console.log("✅ Using prompts directly");
                      profileQuestions = displayProfile.prompts;
                    }

                    console.log(
                      "🎯 Extracted profileQuestions:",
                      profileQuestions,
                    );
                    console.log(
                      "🎯 Keys found:",
                      Object.keys(profileQuestions),
                    );

                    // Define questions with labels (same as EditProfile)
                    const questionsConfig = {
                      small_habit: {
                        label: "A small habit that says a lot about me…",
                        icon: "✨",
                      },
                      life_goal: {
                        label:
                          "What I'm genuinely trying to build in my life right now…",
                        icon: "🏗️",
                      },
                      home_moment: {
                        label: "A moment that felt like home to me…",
                        icon: "🏠",
                      },
                      belief_that_shapes_life: {
                        label: "One belief that quietly shapes how I live…",
                        icon: "🌟",
                      },
                      appreciate_people: {
                        label: "Something I always appreciate in people…",
                        icon: "👥",
                      },
                      if_someone_knows_me: {
                        label: "If someone really knows me, they know…",
                        icon: "🤔",
                      },
                      what_makes_me_understood: {
                        label: "What makes me feel truly understood…",
                        icon: "💬",
                      },
                      usual_day: {
                        label: "How my usual day looks like…",
                        icon: "📅",
                      },
                    };

                    // Check if we have any data
                    if (
                      !profileQuestions ||
                      Object.keys(profileQuestions).length === 0
                    ) {
                      return (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl">💭</span>
                          </div>
                          <p className="text-gray-500 italic mb-3">
                            No profile questions answered yet
                          </p>
                          {isCurrentUser && (
                            <button
                              onClick={() => navigate("/edit-profile")}
                              className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                            >
                              Answer Questions
                            </button>
                          )}
                        </div>
                      );
                    }

                    //  Display ALL questions, even unanswered ones (with placeholder)
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">
                            Answered{" "}
                            {
                              Object.keys(profileQuestions).filter((key) =>
                                profileQuestions[key]?.trim(),
                              ).length
                            }{" "}
                            of {Object.keys(questionsConfig).length} questions
                          </p>
                          {isCurrentUser && (
                            <button
                              onClick={() => navigate("/edit-profile")}
                              className="text-sm text-green-600 hover:text-green-800 font-medium"
                            >
                              Edit Answers
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {Object.entries(questionsConfig).map(
                            ([questionKey, config]) => {
                              const answer =
                                profileQuestions[questionKey] || "";
                              const hasAnswer = answer && answer.trim() !== "";

                              return (
                                <div
                                  key={questionKey}
                                  className={`border-l-4 ${hasAnswer ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"} pl-4 py-3 rounded-r-lg`}
                                >
                                  <div className="flex items-start gap-2 mb-2">
                                    <span className="text-lg">
                                      {config.icon}
                                    </span>
                                    <h4 className="font-medium text-gray-800 text-sm">
                                      {config.label}
                                    </h4>
                                  </div>

                                  {hasAnswer ? (
                                    <p className="text-gray-600 text-sm pl-7">
                                      {answer}
                                    </p>
                                  ) : (
                                    <p className="text-gray-400 text-sm pl-7 italic">
                                      Not answered yet
                                    </p>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/*  PAGE 4: AI COMPATIBILITY */}
        {activeTab === 3 && !isCurrentUser && (
          <AICompatibilityDisplay targetUserId={displayProfile.user_id || displayProfile.id} />
        )}

        {/*  UPDATED NAVIGATION BUTTONS FOR 3 OR 4 PAGES */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${activeTab === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
            onClick={() => setActiveTab(activeTab - 1)}
            disabled={activeTab === 0}
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {(isCurrentUser ? [0, 1, 2] : [0, 1, 2, 3]).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 rounded-lg text-sm ${activeTab === page
                    ? "bg-indigo-100 text-indigo-600 font-medium"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                onClick={() => setActiveTab(page)}
              >
                {page === 0 ? "Page 1" : page === 1 ? "Page 2" : page === 2 ? "Page 3" : "AI Compatibility"}
              </button>
            ))}
          </div>

          <button
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${activeTab === (isCurrentUser ? 2 : 3)
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            onClick={() => setActiveTab(activeTab + 1)}
            disabled={activeTab === (isCurrentUser ? 2 : 3)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

//  InfoItem Component
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
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-400 italic text-sm">Not provided</p>
      </div>
    );
  }

  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      {type === "email" ? (
        <a
          href={`mailto:${displayValue}`}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          {displayValue}
        </a>
      ) : (
        <p className="text-gray-700 text-sm">
          {Array.isArray(displayValue) ? displayValue.join(", ") : displayValue}
        </p>
      )}
    </div>
  );
}

//  Section Component
function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

// ==================== PREMIUM AI COMPATIBILITY COMPONENTS ====================

function AICompatibilityDisplay({ targetUserId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAICompatibilityReport(targetUserId);
        setReport(data);
      } catch (err) {
        console.error("Error fetching compatibility:", err);
        setError("Failed to generate AI compatibility report. Please ensure both profiles have enough detail.");
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) {
      fetchReport();
    }
  }, [targetUserId]);

  if (loading) {
    return (
      <div className="bg-white border border-purple-100 rounded-2xl p-10 text-center shadow-lg max-w-4xl mx-auto my-6">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-purple-600 animate-spin"></div>
          <div className="absolute inset-2 bg-purple-50 rounded-full flex items-center justify-center">
            <span className="text-2xl animate-bounce">🧬</span>
          </div>
        </div>
        <h4 className="text-xl font-bold text-purple-900 mb-2">Analyzing Psychological Compatibility...</h4>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Our advanced matching engine is comparing emotional styles, social energies, ambitions, and relationship goals to estimate alignment.
        </p>
        <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-2xl p-10 text-center shadow-md max-w-4xl mx-auto my-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ⚠️
        </div>
        <h4 className="text-lg font-bold text-red-800 mb-2">Analysis Deferred</h4>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            getAICompatibilityReport(targetUserId)
              .then(data => { setReport(data); setLoading(false); })
              .catch(err => { setError("Failed to generate AI compatibility report."); setLoading(false); });
          }}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
        >
          Re-Analyze Profiles
        </button>
      </div>
    );
  }

  if (!report) return null;

  const scoreList = [
    { label: "💖 Emotional Compatibility", val: report.scores?.emotional_compatibility, color: "from-pink-500 to-rose-500" },
    { label: "⏱️ Lifestyle Compatibility", val: report.scores?.lifestyle_compatibility, color: "from-emerald-500 to-teal-500" },
    { label: "💬 Communication Rhythm", val: report.scores?.communication_compatibility, color: "from-blue-500 to-indigo-500" },
    { label: "🌟 Relationship Alignment", val: report.scores?.relationship_alignment, color: "from-purple-500 to-indigo-600" },
    { label: "💼 Professional Alignment", val: report.scores?.professional_alignment, color: "from-amber-500 to-orange-500" },
    { label: "🌱 Long-Term Potential", val: report.scores?.long_term_potential, color: "from-teal-500 to-emerald-600" },
    { label: "👥 Social Compatibility", val: report.scores?.social_compatibility, color: "from-sky-500 to-indigo-500" },
    { label: "💎 Core Values Alignment", val: report.scores?.values_alignment, color: "from-violet-500 to-purple-600" },
    { label: "🔥 Attraction Potential", val: report.scores?.attraction_potential, color: "from-rose-500 to-red-500" }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto my-6 animate-[fadeIn_0.5s_ease-out]">
      {/* 1. Psychological Hero Dashboard */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Compatibility Spin Ring */}
          <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-4 border-purple-500/20 bg-purple-950/30 shadow-2xl flex-shrink-0">
            <div className="text-center z-10">
              <span className="block text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200">
                {report.overall_compatibility}%
              </span>
              <span className="text-[10px] text-purple-300 uppercase tracking-widest font-bold">Match Score</span>
            </div>
            {/* Spinning glowing track */}
            <div className="absolute inset-0 border-t-4 border-pink-400 rounded-full animate-spin [animation-duration:4s]"></div>
            <div className="absolute inset-1 border-r-4 border-indigo-400 rounded-full animate-spin [animation-duration:8s] reverse"></div>
          </div>

          {/* Dynamic Typology Header */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <span className="px-3.5 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-semibold text-purple-300 shadow-sm flex items-center gap-1">
                ✨ {report.compatibility_type || "Intentional Match"}
              </span>
              <span className="px-3.5 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300 shadow-sm">
                🤝 {report.relationship_dynamic || "Growth Connection"}
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Psychological Alignment Interpretation
            </h3>
            
            <p className="text-slate-300 mt-4 text-sm md:text-base leading-relaxed italic border-l-4 border-purple-500/50 pl-4 py-1">
              "{report.ai_match_summary}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. Core Compatibility Dimension Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Scores Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-xl">📊</span> Compatibility Score Card
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {scoreList.map((sc, i) => (
              <ScoreProgressBar key={i} label={sc.label} score={sc.val || 70} color={sc.color} />
            ))}
          </div>
        </div>

        {/* Dynamic Strengths & Challenges List */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            {/* Strengths */}
            <div>
              <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>✔</span> Key Alignment Strengths
              </h4>
              <ul className="space-y-3">
                {report.strengths?.map((str, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                    <span className="text-emerald-500 font-bold mt-0.5">✦</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>⚡</span> Opportunities for Balance
              </h4>
              <ul className="space-y-3">
                {report.possible_challenges?.map((ch, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2 bg-purple-50/30 p-2.5 rounded-xl border border-purple-100/30">
                    <span className="text-purple-400 font-bold mt-0.5">✥</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Connection Conversational Starters */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-100/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <h4 className="text-lg font-bold text-purple-950 mb-3 flex items-center gap-2">
          <span>💬</span> AI-Generated Conversation Starters
        </h4>
        <p className="text-sm text-purple-800/80 mb-6 max-w-2xl">
          Start a deep, intentional chat based on your shared personality overlaps, intellectual spaces, and emotional rhythms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.conversation_starters?.map((starter, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-purple-100/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(starter);
                alert("Starter copied to clipboard!");
              }}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-purple-100/40 rounded-bl-full flex items-start justify-end p-2 transition-all group-hover:bg-purple-200/50">
                <span className="text-xs text-purple-600">📋</span>
              </div>
              
              <div className="pr-4 mb-4">
                <span className="text-xs text-indigo-500 font-bold uppercase tracking-widest block mb-2">Icebreaker {idx + 1}</span>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  "{starter}"
                </p>
              </div>

              <div className="text-[10px] text-slate-400 group-hover:text-purple-600 transition-colors">
                Click to copy starter
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreProgressBar({ label, score, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-800 font-bold">{score}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div 
          className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
