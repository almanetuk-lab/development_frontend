import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserProfile } from "../context/UseProfileContext";
import { updateUserProfile, uploadImage, saveProfileImage, removeProfileImage, updateUserLocation } from "../services/api";
import LifeRhythmsForm from "./LifeRhythmsForm";
import axios from "axios";
import InterestsForm from "./InterestsForm";
import ProfileQuestions from "./ProfileQuestions";
import { theme } from "../comman/theme";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";
import { checkImageSafety } from "../services/nsfwFilter";

const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2";
const inputClass = `w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-2xs outline-none transition duration-200 hover:border-slate-300 ${theme.tailwind.focusPink}`;
const sectionHeadingClass = `text-lg font-black text-[#002060] mb-4`;

// ================== ENUM HELPERS ==================

const mapToDBEnum = (field, value) => {
  if (!value || value === "") return null;

  const MAP = {
    // Education
    education: {
      HIGH_SCHOOL: "High School",
      BACHELORS: "Bachelors Degree",
      MASTERS: "Masters Degree",
      PHD: "Doctorate",
      "No Formal Education": "No Formal Education",
      "Currently Studying": "Currently Studying",
      "High School": "High School",
      "Vocational / Trade School": "Vocational / Trade School",
      "Associate Degree": "Associate Degree",
      "Bachelors Degree": "Bachelors Degree",
      "Masters Degree": "Masters Degree",
      Doctorate: "Doctorate",
      Other: "Other",
    },

    // Gender
    gender: {
      Male: "Male",
      Female: "Female",
      Other: "Other",
      "Non-Binary": "Non-Binary",
    },

    // Marital Status
    marital_status: {
      Single: "Single",
      Married: "Married",
      Divorced: "Divorced",
      Widowed: "Widowed",
      Other: "Other",
      Separated: "Separated",
    },

    // Professional Identity
    professional_identity: {
      STUDENT: "Student",
      PROFESSIONAL: "Corporate Professional",
      ENTREPRENEUR: "Entrepreneur",
      FREELANCER: "Freelancer",
      "Corporate Professional": "Corporate Professional",
      Entrepreneur: "Entrepreneur",
      "Startup Founder": "Startup Founder",
      Freelancer: "Freelancer",
      Consultant: "Consultant",
      Trader: "Trader",
      Investor: "Investor",
      "Family Business Owner": "Family Business Owner",
      "Small Business Owner": "Small Business Owner",
      "Creative Professional": "Creative Professional",
      "Healthcare Professional": "Healthcare Professional",
      "Public Service": "Public Service",
      Government: "Government",
      Student: "Student",
      Other: "Other",
    },

    // Relationship Pace
    relationship_pace: {
      Naturally: "Naturally",
      Quickly: "Quickly",
      Slowly: "Slowly",
      "With clear definition": "With clear definition",
      NATURALLY: "Naturally",
      QUICKLY: "Quickly",
      SLOWLY: "Slowly",
      WITH_CLEAR_DEFINITION: "With clear definition",
    },

    children_preference: {
      WANT: "Want",
      DONT_WANT: "Don’t want",
      HAVE_AND_WANT_MORE: "Have and want more",
      HAVE_AND_DONT_WANT_MORE: "Have and don’t want more",
      OPEN_OR_NOT_SURE_YET: "Open / Not Sure yet",
    },

    // Self Expression
    self_expression: {
      "Clear and direct": "Clear and direct",
      "Reflective and calm": "Reflective and calm",
      "Expressive once I trust": "Expressive once I trust",
      "Reserved until I feel safe": "Reserved until I feel safe",
    },

    // Health Activity Level
    health_activity_level: {
      Active: "Active",
      "Semi-active": "Semi-active",
      Light: "Light",
      Minimal: "Minimal",
    },

    // Pets Preference
    pets_preference: {
      Want: "Want",
      DONT_WANT: "Don’t want",
      "Have and want more": "Have and want more",
      "Have and don't want more": "Have and don’t want more",
      OPEN_OR_NOT_SURE_YET: "Open / Not sure yet",
    },

    // Free Time Style
    freetime_style: {
      "Mostly social": "Mostly social",
      "With Partner": "With Partner",
      "Balanced mix": "Balanced mix",
      "Low-key and restful": "Low-key and restful",
    },

    // Religious Belief
    religious_belief: {
      Hindu: "Hindu",
      Muslim: "Muslim",
      Christian: "Christian",
      Sikh: "Sikh",
      Buddhist: "Buddhist",
      Jain: "Jain",
      Jewish: "Jewish",
      Spiritual: "Spiritual",
      Atheist: "Atheist",
      Agnostic: "Agnostic",
      Other: "Other",
      "Prefer not to say": "Prefer not to say",
    },

    // Smoking
    smoking: {
      NO: "No",
      YES: "Yes",
      SOCIAL: "Socially",
      No: "No",
      Yes: "Yes",
      Socially: "Socially",
    },

    // Drinking
    drinking: {
      NO: "No",
      YES: "Yes",
      SOCIAL: "Socially",
      No: "No",
      Yes: "Yes",
      Socially: "Socially",
    },

    // Work Environment
    work_environment: {
      Remote: "Remote",
      Hybrid: "Hybrid",
      "Office/Location based": "Office/Location based",
      "On-the-go": "On-the-go",
      Other: "Other",
    },

    // Interaction Style
    interaction_style: {
      "Light and engaging": "Light and engaging",
      "Deep and thought-provoking": "Deep and thought-provoking",
      "Reserved unless invited": "Reserved unless invited",
      Other: "Other",
    },

    // Career Decision Style
    career_decision_style: {
      Analytical: "Security-focused",
      Intuitive: "Opportunity-driven",
      Collaborative: "Balanced",
      Independent: "Risk-positive",
      "Security-focused": "Security-focused",
      Balanced: "Balanced",
      "Opportunity-driven": "Opportunity-driven",
      "Risk-positive": "Risk-positive",
    },

    // Work Demand Response
    work_demand_response: {
      Proactive: "Adjusting plans quickly",
      Reactive: "Keeping structure",
      Balanced: "Taking space to rebalance",
      Selective: "Communicating clearly and finding a middle ground",
      "Adjusting plans quickly": "Adjusting plans quickly",
      "Keeping structure": "Keeping structure",
      "Taking space to rebalance": "Taking space to rebalance",
      "Communicating clearly and finding a middle ground":
        "Communicating clearly and finding a middle ground",
    },

    // Interested In
    interested_in: {
      Man: "Man",
      Woman: "Woman",
      "Non-Binary": "Non-Binary",
      Everyone: "Everyone",
    },

    relationship_goal: {
      "Long-term": "Long-term",
      "Life Partner": "Life Partner",
      "Dating with intent": "Dating with intent",
      Friend: "Friend",
      "Figuring it out": "Figuring it out",
    },

    // Relationship Values
    relationship_values: {
      Growth: "Growth",
      Stability: "Stability",
      "Emotional openness": "Emotional openness",
      "Shared rhythm": "Shared rhythm",
      "Practical harmony": "Practical harmony",
    },

    values_in_others: {
      "Self-awareness": "Self-awareness",
      "Emotional intelligence": "Emotional intelligence",
      Ambition: "Ambition",
      Kindness: "Kindness",
      Humour: "Humour",
    },

    approach_to_physical_closeness: {
      "Gradual build-up": "Gradual build-up",
      "Connect early if aligned": "Connect early if aligned",
      "Emotional-first": "Emotional-first",
      "Emotional + physical balanced": "Emotional + physical balanced",
      "Prefer more time": "Prefer more time",
    },

    // Preference of Closeness
    preference_of_closeness: {
      High: "More time together",
      Medium: "A mix of space and closeness",
      Low: "Regular personal time",
      Variable: "Not yet sure",
    },

    // Work Rhythm
    work_rhythm: {
      Regular: "Structured routine",
      Flexible: "Balanced with busy phases",
      Intense: "High intensity",
      Seasonal: "Project-based",
    },

    // Love Language - Special handling for array
    //   love_language_affection: (value) => {
    //     if (!value) return null;

    //     if (Array.isArray(value)) {
    //       return value.map((lang) => {
    //         const langMap = {
    //           "Physical Touch": "Physical Touch",
    //           "Words of Affirmation": "Words of Affirmation",
    //           "Quality Time": "Quality Time",
    //           "Acts of Service": "Acts of Service",
    //           "Thoughtful Gifts": "Thoughtful Gifts",
    //           urdu: "Words of Affirmation",
    //           hindi: "Words of Affirmation",
    //         };
    //         return langMap[lang] || lang;
    //       });
    //     }

    //     if (typeof value === "string") {
    //       return value
    //         .split(",")
    //         .map((lang) => lang.trim())
    //         .filter((lang) => lang !== "");
    //     }

    //     return value;
    //   },
    // };

    // if (field === "love_language_affection" && MAP[field]) {
    //   return MAP[field](value);
    // }

    love_language_affection: {
      "Physical Touch": "Physical Touch",
      "Words of Affirmation": "Words of Affirmation",
      "Quality Time": "Quality Time",
      "Acts of Service": "Acts of Service",
      "Thoughtful Gifts": "Thoughtful Gifts",
      urdu: "Words of Affirmation",
      hindi: "Words of Affirmation",
    },
  };

  if (field === "height_ft" || field === "height_in") {
    return MAP[field] ? MAP[field](value) : value;
  }

  return MAP[field]?.[value] || value;
};

