
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/api";

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("🚫 No token found - clearing profile");
      clearProfile();
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Loading FRESH profile data from API...");
      const data = await getUserProfile();
      console.log("📊 API response:", data);

      let userProfile = data?.data || data;

      if (userProfile) {
        console.log("✅ User profile received:", userProfile);

        //   Remove mixed format
        let cleanPrompts = {};
        
        if (userProfile.prompts && typeof userProfile.prompts === "object") {
          console.log("🔍 Cleaning prompts:", userProfile.prompts);
          
          for (const [key, value] of Object.entries(userProfile.prompts)) {
            // Skip 'question-key' wrapper
            if (key !== "question-key") {
              cleanPrompts[key] = value;
            }
          }
          
          console.log("✅ Cleaned prompts:", cleanPrompts);
        }

        // Parse ways_i_spend_time
        let parsedWaysISpendTime = {};
        if (userProfile.ways_i_spend_time) {
          if (typeof userProfile.ways_i_spend_time === 'string') {
            try {
              parsedWaysISpendTime = JSON.parse(userProfile.ways_i_spend_time);
            } catch (error) {
              console.error("Error parsing ways_i_spend_time:", error);
              parsedWaysISpendTime = {};
            }
          } else if (typeof userProfile.ways_i_spend_time === 'object') {
            parsedWaysISpendTime = userProfile.ways_i_spend_time;
          }
        }

        // Create clean profile
        const completeProfile = {
          // Personal Information
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
          full_name: userProfile.full_name || "",
          username: userProfile.username || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          gender: userProfile.gender || "",
          marital_status: userProfile.marital_status || "",
          city: userProfile.city || "",
          country: userProfile.country || "",
          state: userProfile.state || "",
          pincode: userProfile.pincode || "",
          address: userProfile.address || "",
          dob: userProfile.dob || "",
          age: userProfile.age || "",
          height: userProfile.height || "",
          professional_identity: userProfile.professional_identity || "",
          zodiac_sign: userProfile.zodiac_sign || "",
          languages_spoken: Array.isArray(userProfile.languages_spoken)
            ? userProfile.languages_spoken
            : userProfile.languages_spoken || [],
          profession: userProfile.profession || "",
          company: userProfile.company || "",
          position: userProfile.position || "",
          company_type: userProfile.company_type || "",
          experience: userProfile.experience || "",
          education: userProfile.education || "",
          headline: userProfile.headline || "",
          education_institution_name: userProfile.education_institution_name || "",
          
          //  CLEAN PROMPTS
          prompts: cleanPrompts,
          
          work_environment: userProfile.work_environment || "",
          interaction_style: userProfile.interaction_style || "",
          work_rhythm: userProfile.work_rhythm || "",
          career_decision_style: userProfile.career_decision_style || "",
          work_demand_response: userProfile.work_demand_response || "",
          about_me: userProfile.about_me || "",
          skills: Array.isArray(userProfile.skills)
            ? userProfile.skills
            : userProfile.skills || [],
          hobbies: Array.isArray(userProfile.hobbies)
            ? userProfile.hobbies
            : userProfile.hobbies || [],
          interests: Array.isArray(userProfile.interests)
            ? userProfile.interests
            : userProfile.interests || [],
          self_expression: userProfile.self_expression || "",
          freetime_style: userProfile.freetime_style || "",
          health_activity_level: userProfile.health_activity_level || "",
          pets_preference: userProfile.pets_preference || "",
          religious_belief: userProfile.religious_belief || "",
          smoking: userProfile.smoking || "",
          drinking: userProfile.drinking || "",
          interested_in: userProfile.interested_in || "",
          relationship_goal: userProfile.relationship_goal || "",
          children_preference: userProfile.children_preference || "",

          love_language_affection: userProfile.love_language_affection || "",

          // love_language_affection: Array.isArray(userProfile.love_language_affection)
          //   ? userProfile.love_language_affection
          //   : userProfile.love_language_affection || [],

          preference_of_closeness: userProfile.preference_of_closeness || "",
          approach_to_physical_closeness: userProfile.approach_to_physical_closeness || "",
          relationship_values: userProfile.relationship_values || "",
          values_in_others: userProfile.values_in_others || "",
          relationship_pace: userProfile.relationship_pace || "",
          life_rhythms: userProfile.life_rhythms || {},
          ways_i_spend_time: parsedWaysISpendTime,
          id: userProfile.id || null,
          user_id: userProfile.user_id || null,
          is_submitted: userProfile.is_submitted || false,
          profile_picture_url: userProfile.profile_picture_url || "",
          profilePhoto: userProfile.profilePhoto || "",
          image_url: userProfile.image_url || "",
          intent_tags: userProfile.intent_tags || null,
          last_updated: new Date().toISOString(),
        };

        console.log("✅ Setting clean profile:", completeProfile);
        setProfile(completeProfile);
        localStorage.setItem("user_id", completeProfile.user_id);
        localStorage.setItem("userProfile", JSON.stringify(completeProfile));
      } else {
        console.warn("⚠️ No user profile data");
        loadCachedProfile();
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      loadCachedProfile();
    } finally {
      setLoading(false);
    }
  };

  const loadCachedProfile = () => {
    const cachedUser = localStorage.getItem("userProfile");
    if (cachedUser) {
      try {
        const cachedProfile = JSON.parse(cachedUser);
        console.log("📂 Using cached profile data");
        setProfile(cachedProfile);
        localStorage.setItem("user_id", cachedProfile.user_id);
      } catch (parseError) {
        console.error("❌ Error parsing cached data:", parseError);
        localStorage.removeItem("userProfile");
        setProfile(null);
      }
    } else {
      console.log("📭 No cached data available");
      setProfile(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      loadProfile();
    } else {
      console.log("⏸️ No token - clearing profile data");
      clearProfile();
      setLoading(false);
    }
  }, []);

  const updateProfile = (newProfileData) => {
    console.log("🔄 Updating profile with:", newProfileData);
    
    const updatedProfile = {
      ...profile,
      ...newProfileData,
      //       life_rhythms: newProfileData.life_rhythms || profile?.life_rhythms || {},
      // ways_i_spend_time: newProfileData.ways_i_spend_time || profile?.ways_i_spend_time || {},
      // last_updated: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };

    console.log("✅ Final updated profile:", updatedProfile);
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
  };

  const clearProfile = () => {
    console.log("🚪 Clearing ALL user data");
    setProfile(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("user_id");
  };

  const refreshProfile = () => {
    console.log("🔄 Manually refreshing profile");
    setLoading(true);
    loadProfile();
  };

  const hasCompleteProfile = () => {
    return (
      profile &&
      profile.is_submitted &&
      (profile.first_name || profile.full_name) &&
      profile.email
    );
  };

  const value = {
    profile,
    updateProfile,
    clearProfile,
    refreshProfile,
    loading,
    hasCompleteProfile: hasCompleteProfile(),
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
// export default UserProfileContext;