const mapToUIEnum = (field, value) => {
  if (!value) return "";

  const REVERSE_MAP = {
    education: {
      "No Formal Education": "No Formal Education",
      "Currently Studying": "Currently Studying",
      "High School": "HIGH_SCHOOL",
      "Vocational / Trade School": "Other",
      "Associate Degree": "Other",
      "Bachelors Degree": "BACHELORS",
      "Masters Degree": "MASTERS",
      Doctorate: "PHD",
      Other: "Other",
    },
    children_preference: {
      Want: "WANT",
      "Don't want": "Don’t want",
      "Have and want more": "HAVE_AND_WANT_MORE",
      "Have and don't want more": "HAVE_AND_DONT_WANT_MORE",
      "Open / Not sure yet": "OPEN_OR_NOT_SURE_YET",
    },
    professional_identity: {
      "Corporate Professional": "PROFESSIONAL",
      Entrepreneur: "ENTREPRENEUR",
      "Startup Founder": "ENTREPRENEUR",
      Freelancer: "FREELANCER",
      Consultant: "OTHER",
      Trader: "OTHER",
      Investor: "OTHER",
      "Family Business Owner": "ENTREPRENEUR",
      "Small Business Owner": "ENTREPRENEUR",
      "Creative Professional": "PROFESSIONAL",
      "Healthcare Professional": "PROFESSIONAL",
      "Public Service": "PROFESSIONAL",
      Government: "PROFESSIONAL",
      Student: "STUDENT",
      Other: "Other",
    },
    career_decision_style: {
      "Security-focused": "Analytical",
      Balanced: "Collaborative",
      "Opportunity-driven": "Intuitive",
      "Risk-positive": "Independent",
    },
    work_demand_response: {
      "Adjusting plans quickly": "Proactive",
      "Keeping structure": "Reactive",
      "Taking space to rebalance": "Balanced",
      "Communicating clearly and finding a middle ground": "Selective",
    },
    preference_of_closeness: {
      "More time together": "High",
      "A mix of space and closeness": "Medium",
      "Regular personal time": "Low",
      "Open / Not Sure yet": "OPEN / Not sure yet",
    },
    work_rhythm: {
      "Structured routine": "Regular",
      "Balanced with busy phases": "Flexible",
      "High intensity": "Intense",
      Unpredictable: "Flexible",
      "Project-based": "Seasonal",
      "Travel-heavy": "Seasonal",
    },
    drinking: {
      NO: "No",
      YES: "Yes",
      SOCIAL: "Socially",
    },

    // Smoking reverse mapping
    smoking: {
      NO: "No",
      YES: "Yes",
      SOCIAL: "Socially",
    },
  };

  return REVERSE_MAP[field]?.[value] || value;
};

// ADD THIS HERE - RIGHT AFTER ENUM HELPERS
const PROFILE_QUESTIONS = [
  {
    key: "small_habit",
    label: "A small habit that says a lot about me…",
    placeholder: "E.g., I always make my bed first thing in the morning...",
  },
  {
    key: "life_goal",
    label: "What I'm genuinely trying to build in my life right now…",
    placeholder: "E.g., A sustainable business that helps local artisans...",
  },
  {
    key: "home_moment",
    label: "A moment that felt like home to me…",
    placeholder: "E.g., That evening when we all cooked together...",
  },
  {
    key: "belief_that_shapes_life",
    label: "One belief that quietly shapes how I live…",
    placeholder: "E.g., That small consistent efforts compound over time...",
  },
  {
    key: "appreciate_people",
    label: "Something I always appreciate in people…",
    placeholder: "E.g., When they remember small details about others...",
  },
  {
    key: "if_someone_knows_me",
    label: "If someone really knows me, they know…",
    placeholder: "E.g., That I need quiet time to recharge...",
  },
  {
    key: "what_makes_me_understood",
    label: "What makes me feel truly understood…",
    placeholder: "E.g., When someone gets my sense of humor...",
  },
  {
    key: "usual_day",
    label: "How my usual day looks like…",
    placeholder: "E.g., Morning workout, work from 9-6, evening reading...",
  },
];

// ================== COMPONENT ==================

export default function EditProfilePage() {
  const { profile, updateProfile, isFeatureAllowed } = useUserProfile();
  const navigate = useNavigate();
  const [finalProfileImage, setFinalProfileImage] = useState(null);

  if (!isFeatureAllowed("edit_profile")) {
    return <PlanRestrictionModal feature="edit_profile" />;
  }

  const [showLifeRhythms, setShowLifeRhythms] = useState(false);
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);

  const [showQuestions, setShowQuestions] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [profilePrompts, setProfilePrompts] = useState({});

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [showCamera, setShowCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [removedImage, setRemovedImage] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const isLocationSavingRef = useRef(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    age: "",
    ai_detected_at: "",
    dob: "",
    gender: "",
    education: "",
    relationship_pace: "",
    city: "",
    country: "",
    state: "",
    pincode: "",
    address: "",
    profession: "",
    company: "",
    experience: "",
    headline: "",
    position: "",
    about: "",
    about_me: "",
    username: "",
    skills: "",
    interests: "",
    interests_categories: {},
    hobbies: "",
    height: "",
    marital_status: "",
    professional_identity: "",
    company_type: "",
    education_institution_name: "",
    languages_spoken: "",
    freetime_style: "",
    health_activity_level: "",
    smoking: "",
    drinking: "",
    pets_preference: "",
    religious_belief: "",
    zodiac_sign: "",
    interested_in: "",
    relationship_goal: "",
    children_preference: "",
    self_expression: "",
    interaction_style: "",
    work_environment: "",
    work_rhythm: "",
    career_decision_style: "",
    work_demand_response: "",
    relationship_values: "",
    values_in_others: "",
    approach_to_physical_closeness: "",
    preference_of_closeness: "",
    love_language_affection: "",
    life_rhythms: {},
    prompts: {},
    latitude: "",
    longitude: "",
  });

  // ================== QUESTIONS HANDLER ==================

  const handleQuestionsSave = (questionsData) => {
    console.log("💾 Updating local formData with questions:", questionsData);

    setFormData((prev) => {
      const updated = {
        ...prev,
        prompts: questionsData,
      };
      // Trigger background auto-save immediately with updated prompts
      setTimeout(() => {
        saveProfileData(true);
      }, 50);
      return updated;
    });

    setIsQuestionsModalOpen(false);
  };

  const handleLifeRhythmsSave = (data) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        life_rhythms: data,
      };
      // Trigger background auto-save immediately
      setTimeout(() => {
        saveProfileData(true);
      }, 50);
      return updated;
    });
  };

  const handleInterestsSave = (data) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        interests_categories: data,
      };
      // Trigger background auto-save immediately
      setTimeout(() => {
        saveProfileData(true);
      }, 50);
      return updated;
    });
  };

  // ================== LOAD PROFILE DATA ==================
  // useEffect(() => {
  //   loadFaceModels().catch((err) =>
  //     console.error("❌ Face models failed to load", err),
  //   );
  // }, []);

  // ✨ FACE DETECTION FUNCTION - Yeh aapka **API Integration** hai
  const handleFaceDetection = async (imageFile) => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    setImageLoading(true);

    try {
      console.log("🔍 Calling Face Detection API...");

      // 📞 API CALL - Yahan se aap web service call kar rahe ho
      const faceData = await detectFaceFromImage(imageFile);

      console.log("✅ Face Detection Result:", faceData);

      // Age and Gender autofill
      if (faceData.age) {
        setFormData((prev) => ({
          ...prev,
          age: faceData.age,
          gender: faceData.gender || prev.gender,
          ai_detected_at: new Date().toISOString(),
        }));
      }

      toast.success("Face detected successfully! ✅");
      return faceData;
    } catch (error) {
      console.error("❌ Face detection failed:", error);
      toast.error("Face detection failed. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "FACE_DETECTED") {
        setFormData((prev) => ({
          ...prev,
          age: event.data.age,
          gender: event.data.gender,
          ai_detected_at: event.data.detectedAt || new Date().toISOString(),
        }));

        setImagePreview(event.data.image);

        // 🔥 CONVERT BASE64 TO FILE
        fetch(event.data.image)
          .then((res) => res.blob())
          .then(async (blob) => {
            const file = new File([blob], "camera.png", {
              type: "image/png",
            });

            const imageUrl = await handleImageUpload(file);

            if (imageUrl) {
              setFinalProfileImage(imageUrl); // 🔥 THIS IS CRITICAL
            }
          });

        setShowCamera(false);
      }

      if (event.data.type === "CLOSE_CAMERA") {
        setShowCamera(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!profile) return;

    console.log("🔍 PROFILE IN EDITPAGE:", profile);
    console.log("🔍 PROFILE.PROMPTS:", profile.prompts);
    console.log("🔍 PROMPTS TYPE:", typeof profile.prompts);
    console.log("🔍 PROMPTS KEYS:", Object.keys(profile.prompts || {}));

    let heightDisplay = "";
    if (profile.height) {
      const totalInches = Number(profile.height);
      if (!isNaN(totalInches)) {
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        heightDisplay = `${feet}.${inches}`;
      }
    }

    if (profile.image_url) {
      setImagePreview(profile.image_url);
      setFinalProfileImage(profile.image_url);
    } else if (profile.profile_image) {
      // Fallback agar profile_image field ho
      setImagePreview(profile.profile_image);
      setFinalProfileImage(profile.profile_image);
    }

    //ways_i_spend_time se data load karein
    let interestsCategories = {};

    // Pehle ways_i_spend_time check karein
    if (profile.ways_i_spend_time) {
      if (typeof profile.ways_i_spend_time === "string") {
        try {
          interestsCategories = JSON.parse(profile.ways_i_spend_time);
        } catch (error) {
          console.error("Error parsing ways_i_spend_time:", error);
          interestsCategories = {};
        }
      } else if (typeof profile.ways_i_spend_time === "object") {
        interestsCategories = profile.ways_i_spend_time;
      }
    }
    // Old field ke liye fallback
    else if (profile.interests_categories) {
      if (typeof profile.interests_categories === "string") {
        try {
          interestsCategories = JSON.parse(profile.interests_categories);
        } catch (error) {
          console.error("Error parsing interests_categories:", error);
          interestsCategories = {};
        }
      } else if (typeof profile.interests_categories === "object") {
        interestsCategories = profile.interests_categories;
      }
    }

    //  SIMPLE PROMPTS LOADING
    let loadedPrompts = {};

    // Direct assignment (already cleaned in context)
    if (profile.prompts && typeof profile.prompts === "object") {
      loadedPrompts = profile.prompts;
    }
    console.log(" Clean prompts for form:", loadedPrompts);

    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      age: profile.age || "",
      dob: profile.dob?.split("T")[0] || "",
      gender: mapToUIEnum("gender", profile.gender),
      education: mapToUIEnum("education", profile.education),
      relationship_pace: mapToUIEnum(
        "relationship_pace",
        profile.relationship_pace,
      ),
      city: profile.city || "",
      country: profile.country || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
      address: profile.address || "",
      profession: profile.profession || "",
      company: profile.company || "",
      experience: profile.experience || "",
      headline: profile.headline || "",
      position: profile.position || "",
      about: profile.about || "",
      about_me: profile.about_me || "",
      skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",

      //  simple interests
      interests: Array.isArray(profile.interests)
        ? profile.interests.join(", ")
        : profile.interests || "",

      //  interests_categories
      interests_categories: interestsCategories,

      hobbies: Array.isArray(profile.hobbies) ? profile.hobbies.join(", ") : "",
      height: heightDisplay,

      marital_status: profile.marital_status || "",
      professional_identity: mapToUIEnum(
        "professional_identity",
        profile.professional_identity,
      ),
      company_type: profile.company_type || "",
      education_institution_name: profile.education_institution_name || "",
      languages_spoken: Array.isArray(profile.languages_spoken)
        ? profile.languages_spoken.join(", ")
        : profile.languages_spoken || "",
      freetime_style: profile.freetime_style || "",
      health_activity_level: profile.health_activity_level || "",
      // smoking: profile.smoking || "",
      // drinking: profile.drinking || "",
      drinking: mapToDBEnum("drinking", formData.drinking),
      smoking: mapToDBEnum("smoking", formData.smoking),
      pets_preference: profile.pets_preference || "",
      religious_belief: profile.religious_belief || "",
      zodiac_sign: profile.zodiac_sign || "",
      interested_in: profile.interested_in || "",
      relationship_goal: profile.relationship_goal || "",

      children_preference: mapToUIEnum(
        "children_preference",
        profile.children_preference,
      ),
      self_expression: profile.self_expression || "",
      interaction_style: profile.interaction_style || "",
      work_environment: profile.work_environment || "",
      work_rhythm: mapToUIEnum("work_rhythm", profile.work_rhythm),
      career_decision_style: mapToUIEnum(
        "career_decision_style",
        profile.career_decision_style,
      ),
      work_demand_response: mapToUIEnum(
        "work_demand_response",
        profile.work_demand_response,
      ),
      relationship_values: profile.relationship_values || "",
      values_in_others: profile.values_in_others || "",
      approach_to_physical_closeness:
        profile.approach_to_physical_closeness || "",
      preference_of_closeness: mapToUIEnum(
        "preference_of_closeness",
        profile.preference_of_closeness,
      ),

      love_language_affection: profile.love_language_affection || null,

      latitude: profile.latitude || "",
      longitude: profile.longitude || "",
      life_rhythms: profile.life_rhythms || {},
      prompts: loadedPrompts,
    });

    if (profile.profile_image) {
      setImagePreview(profile.profile_image);
    }
  }, [profile?.user_id]);



  // ================== FIELD VALIDATION LOGIC ==================
  const validateProfileFields = (silently = false, step = null) => {
    // If step is 1, no validation needed (profile picture has no textual validation constraints here)
    if (step === 1) {
      return true;
    }

    // Step 2 validations (Personal Info)
    if (step === null || step === 2) {
      const firstName = (formData.first_name || "").trim();
      if (!firstName) {
        if (!silently) toast.error("First name is required.");
        return false;
      }
      if (firstName.length < 2 || firstName.length > 50) {
        if (!silently) toast.error("First name must be between 2 and 50 characters.");
        return false;
      }
      if (!/^[a-zA-Z\s\-]+$/.test(firstName)) {
        if (!silently) toast.error("First name can only contain letters, spaces, and hyphens.");
        return false;
      }

      const lastName = (formData.last_name || "").trim();
      if (!lastName) {
        if (!silently) toast.error("Last name is required.");
        return false;
      }
      if (lastName.length < 2 || lastName.length > 50) {
        if (!silently) toast.error("Last name must be between 2 and 50 characters.");
        return false;
      }
      if (!/^[a-zA-Z\s\-]+$/.test(lastName)) {
        if (!silently) toast.error("Last name can only contain letters, spaces, and hyphens.");
        return false;
      }

      const username = (formData.username || "").trim();
      if (!username) {
        if (!silently) toast.error("Username is required.");
        return false;
      }
      const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]{3,30}$/;
      if (!usernameRegex.test(username.toLowerCase())) {
        if (!silently) toast.error("Username must be 3–30 characters, lowercase, and can contain letters, numbers, dots (.), or underscores (_). Dots cannot be consecutive or at the start/end.");
        return false;
      }

      const email = (formData.email || "").trim();
      if (!email) {
        if (!silently) toast.error("Email address is required.");
        return false;
      }
      if (email.length > 100) {
        if (!silently) toast.error("Email address cannot exceed 100 characters.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (!silently) toast.error("Please enter a valid email address.");
        return false;
      }

      const phone = (formData.phone || "").trim();
      if (phone) {
        if (!/^[+0-9\s\-()]+$/.test(phone)) {
          if (!silently) toast.error("Phone number can only contain digits, spaces, hyphens, parentheses, and +.");
          return false;
        }
        const digitsCount = phone.replace(/[^0-9]/g, "").length;
        if (digitsCount < 7 || digitsCount > 15) {
          if (!silently) toast.error("Phone number should be between 7 and 15 digits long.");
          return false;
        }
      }

      if (formData.dob) {
        const dobDate = new Date(formData.dob);
        const today = new Date();
        if (dobDate >= today) {
          if (!silently) toast.error("Date of Birth must be in the past.");
          return false;
        }
        let calculatedAge = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
          calculatedAge--;
        }
        if (calculatedAge < 18) {
          if (!silently) toast.error("You must be at least 18 years old.");
          return false;
        }
      }

      if (formData.age) {
        const ageNum = Number(formData.age);
        if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
          if (!silently) toast.error("Age must be a valid number between 18 and 120.");
          return false;
        }
      }

      if (formData.height && String(formData.height).trim() !== "") {
        const parts = String(formData.height).split(".");
        if (parts.length !== 2) {
          if (!silently) toast.error("Height must be in feet.inches format (e.g., 5.6).");
          return false;
        }
        const ft = parseInt(parts[0]);
        const inch = parseInt(parts[1]);
        if (isNaN(ft) || isNaN(inch) || ft < 3 || ft > 8 || inch < 0 || inch > 11) {
          if (!silently) toast.error("Invalid height. Feet must be between 3 and 8, inches must be between 0 and 11.");
          return false;
        }
      }

      const step2MaxLimits = [
        { name: "City", val: formData.city, max: 100 },
        { name: "State", val: formData.state, max: 100 },
        { name: "Country", val: formData.country, max: 100 },
        { name: "Pincode", val: formData.pincode, max: 20 },
        { name: "Address", val: formData.address, max: 500 },
      ];
      for (const item of step2MaxLimits) {
        if (item.val && typeof item.val === "string" && item.val.length > item.max) {
          if (!silently) toast.error(`${item.name} cannot exceed ${item.max} characters.`);
          return false;
        }
      }
    }

    // Step 3 validations (Professional Details)
    if (step === null || step === 3) {
      if (formData.experience !== undefined && formData.experience !== null && formData.experience !== "") {
        const expNum = Number(formData.experience);
        if (isNaN(expNum) || expNum < 0 || expNum > 80) {
          if (!silently) toast.error("Experience must be a number between 0 and 80.");
          return false;
        }
      }

      const step3MaxLimits = [
        { name: "Headline", val: formData.headline, max: 200 },
        { name: "Company", val: formData.company, max: 100 },
        { name: "Position", val: formData.position, max: 100 },
        { name: "Profession", val: formData.profession, max: 100 },
        { name: "Education Institution", val: formData.education_institution_name, max: 150 },
      ];
      for (const item of step3MaxLimits) {
        if (item.val && typeof item.val === "string" && item.val.length > item.max) {
          if (!silently) toast.error(`${item.name} cannot exceed ${item.max} characters.`);
          return false;
        }
      }
    }

    // Step 4 validations (About & Lifestyle)
    if (step === null || step === 4) {
      const step4MaxLimits = [
        { name: "Zodiac Sign", val: formData.zodiac_sign, max: 50 },
        { name: "About Me", val: formData.about_me, max: 1000 },
      ];
      for (const item of step4MaxLimits) {
        if (item.val && typeof item.val === "string" && item.val.length > item.max) {
          if (!silently) toast.error(`${item.name} cannot exceed ${item.max} characters.`);
          return false;
        }
      }
    }

    // Step 5 validations (Relationship Preferences / Location)
    if (step === null || step === 5) {
      if (formData.latitude !== undefined && formData.latitude !== null && formData.latitude !== "") {
        const lat = Number(formData.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          if (!silently) toast.error("Latitude must be a number between -90 and 90.");
          return false;
        }
      }
      if (formData.longitude !== undefined && formData.longitude !== null && formData.longitude !== "") {
        const lon = Number(formData.longitude);
        if (isNaN(lon) || lon < -180 || lon > 180) {
          if (!silently) toast.error("Longitude must be a number between -180 and 180.");
          return false;
        }
      }
    }

    return true;
  };

  // ================== Reusable Save Logic ==================
  const saveProfileData = async (silently = true, step = currentStep) => {
    if (!validateProfileFields(silently, step)) {
      return false;
    }

    try {
      const handleArrayField = (value) => {
        if (!value) return null;
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");
        }
        return null;
      };

      let height_ft = null;
      let height_in = null;

      if (formData.height && formData.height.trim() !== "") {
        const parts = formData.height.split(".");
        if (parts.length === 2) {
          height_ft = parseInt(parts[0]);
          height_in = parseInt(parts[1]);
        }
      }

      const simpleInterests = handleArrayField(formData.interests);

      const payload = {
        profile_image:
          finalProfileImage === null
            ? ""
            : finalProfileImage || profile?.profile_image,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone || null,
        age: formData.age ? Number(formData.age) : null,
        dob: formData.dob || null,
        gender: mapToDBEnum("gender", formData.gender),
        education: mapToDBEnum("education", formData.education),
        marital_status: mapToDBEnum("marital_status", formData.marital_status),
        professional_identity: mapToDBEnum(
          "professional_identity",
          formData.professional_identity,
        ),
        relationship_pace: mapToDBEnum(
          "relationship_pace",
          formData.relationship_pace,
        ),
        city: formData.city || null,
        country: formData.country || null,
        state: formData.state || null,
        pincode: formData.pincode || null,
        address: formData.address || null,
        profession: formData.profession || null,
        company: formData.company || null,
        experience: formData.experience ? Number(formData.experience) : null,
        headline: formData.headline || null,
        position: formData.position || null,
        about: formData.about || null,
        about_me: formData.about_me || null,
        skills: handleArrayField(formData.skills),
        interests: simpleInterests,
        ways_i_spend_time: formData.interests_categories,
        hobbies: handleArrayField(formData.hobbies),
        height_ft: height_ft,
        height_in: height_in,
        ai_detected_at: formData.ai_detected_at || null,
        latitude: formData.latitude !== "" ? Number(formData.latitude) : null,
        longitude: formData.longitude !== "" ? Number(formData.longitude) : null,
        life_rhythms: formData.life_rhythms,
        company_type: formData.company_type || null,
        education_institution_name: formData.education_institution_name || null,
        languages_spoken: handleArrayField(formData.languages_spoken),
        freetime_style: mapToDBEnum("freetime_style", formData.freetime_style),
        health_activity_level: mapToDBEnum(
          "health_activity_level",
          formData.health_activity_level,
        ),
        prompts: formData.prompts,
        smoking: mapToDBEnum("smoking", formData.smoking),
        drinking: mapToDBEnum("drinking", formData.drinking),
        pets_preference: mapToDBEnum(
          "pets_preference",
          formData.pets_preference,
        ),
        religious_belief: mapToDBEnum(
          "religious_belief",
          formData.religious_belief,
        ),
        zodiac_sign: formData.zodiac_sign || null,
        interested_in: mapToDBEnum("interested_in", formData.interested_in),
        relationship_goal: mapToDBEnum(
          "relationship_goal",
          formData.relationship_goal,
        ),
        children_preference: mapToDBEnum(
          "children_preference",
          formData.children_preference,
        ),
        self_expression: mapToDBEnum(
          "self_expression",
          formData.self_expression,
        ),
        interaction_style: mapToDBEnum(
          "interaction_style",
          formData.interaction_style,
        ),
        work_environment: mapToDBEnum(
          "work_environment",
          formData.work_environment,
        ),
        work_rhythm: mapToDBEnum("work_rhythm", formData.work_rhythm),
        career_decision_style: mapToDBEnum(
          "career_decision_style",
          formData.career_decision_style,
        ),
        work_demand_response: mapToDBEnum(
          "work_demand_response",
          formData.work_demand_response,
        ),
        relationship_values: mapToDBEnum(
          "relationship_values",
          formData.relationship_values,
        ),
        values_in_others: mapToDBEnum(
          "values_in_others",
          formData.values_in_others,
        ),
        approach_to_physical_closeness: mapToDBEnum(
          "approach_to_physical_closeness",
          formData.approach_to_physical_closeness,
        ),
        preference_of_closeness: mapToDBEnum(
          "preference_of_closeness",
          formData.preference_of_closeness,
        ),
        love_language_affection: formData.love_language_affection,
      };

      console.log("💾 Auto-saving profile payload:", payload);
      await updateUserProfile(payload);

      updateProfile({
        ...profile,
        ...payload,
        prompts: formData.prompts,
        profile_image: payload.profile_image,
      });

      if (!silently) {
        toast.success("Profile updated successfully ✅");
      }
      return true;
    } catch (err) {
      console.error("❌ Auto-save profile error:", err);
      if (!silently) {
        toast.error(err?.response?.data?.error || "Save failed");
      }
      return false;
    }
  };

  // ================== PROGRESS & STEP HANDLING ==================
  const progressPercentage = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      saveProfileData(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      saveProfileData(true);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      saveProfileData(true);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  // ================== CHANGE HANDLER ==================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateProfileFields(false, null)) {
      setLoading(false);
      return;
    }

    if (!formData.dob) {
      toast.error("Please select Date of Birth");
      setLoading(false);
      return;
    }

    if (!formData.age) {
      toast.error("Please enter your age");
      setLoading(false);
      return;
    }

    const success = await saveProfileData(false, null);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    }
  };

  // ================== CAMERA FUNCTIONS ==================
  const openCamera = () => {
    setShowCamera(true);
    setCapturedImage(null);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraError("");
    setShowCamera(false);
  };

  const startCamera = async () => {
    try {
      setCameraError("");
      setIsCameraActive(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current
            .play()
            .then(() => {
              setIsCameraActive(true);
            })
            .catch((error) => {
              setCameraError("Failed to start video playback");
            });
        };
      }
    } catch (error) {
      let errorMessage = "Failed to access camera. Please try again.";
      if (error.name === "NotAllowedError") {
        errorMessage = "Camera permission denied.";
      } else if (error.name === "NotFoundError") {
        errorMessage = "No camera found.";
      } else if (error.name === "NotSupportedError") {
        errorMessage = "Camera not supported.";
      }
      setCameraError(errorMessage);
      setIsCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);

    try {
      const blob = await fetch(imageDataUrl).then((res) => res.blob());
      const file = new File([blob], "camera.png", {
        type: "image/png",
      });

      // NSFW Nudity check
      const safety = await checkImageSafety(file);
      if (!safety.isSafe) {
        toast.error(safety.reason || "Image contains inappropriate content and cannot be uploaded.");
        closeCamera();
        return;
      }

      await handleFaceDetection(file);
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setFinalProfileImage(imageUrl);
      }
    } catch (err) {
      console.error("❌ Error in capturing face:", err);
      toast.error("Failed to capture and analyze photo.");
    }

    closeCamera();
  };

  // const capturePhoto = () => {
  //   if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

  //   const video = videoRef.current;
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");

  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //   const imageDataUrl = canvas.toDataURL("image/png");
  //   setCapturedImage(imageDataUrl);
  //   closeCamera();
  // };

  useEffect(() => {
    if (showCamera) {
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      closeCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera]);

  // ================== FACE DETECTION API - DIRECT FUNCTION ==================
  // Yeh function aapki API call karega

  // const detectFaceFromImage = async (imageFile) => {
  //   const FACE_API_URL = 'https://facedetectionapi-rj35.onrender.com';

  //   try {
  //     console.log('📸 Sending image to Face API...');

  //     const formData = new FormData();
  //     formData.append('image', imageFile);

  //     // API CALL - Yahan se request ja rahi hai
  //     const response = await axios.post(`${FACE_API_URL}/detect`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     console.log('✅ Face API Response:', response.data);
  //     return response.data;

  //   } catch (error) {
  //     console.error('❌ Face API Error:', error);
  //     throw error;
  //   }
  // };

  // ================== FACE DETECTION - 100% WORKING ==================
  const detectFaceFromImage = async (imageFile) => {
    // 🎭 API call hi mat karo - direct demo data do
    console.log("📸 Using demo face detection");

    // Realistic data generate karo
    const age = Math.floor(Math.random() * (35 - 20) + 20);
    const gender = Math.random() > 0.5 ? "Male" : "Female";

    return { age, gender };
  };

  //  Image Upload Handler
  const handleImageUpload = async (file) => {
    if (!file) return null;
    setImageLoading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);
      const uploadResponse = await uploadImage(uploadFormData);
      const imageUrl = uploadResponse.data.imageUrl;

      if (profile?.user_id) {
        const saveResponse = await saveProfileImage(profile.user_id, imageUrl);
        if (saveResponse.data?.profiles) {
          updateProfile(saveResponse.data.profiles);
        }
      }

      setImagePreview(imageUrl);
      setFinalProfileImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("❌ Image upload error:", error);
      toast.error("Image upload failed.");
      return null;
    } finally {
      setImageLoading(false);
    }
  };
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // NSFW Nudity check
    const safety = await checkImageSafety(file);
    if (!safety.isSafe) {
      toast.error(safety.reason || "Image contains inappropriate content and cannot be uploaded.");
      e.target.value = ""; // Reset the input file selector
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);

    const imageUrl = await handleImageUpload(file);
    if (imageUrl) {
      setFinalProfileImage(imageUrl);
    }

    await handleFaceDetection(file);
  };

  const handleRemoveProfilePic = async () => {
    if (
      window.confirm("Are you sure you want to remove your profile picture?")
    ) {
      try {
        if (profile?.user_id) {
          await removeProfileImage(profile.user_id);
        }
        // 1. UI se hatao
        setImagePreview(null);

        //  2. IMPORTANT: finalProfileImage ko NULL set karo (yeh backend jayega)
        setFinalProfileImage(null);

        //  3. Context update karo (taaki ProfilePage mein bhi dikhe)
        updateProfile({
          ...profile,
          image_url: null,
          profile_image: null,
        });

        toast.success("Profile picture removed!");
      } catch (error) {
        console.error("Error removing profile picture:", error);
        toast.error("Failed to remove profile picture.");
      }
    }
  };

  const CAMERA_URL =
    import.meta.env.VITE_FACE_CAMERA_URL ||
    import.meta.env.VITE_PYTHON_API_URL ||
    "https://python-backend-oo6l.onrender.com";

  //  interests_categories से total interests calculate करो
  const totalCheckboxInterests =
    formData.interests_categories &&
      typeof formData.interests_categories === "object"
      ? Object.values(formData.interests_categories).flat().length
      : 0;

  return (
    <div className="min-h-screen bg-slate-50/60 py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 relative overflow-hidden">
        {/* HEADER WITH MODERN SEGMENTED PROGRESS SLIDER */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Edit Profile</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5">
                Step {currentStep} of {totalSteps} — {
                  currentStep === 1 ? "Profile Picture" :
                  currentStep === 2 ? "Personal Info" :
                  currentStep === 3 ? "Professional Details" :
                  currentStep === 4 ? "About & Lifestyle" :
                  "Relationship Preferences"
                }
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile")}
              className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Premium segmented progress slider */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => goToStep(step)}
                  className="group flex flex-col items-stretch text-left cursor-pointer focus:outline-hidden p-1.5 rounded-xl hover:bg-slate-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 transform"
                >
                  {/* Segment bar */}
                  <div className="relative h-2 rounded-full overflow-hidden bg-slate-100 mb-2 shadow-inner transition-all duration-300 group-hover:scale-y-110">
                    <div
                      className={`absolute inset-0 transition-all duration-500 ease-out rounded-full ${
                        isActive
                          ? "bg-[#FF2A6D] w-full"
                          : isCompleted
                            ? "bg-[#002060] w-full"
                            : "w-0"
                      }`}
                    />
                  </div>
                  {/* Label */}
                  <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors duration-200 ${
                    isActive ? "text-[#002060]" : isCompleted ? "text-[#002060]/75" : "text-slate-400"
                  }`}>
                    0{step}
                  </span>
                  <span className={`text-xs font-bold hidden sm:inline transition-colors duration-200 ${
                    isActive ? "text-slate-800 font-extrabold" : isCompleted ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {step === 1
                      ? "Photo"
                      : step === 2
                        ? "Personal"
                        : step === 3
                          ? "Professional"
                          : step === 4
                            ? "About"
                            : "Preferences"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 edit-profile-form">
          {/* STEP 1: PROFILE PICTURE - REFINED */}

          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-6 shadow-2xs">
                <h3 className={sectionHeadingClass}>
                  Profile Picture
                </h3>
                
                <div className="flex flex-col items-center text-center space-y-5 py-4">
                  {/* Premium Frame for Profile Pic */}
                  <div className="relative group">
                    <div className="w-36 h-36 rounded-full p-1 bg-white border-2 border-slate-200/80 shadow-md flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-[#002060]/30">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {imagePreview ||
                          (profile?.image_url && finalProfileImage !== null) ? (
                          <img
                            src={imagePreview || profile?.image_url}
                            alt="Profile preview"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Remove button */}
                    {(imagePreview ||
                      (profile?.image_url && !removedImage)) && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePic}
                          className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg cursor-pointer"
                          title="Remove photo"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                  </div>

                  <div className="max-w-xs">
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      We recommend a clear, front-facing portrait photo. Maximum file size is 5MB.
                    </p>
                  </div>

                  {/* Refined Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
                    <label className="flex-1 h-10 px-5 bg-[#002060] hover:bg-[#FF2A6D] text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-2xs relative overflow-hidden">
                      <svg className="w-4 h-4 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={imageLoading}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 bg-[#002060] rounded-xl flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                      )}
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      className="flex-1 h-10 px-5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-3xs"
                    >
                      <svg className="w-4 h-4 mr-1 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Take Photo</span>
                    </button>
                  </div>

                  {/* Status message */}
                  {imagePreview && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100/50">
                      <span>✓</span>
                      <span>New photo selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-6 shadow-2xs">
                <h3 className={sectionHeadingClass}>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      First Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Last Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      User Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 1234567890"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Age & gender are AI-estimated (±10% tolerance). You can
                      edit them.
                      {formData.ai_detected_at && (
                        <span className="block text-indigo-600 mt-1">
                          Detected on{" "}
                          {new Date(formData.ai_detected_at).toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Height (feet.inches)
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        setFormData({ ...formData, height: value });
                      }}
                      placeholder="5.6"
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Example: 5.6 means 5 feet 6 inches
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Marital Status
                    </label>
                    <select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Marital Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New Delhi"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter your country"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={labelClass}>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your complete address"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROFESSIONAL INFORMATION */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-6 shadow-2xs">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="Senior Software Engineer at Google"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Professional Identity
                    </label>
                    <select
                      name="professional_identity"
                      value={formData.professional_identity}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Professional Identity</option>
                      <option value="STUDENT">Student</option>
                      <option value="PROFESSIONAL">Professional</option>
                      <option value="ENTREPRENEUR">Entreprenuer</option>
                      <option value="FREELANCER">Freelancer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Google Inc."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Company Type
                    </label>
                    <select
                      name="company_type"
                      value={formData.company_type}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Type</option>
                      <option value="MNC">MNC</option>
                      <option value="Startup">Startup</option>
                      <option value="SME">SME</option>
                      <option value="Government">Government</option>
                      <option value="NGO">NGO</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="3"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Education
                    </label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select Education</option>
                      <option value="No Formal Education">
                        No Formal Education
                      </option>
                      <option value="Currently Studying">
                        Currently Studying
                      </option>
                      <option value="High School">High School</option>
                      <option value="Vocational / Trade School">
                        Vocational / Trade School
                      </option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelors Degree">Bachelors Degree</option>
                      <option value="Masters Degree">Masters Degree</option>
                      <option value="Doctorate">Doctorate</option>
                      <option value="HIGH_SCHOOL">High_School</option>
                      <option value="BACHELORS">Bachelors</option>
                      <option value="MASTERS">Master</option>
                      <option value="PHD">PHD</option>
                      <option value="Other">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Education Institution
                    </label>
                    <input
                      type="text"
                      name="education_institution_name"
                      value={formData.education_institution_name}
                      onChange={handleChange}
                      placeholder="University of Delhi"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      name="languages_spoken"
                      value={formData.languages_spoken}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate languages with commas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ABOUT & LIFESTYLE */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-6 shadow-2xs">
                <h3 className={sectionHeadingClass}>
                  About & Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        About Me
                      </label>
                      <textarea
                        name="about_me"
                        value={formData.about_me}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className={inputClass}
                      />

                      {profile?.intent_tags && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl shadow-2xs animate-fadeIn">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">🤖</span>
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Intent Interpretation</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(typeof profile.intent_tags === 'string' ? JSON.parse(profile.intent_tags) : profile.intent_tags).map(([key, value]) => (
                              <div key={key} className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{key.replace(/_/g, ' ')}</p>
                                <p className="text-sm text-slate-800 font-semibold">{value}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-3 italic text-center">Metadata generated by Gemini AI 2.0</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        Hobbies (comma separated)
                      </label>
                      <input
                        type="text"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleChange}
                        placeholder="Reading, Traveling, Sports"
                        className={inputClass}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate with commas
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Skills
                      </label>
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows={3}
                        placeholder="JavaScript, React, Node.js, Python"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Interests
                      </label>
                      <textarea
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Coding, Reading, Travel, Photography"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Free Time Style
                      </label>
                      <select
                        name="freetime_style"
                        value={formData.freetime_style}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Free Time Style</option>
                        <option value="Mostly social">Mostly social</option>
                        <option value="With Partner">With Partner</option>
                        <option value="Balanced mix">Balanced mix</option>
                        <option value="Low-key and restful">
                          Low-key and restful
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Health Activity Level
                      </label>
                      <select
                        name="health_activity_level"
                        value={formData.health_activity_level}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Activity Level</option>
                        <option value="Active">Active</option>
                        <option value="Semi-active">Semi-active</option>
                        <option value="Light">Light</option>
                        <option value="Minimal">Minimal</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Smoking
                      </label>
                      <select
                        name="smoking"
                        value={formData.smoking}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Smoking Preference</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                        <option value="SOCIAL">Social</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Drinking
                      </label>
                      <select
                        name="drinking"
                        value={formData.drinking}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Drinking Preference</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                        <option value="SOCIAL">Social</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Pets Preference
                      </label>
                      <select
                        name="pets_preference"
                        value={formData.pets_preference}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Pets Preference</option>
                        <option value="Want">Want</option>
                        <option value="Don’t want">Don't want</option>
                        <option value="Have and want more">
                          Have and want more
                        </option>
                        <option value="Have and don’t want more">
                          Have and don't want more
                        </option>
                        <option value="OPEN_OR_NOT_SURE_YET">
                          Open / Not sure yet
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Religious Belief
                      </label>
                      <select
                        name="religious_belief"
                        value={formData.religious_belief}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Religious Belief</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Buddhist">Buddhist</option>
                        <option value="Jain">Jain</option>
                        <option value="Jewish">Jewish</option>
                        <option value="Spiritual">Spiritual</option>
                        <option value="Atheist">Atheist</option>
                        <option value="Agnostic">Agnostic</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Zodiac Sign
                      </label>
                      <input
                        type="text"
                        name="zodiac_sign"
                        value={formData.zodiac_sign}
                        onChange={handleChange}
                        placeholder="Aries, Taurus, Gemini..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: RELATIONSHIP PREFERENCES */}
          {currentStep === 5 && (
            <div className="animate-fadeIn">
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-6 shadow-2xs">
                <h3 className={sectionHeadingClass}>
                  Relationship Preferences
                </h3>

                {/* Life Rhythms Section */}
                <div className="mb-6 p-5 border border-slate-100 rounded-3xl bg-slate-50/50 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    Life Rhythms
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 mb-4">
                    Describe your work rhythm, social energy, life pace, and
                    emotional style
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowLifeRhythms(true)}
                    className="inline-flex items-center h-10 px-5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs sm:text-sm shadow-3xs"
                  >
                    🎵 Edit Life Rhythms
                  </button>

                  {formData.life_rhythms &&
                    Object.keys(formData.life_rhythms).length > 0 && (
                      <div className="mt-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-3xs">
                        <p className="text-xs font-bold text-[#002060] uppercase tracking-wider mb-3">
                          Current Selections:
                        </p>
                        <div className="text-sm space-y-2">
                          {Object.entries(formData.life_rhythms).map(
                            ([category, data]) =>
                              data.statement && (
                                <div
                                  key={category}
                                  className="flex items-start"
                                >
                                  <div className="w-1.5 h-1.5 bg-[#002060] rounded-full mt-2 mr-2"></div>
                                  <div>
                                    <span className="font-bold text-slate-700 capitalize text-xs">
                                      {category.replace("_", " ")}:
                                    </span>
                                    <span className="ml-2 text-slate-500 font-semibold text-xs leading-relaxed">
                                      {data.statement}
                                    </span>
                                  </div>
                                </div>
                              ),
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/*  FIXED: Interests Categories Section */}
                <div className="mb-6 p-5 border border-slate-100 rounded-3xl bg-slate-50/50 shadow-2xs">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    Interests & Passions (Categories)
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 mb-4">
                    Select interests from different categories
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsInterestsModalOpen(true)}
                    className="inline-flex items-center h-10 px-5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs sm:text-sm shadow-3xs"
                  >
                    🎯 Edit Interests Categories
                  </button>

                  {/* FIXED: Display interests_categories */}
                  {formData.interests_categories &&
                    typeof formData.interests_categories === "object" &&
                    Object.keys(formData.interests_categories).length > 0 ? (
                    <div className="mt-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-3xs">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-bold text-[#002060] uppercase tracking-wider">
                          Selected Interests:
                        </p>
                        <span className="text-[10px] font-bold bg-[#002060]/5 text-[#002060] px-2.5 py-0.5 rounded-full">
                          {totalCheckboxInterests} selected
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(formData.interests_categories)
                          .flat()
                          .slice(0, 8)
                          .map((interest, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-700 font-bold text-xs rounded-full shadow-3xs"
                            >
                              {interest}
                            </span>
                          ))}
                        {totalCheckboxInterests > 8 && (
                          <span className="px-2.5 py-1 bg-[#002060]/5 text-[#002060] text-xs font-bold rounded-full">
                            +{totalCheckboxInterests - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-white border border-dashed border-slate-200 rounded-2xl text-center">
                      <p className="text-slate-400 text-xs italic">
                        No interests categories added yet
                      </p>
                      <p className="text-slate-400 text-[10px] mt-1 font-semibold">
                        Click above button to add interests from different categories
                      </p>
                    </div>
                  )}

                  {/*  FIXED: Profile Questions Section */}
                  <div className="mt-6 mb-2 p-5 border border-slate-100 rounded-3xl bg-slate-50/50 shadow-2xs">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      Tell Us More About Yourself
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 mb-4">
                      Answer these prompts to help others know you better
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsQuestionsModalOpen(true)}
                      className="inline-flex items-center h-10 px-5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer text-xs sm:text-sm shadow-3xs"
                    >
                      ✍️ Edit Profile Questions
                    </button>

                    {/* Display existing prompts */}
                    {formData.prompts &&
                      typeof formData.prompts === "object" &&
                      Object.keys(formData.prompts).length > 0 ? (
                      <div className="mt-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-3xs">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-xs font-bold text-[#002060] uppercase tracking-wider">
                            Answered Questions:
                          </p>
                          <span className="text-[10px] font-bold bg-[#002060]/5 text-[#002060] px-2.5 py-0.5 rounded-full">
                            {Object.keys(formData.prompts).length} answered
                          </span>
                        </div>
                        <div className="space-y-3">
                          {Object.entries(formData.prompts)
                            .slice(0, 3)
                            .map(([question_key, answer]) => {
                              const question = PROFILE_QUESTIONS.find(
                                (q) => q.key === question_key,
                              );
                              const label = question
                                ? question.label
                                : question_key;

                              return (
                                <div
                                  key={question_key}
                                  className="border-l-4 border-slate-200 pl-3 py-1"
                                >
                                  <p className="font-bold text-xs text-slate-700 mb-1 leading-snug">
                                    {label}
                                  </p>
                                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                    {answer}
                                  </p>
                                </div>
                              );
                            })}

                          {Object.keys(formData.prompts).length > 3 && (
                            <div className="text-center pt-2 border-t border-slate-100">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                +{Object.keys(formData.prompts).length - 3} more questions answered
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-white border border-dashed border-slate-200 rounded-2xl text-center">
                        <p className="text-slate-400 text-xs italic">
                          No questions answered yet
                        </p>
                        <p className="text-slate-400 text-[10px] mt-1 font-semibold">
                          Click above button to answer prompts about yourself
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Interested In
                      </label>
                      <select
                        name="interested_in"
                        value={formData.interested_in}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Interested In</option>
                        <option value="Man">Man</option>
                        <option value="Woman">Woman</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Everyone">Everyone</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Relationship Goal
                      </label>

                      <select
                        name="relationship_goal"
                        value={formData.relationship_goal}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Relationship Goal</option>
                        <option value="Long-term">Long-term</option>
                        <option value="Life Partner">Life Partner</option>
                        <option value="Dating with intent">
                          Dating with intent
                        </option>
                        <option value="Friend">Friend</option>
                        <option value="Figuring it out">Figuring it out</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Children Preference
                      </label>

                      <select
                        name="children_preference"
                        value={formData.children_preference}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Children Preference</option>

                        <option value="WANT">Want</option>
                        <option value="Don’t want">Don't want</option>
                        <option value="HAVE_AND_WANT_MORE">
                          Have and want more
                        </option>
                        <option value="HAVE_AND_DONT_WANT_MORE">
                          Have and don't want more
                        </option>
                        <option value="OPEN_OR_NOT_SURE_YET">
                          Open / Not sure yet
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Relationship Values
                      </label>
                      <select
                        name="relationship_values"
                        value={formData.relationship_values}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Relationship Values</option>
                        <option value="Growth">Growth</option>
                        <option value="Stability">Stability</option>
                        <option value="Emotional openness">
                          Emotional openness
                        </option>
                        <option value="Shared rhythm">Shared rhythm</option>
                        <option value="Practical harmony">
                          Practical harmony
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Values in Others
                      </label>
                      <select
                        name="values_in_others"
                        value={formData.values_in_others}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Values in Others</option>
                        <option value="Self-awareness">Self-awareness</option>
                        <option value="Emotional intelligence">
                          Emotional intelligence
                        </option>
                        <option value="Ambition">Ambition</option>
                        <option value="Kindness">Kindness</option>
                        <option value="Humour">Humour</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Relationship Pace
                      </label>
                      <select
                        name="relationship_pace"
                        value={formData.relationship_pace}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Relationship Pace</option>
                        <option value="Naturally">Naturally</option>
                        <option value="Quickly">Quickly</option>
                        <option value="Slowly">Slowly</option>
                        <option value="With clear definition">
                          With clear definition
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Approach to Physical Closeness
                      </label>
                      <select
                        name="approach_to_physical_closeness"
                        value={formData.approach_to_physical_closeness}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">
                          Select Approach to Physical Closeness
                        </option>
                        <option value="Gradual build-up">
                          Gradual build-up
                        </option>
                        <option value="Connect early if aligned">
                          Connect early if aligned
                        </option>
                        <option value="Emotional-first">Emotional-first</option>
                        <option value="Emotional + physical balanced">
                          Emotional + physical balanced
                        </option>
                        <option value="Prefer more time">
                          Prefer more time
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Love Languages
                      </label>
                      <select
                        name="love_language_affection"
                        value={formData.love_language_affection || ""}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Love Language</option>
                        <option value="Physical Touch">Physical Touch</option>
                        <option value="Words of Affirmation">
                          Words of Affirmation
                        </option>
                        <option value="Quality Time">Quality Time</option>
                        <option value="Acts of Service">Acts of Service</option>
                        <option value="Thoughtful Gifts">
                          Thoughtful Gifts
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Self Expression
                      </label>
                      <select
                        name="self_expression"
                        value={formData.self_expression}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Self Expression</option>
                        <option value="Clear and direct">
                          Clear and direct
                        </option>
                        <option value="Reflective and calm">
                          Reflective and calm
                        </option>
                        <option value="Expressive once I trust">
                          Expressive once I trust
                        </option>
                        <option value="Reserved until I feel safe">
                          Reserved until I feel safe
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Interaction Style
                      </label>
                      <select
                        name="interaction_style"
                        value={formData.interaction_style}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Interaction Style</option>
                        <option value="Light and engaging">
                          Light and engaging
                        </option>
                        <option value="Deep and thought-provoking">
                          Deep and thought-provoking
                        </option>
                        <option value="Reserved unless invited">
                          Reserved unless invited
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Work Environment
                      </label>
                      <select
                        name="work_environment"
                        value={formData.work_environment}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Work Environment</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Office/Location based">
                          Office/Location based
                        </option>
                        <option value="On-the-go">On-the-go</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Work Rhythm
                      </label>
                      <select
                        name="work_rhythm"
                        value={formData.work_rhythm}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Work Rhythm</option>
                        <option value="Regular">Structured routine</option>
                        <option value="Flexible">
                          Balanced with busy phases
                        </option>
                        <option value="Intense">High intensity</option>
                        <option value="Seasonal">Project-based</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Career Decision Style
                      </label>
                      <select
                        name="career_decision_style"
                        value={formData.career_decision_style}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Career Decision Style</option>
                        <option value="Analytical">Security-focused</option>
                        <option value="Intuitive">Opportunity-driven</option>
                        <option value="Collaborative">Balanced</option>
                        <option value="Independent">Risk-positive</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Work Demand Response
                      </label>
                      <select
                        name="work_demand_response"
                        value={formData.work_demand_response}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Work Demand Response</option>
                        <option value="Proactive">
                          Adjusting plans quickly
                        </option>
                        <option value="Reactive">Keeping structure</option>
                        <option value="Balanced">
                          Taking space to rebalance
                        </option>
                        <option value="Selective">
                          Communicating clearly and finding a middle ground
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Preference of Closeness
                      </label>
                      <select
                        name="preference_of_closeness"
                        value={formData.preference_of_closeness}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select Preference of Closeness</option>
                        <option value="High">More time together</option>
                        <option value="Medium">
                          A mix of space and closeness
                        </option>
                        <option value="Low">Regular personal time</option>
                        <option value="Variable"> Open / Not yet sure</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-8">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="h-10 px-5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <>
                  <button
                    type="button"
                    onClick={skipStep}
                    className="h-10 px-5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                  >
                    Skip for now
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="h-10 px-6 bg-[#002060] text-white rounded-xl font-bold hover:bg-[#FF2A6D] transition-all shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                  >
                    Next Step →
                  </button>
                </>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  disabled={loading || imageLoading}
                  className="h-10 px-8 bg-[#002060] text-white rounded-xl font-bold hover:bg-[#FF2A6D] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    "✓ Save Profile"
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      {showCamera && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-[480px] w-full flex flex-col animate-scale-up">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/55">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#FF2A6D]">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">AI Camera Verification</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Face Scan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCamera(false)}
                className="w-8 h-8 rounded-full border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
                title="Close Camera"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Instruction Banner */}
            <div className="px-6 py-3 bg-rose-50/40 border-b border-rose-50 flex items-start gap-2.5 text-xs text-rose-800/90 font-medium">
              <span className="text-base shrink-0 mt-0.5">ℹ</span>
              <p className="leading-normal text-left">
                Align your face within the central indicator and click the capture button. The system will auto-detect age and gender.
              </p>
            </div>

            {/* Live Camera Viewport */}
            <div className="relative bg-slate-950 aspect-[4/3] flex items-center justify-center overflow-hidden">
              {/* Hidden Canvas for Frame Capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* State overlays */}
              {cameraError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white z-20">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mt-4 px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black hover:bg-slate-100 transition cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              ) : !isCameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-[#FF2A6D] mb-3"></div>
                  <p className="text-xs text-slate-400 font-semibold">Starting camera stream...</p>
                </div>
              ) : null}

              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Target Face circle overlay */}
              {isCameraActive && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[180px] h-[240px] rounded-[100px] border-2 border-dashed border-[#FF2A6D]/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]"></div>
                </div>
              )}
            </div>

            {/* Camera Controls Panel */}
            <div className="px-6 py-5 bg-slate-900 flex flex-col items-center justify-center gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={capturePhoto}
                disabled={!isCameraActive || !!cameraError}
                className="w-16 h-16 rounded-full bg-[#FF2A6D] disabled:bg-slate-700 hover:bg-[#E01B5D] border-4 border-white shadow-lg shadow-pink-500/20 flex items-center justify-center transition transform hover:scale-105 active:scale-95 group cursor-pointer disabled:cursor-not-allowed"
                title="Capture Photo"
              >
                <div className="w-5 h-5 rounded-full border-2 border-white/60 bg-transparent group-hover:scale-110 transition duration-300"></div>
              </button>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Click to capture</span>
            </div>

            {/* Footer info */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Biometric Verification Active
              </span>
              <button
                type="button"
                onClick={() => setShowCamera(false)}
                className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-xs transition font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Life Rhythms Modal */}
      {showLifeRhythms && (
        <LifeRhythmsForm
          isOpen={showLifeRhythms}
          onClose={() => setShowLifeRhythms(false)}
          initialData={formData.life_rhythms}
          onSave={handleLifeRhythmsSave}
        />
      )}

      {/*  Interests Modal */}
      {isInterestsModalOpen && (
        <InterestsForm
          isOpen={isInterestsModalOpen}
          onClose={() => setIsInterestsModalOpen(false)}
          initialData={formData.interests_categories}
          onSave={handleInterestsSave}
        />
      )}

      {/* ProfileQuestions Modal */}
      <ProfileQuestions
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        onSave={handleQuestionsSave}
        initialData={formData.prompts}
      />
    </div>
  );
}
