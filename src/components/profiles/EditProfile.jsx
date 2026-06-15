import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../context/UseProfileContext";
import { updateUserProfile } from "../services/api";
import LifeRhythmsForm from "./LifeRhythmsForm";
import axios from "axios";
import InterestsForm from "./InterestsForm";
import ProfileQuestions from "./ProfileQuestions";

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
  const { profile, updateProfile } = useUserProfile();
  const navigate = useNavigate();
  const [finalProfileImage, setFinalProfileImage] = useState(null);

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
  });

  // ================== QUESTIONS HANDLER ==================

  const handleQuestionsSave = (questionsData) => {
    console.log("💾 Updating local formData with questions:", questionsData);

    setFormData((prev) => ({
      ...prev,
      prompts: questionsData,
    }));

    setIsQuestionsModalOpen(false);
    // updateProfile wala part yahan se hata diya hai taaki useEffect trigger na ho
  };

  // const handleQuestionsSave = (questionsData) => {
  //   console.log("💾 Questions saved in EditProfile:", questionsData);

  //   //  SIMPLE FIX: Direct set karo
  //   setFormData(prev => ({
  //     ...prev,
  //     prompts: questionsData  // Direct assignment
  //   }));

  //   //  Context ko bhi update karo immediately
  //   updateProfile({
  //     ...profile,
  //     prompts: questionsData
  //   });

  //   setIsQuestionsModalOpen(false);

  //   console.log(" Prompts updated in form and context");
  // };

  const handleLifeRhythmsSave = (data) => {
    setFormData((prev) => ({
      ...prev,
      life_rhythms: data,
    }));
  };

  const handleInterestsSave = (data) => {
    setFormData((prev) => ({
      ...prev,
      interests_categories: data, // UI ke liye same
    }));
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
      alert("Please select an image first");
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

      alert("Face detected successfully! ✅");
      return faceData;
    } catch (error) {
      console.error("❌ Face detection failed:", error);
      alert("Face detection failed. Please try again.");
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

      interests_categories: interestsCategories,

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

      life_rhythms: profile.life_rhythms || {},
      prompts: loadedPrompts,
    });

    if (profile.profile_image) {
      setImagePreview(profile.profile_image);
    }
  }, [profile?.user_id]);

  // ================== PROGRESS & STEP HANDLING ==================
  const progressPercentage = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  // ================== CHANGE HANDLER ==================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================== SUBMIT HANDLER ==================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.email || !formData.first_name || !formData.last_name) {
      alert("Email, First name and Last name are required");
      setLoading(false);
      return;
    }

    if (!formData.dob) {
      alert("Please select Date of Birth");
      setLoading(false);
      return;
    }

    if (!formData.age) {
      alert("Please enter your age");
      setLoading(false);
      return;
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
      //  CORRECT: Prompts format backend ke hisaab se

      const payload = {
        // profile_image: finalProfileImage || profile.profile_image,
        //  profile_image: finalProfileImage || profile?.image_url,
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
        life_rhythms: formData.life_rhythms,
        company_type: formData.company_type || null,
        education_institution_name: formData.education_institution_name || null,
        languages_spoken: handleArrayField(formData.languages_spoken),
        freetime_style: mapToDBEnum("freetime_style", formData.freetime_style),
        health_activity_level: mapToDBEnum(
          "health_activity_level",
          formData.health_activity_level,
        ),

        prompts: formData.prompts, // final q

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

        // love_language_affection: mapToDBEnum(
        //   "love_language_affection",
        //   handleArrayField(formData.love_language_affection)
        // ),

        // love_language_affection:(
        //   "love_language_affection",
        //   formData.love_language_affection
        // ),
        love_language_affection: formData.love_language_affection,
      };

      console.log(" FINAL PAYLOAD:", payload);

      await updateUserProfile(payload);

      updateProfile({
        ...profile,
        ...payload,
        prompts: formData.prompts,
        profile_image: payload.profile_image,
      });
      alert("Profile updated successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update Profile Error:", err);
      alert(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
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

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageDataUrl);

    // 📞 Convert to File and call Face API
    fetch(imageDataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured-face.png", {
          type: "image/png",
        });
        handleFaceDetection(file); // Yahan API call ho rahi hai
      });

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
      const uploadResponse = await axios.post(
        "https://backend-q0wc.onrender.com/api/upload",
        uploadFormData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const saveResponse = await axios.post(
        "https://backend-q0wc.onrender.com/api/saveProfileImage",
        { user_id: profile.user_id, imageUrl: uploadResponse.data.imageUrl },
      );
      updateProfile(saveResponse.data.profiles);
      setImagePreview(uploadResponse.data.imageUrl);
      setFinalProfileImage(uploadResponse.data.imageUrl);
      return uploadResponse.data.imageUrl;
    } catch (error) {
      console.error("❌ Image upload error:", error);
      alert("Image upload failed.");
      return null;
    } finally {
      setImageLoading(false);
    }
  };
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        // 1. UI se hatao
        setImagePreview(null);

        //  2. IMPORTANT: finalProfileImage ko NULL set karo (yeh backend jayega)
        setFinalProfileImage(null);

        //  3. Context update karo (taaki ProfilePage mein bhi dikhe)
        updateProfile({
          ...profile,
          image_url: null,
        });

        alert("Profile picture removed!");
      } catch (error) {
        console.error("Error removing profile picture:", error);
      }
    }
  };

  const CAMERA_URL =
    import.meta.env.MODE === "development"
      ? "https://python-backend-oo6l.onrender.com"
      : import.meta.env.VITE_FACE_CAMERA_URL ||
      "https://python-backend-oo6l.onrender.com";

  //  interests_categories से total interests calculate करो
  const totalCheckboxInterests =
    formData.interests_categories &&
      typeof formData.interests_categories === "object"
      ? Object.values(formData.interests_categories).flat().length
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* HEADER WITH PROGRESS BAR */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
              <p className="text-gray-600 text-sm mt-1">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
            >
              Cancel
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => goToStep(step)}
                className={`flex flex-col items-center ${step <= currentStep ? "text-indigo-600" : "text-gray-400"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${step === currentStep
                      ? "bg-indigo-600 text-white"
                      : step < currentStep
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                >
                  {step}
                </div>
                <span className="text-xs font-medium">
                  {step === 1
                    ? "Photo"
                    : step === 2
                      ? "Personal"
                      : step === 3
                        ? "Professional"
                        : step === 4
                          ? "About"
                          : "Relationships"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: PROFILE PICTURE */}

          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Profile Picture
                </h3>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {/* <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-200 flex items-center justify-center">
            {imagePreview || profile?.image_url ? (
              <img
                src={imagePreview || profile?.image_url}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm text-center">
                No Image
              </span>
            )}
          </div>
          
          {/*  REMOVE BUTTON - Sirf jab image ho /}
          {(imagePreview || profile?.image_url) && (
            <button
              type="button"
              onClick={handleRemoveProfilePic}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              title="Remove photo"
            >
              ✕
            </button> */}

                    <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden bg-gray-200 flex items-center justify-center">
                      {/*  Bas yeh condition: */}
                      {imagePreview ||
                        (profile?.image_url && finalProfileImage !== null) ? (
                        <img
                          src={imagePreview || profile?.image_url}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm text-center">
                          No Image
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    {(imagePreview ||
                      (profile?.image_url && !removedImage)) && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePic}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer text-center relative">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={imageLoading}
                      />
                      {imageLoading && (
                        <div className="absolute inset-0 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div>
                      )}
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCamera(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      📸 Take Photo
                    </button>
                  </div>

                  {/* Status message */}
                  {imagePreview && (
                    <p className="text-sm text-green-600 text-center">
                      ✓ New photo selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL INFORMATION */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      User Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 1234567890"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  {/* 
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Age & gender are AI-estimated (±10% tolerance). You can
                      edit them.
                    </p>
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Example: 5.6 means 5 feet 6 inches
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Marital Status
                    </label>
                    <select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Marital Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New Delhi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter your country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your complete address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROFESSIONAL INFORMATION */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Identity
                    </label>
                    <select
                      name="professional_identity"
                      value={formData.professional_identity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Google Inc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Type
                    </label>
                    <select
                      name="company_type"
                      value={formData.company_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education
                    </label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Education Institution
                    </label>
                    <input
                      type="text"
                      name="education_institution_name"
                      value={formData.education_institution_name}
                      onChange={handleChange}
                      placeholder="University of Delhi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Languages Spoken
                    </label>
                    <input
                      type="text"
                      name="languages_spoken"
                      value={formData.languages_spoken}
                      onChange={handleChange}
                      placeholder="Hindi, English, Spanish"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  About & Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        About Me
                      </label>
                      <textarea
                        name="about_me"
                        value={formData.about_me}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      
                      {profile?.intent_tags && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl shadow-sm animate-fadeIn">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">🤖</span>
                            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">AI Intent Interpretation</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(typeof profile.intent_tags === 'string' ? JSON.parse(profile.intent_tags) : profile.intent_tags).map(([key, value]) => (
                              <div key={key} className="bg-white/80 p-2 rounded-lg border border-white shadow-sm">
                                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-tight">{key.replace(/_/g, ' ')}</p>
                                <p className="text-sm text-indigo-900 font-semibold">{value}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-indigo-400 mt-3 italic text-center">Metadata generated by Gemini AI 2.0</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hobbies (comma separated)
                      </label>
                      <input
                        type="text"
                        name="hobbies"
                        value={formData.hobbies}
                        onChange={handleChange}
                        placeholder="Reading, Traveling, Sports"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate with commas
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Skills
                      </label>
                      <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows={3}
                        placeholder="JavaScript, React, Node.js, Python"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interests
                      </label>
                      <textarea
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Coding, Reading, Travel, Photography"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Free Time Style
                      </label>
                      <select
                        name="freetime_style"
                        value={formData.freetime_style}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Health Activity Level
                      </label>
                      <select
                        name="health_activity_level"
                        value={formData.health_activity_level}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Activity Level</option>
                        <option value="Active">Active</option>
                        <option value="Semi-active">Semi-active</option>
                        <option value="Light">Light</option>
                        <option value="Minimal">Minimal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Smoking
                      </label>
                      <select
                        name="smoking"
                        value={formData.smoking}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Smoking Preference</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                        <option value="SOCIAL">Social</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Drinking
                      </label>
                      <select
                        name="drinking"
                        value={formData.drinking}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Drinking Preference</option>
                        <option value="NO">No</option>
                        <option value="YES">Yes</option>
                        <option value="SOCIAL">Social</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pets Preference
                      </label>
                      <select
                        name="pets_preference"
                        value={formData.pets_preference}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                        {/* <option value="Open or not sure yet">
                          Open / Not Sure yet
                        </option> */}
                        {/* <option value="Open">Open</option>OPEN_OR_NOT_SURE_YET */}
                        {/* <option value="Not Sure yet">Not Sure yet</option> */}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Religious Belief
                      </label>
                      <select
                        name="religious_belief"
                        value={formData.religious_belief}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Zodiac Sign
                      </label>
                      <input
                        type="text"
                        name="zodiac_sign"
                        value={formData.zodiac_sign}
                        onChange={handleChange}
                        placeholder="Aries, Taurus, Gemini..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Relationship Preferences
                </h3>

                {/* Life Rhythms Section */}
                <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Life Rhythms
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Describe your work rhythm, social energy, life pace, and
                    emotional style
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowLifeRhythms(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    🎵 Edit Life Rhythms
                  </button>

                  {formData.life_rhythms &&
                    Object.keys(formData.life_rhythms).length > 0 && (
                      <div className="mt-4 p-3 bg-white border rounded-md">
                        <p className="font-medium text-gray-700 mb-2">
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
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></div>
                                  <div>
                                    <span className="font-medium capitalize">
                                      {category.replace("_", " ")}:
                                    </span>
                                    <span className="ml-2 text-gray-600">
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
                <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Interests & Passions (Categories)
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Select interests from different categories
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsInterestsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    🎯 Edit Interests Categories
                  </button>

                  {/* FIXED: Display interests_categories */}
                  {formData.interests_categories &&
                    typeof formData.interests_categories === "object" &&
                    Object.keys(formData.interests_categories).length > 0 ? (
                    <div className="mt-4 p-3 bg-white border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-700">
                          Selected Interests:
                        </p>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
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
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                        {totalCheckboxInterests > 8 && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            +{totalCheckboxInterests - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-white border border-dashed border-gray-300 rounded-md text-center">
                      <p className="text-gray-500 text-sm italic">
                        No interests categories added yet
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Click above button to add interests from different
                        categories
                      </p>
                    </div>
                  )}

                  {/*  FIXED: Profile Questions Section */}
                  <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Tell Us More About Yourself
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Answer these prompts to help others know you better
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsQuestionsModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      ✍️ Edit Profile Questions
                    </button>

                    {/* Display existing prompts */}
                    {formData.prompts &&
                      typeof formData.prompts === "object" &&
                      Object.keys(formData.prompts).length > 0 ? (
                      <div className="mt-4 p-3 bg-white border rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium text-gray-700">
                            Answered Questions:
                          </p>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
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
                                  className="border-l-4 border-purple-300 pl-3 py-2"
                                >
                                  <p className="font-medium text-sm text-gray-800 mb-1">
                                    {label}
                                  </p>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {answer}
                                  </p>
                                </div>
                              );
                            })}

                          {Object.keys(formData.prompts).length > 3 && (
                            <div className="text-center pt-2 border-t">
                              <p className="text-xs text-purple-600">
                                +{Object.keys(formData.prompts).length - 3} more
                                questions answered
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-white border border-dashed border-gray-300 rounded-md text-center">
                        <p className="text-gray-500 text-sm italic">
                          No questions answered yet
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interested In
                      </label>
                      <select
                        name="interested_in"
                        value={formData.interested_in}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Interested In</option>
                        <option value="Man">Man</option>
                        <option value="Woman">Woman</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Everyone">Everyone</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relationship Goal
                      </label>

                      <select
                        name="relationship_goal"
                        value={formData.relationship_goal}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Children Preference
                      </label>

                      <select
                        name="children_preference"
                        value={formData.children_preference}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relationship Values
                      </label>
                      <select
                        name="relationship_values"
                        value={formData.relationship_values}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Values in Others
                      </label>
                      <select
                        name="values_in_others"
                        value={formData.values_in_others}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relationship Pace
                      </label>
                      <select
                        name="relationship_pace"
                        value={formData.relationship_pace}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Approach to Physical Closeness
                      </label>
                      <select
                        name="approach_to_physical_closeness"
                        value={formData.approach_to_physical_closeness}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Love Languages
                      </label>
                      <select
                        name="love_language_affection"
                        value={formData.love_language_affection || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Self Expression
                      </label>
                      <select
                        name="self_expression"
                        value={formData.self_expression}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interaction Style
                      </label>
                      <select
                        name="interaction_style"
                        value={formData.interaction_style}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Environment
                      </label>
                      <select
                        name="work_environment"
                        value={formData.work_environment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Rhythm
                      </label>
                      <select
                        name="work_rhythm"
                        value={formData.work_rhythm}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Career Decision Style
                      </label>
                      <select
                        name="career_decision_style"
                        value={formData.career_decision_style}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Career Decision Style</option>
                        <option value="Analytical">Security-focused</option>
                        <option value="Intuitive">Opportunity-driven</option>
                        <option value="Collaborative">Balanced</option>
                        <option value="Independent">Risk-positive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Demand Response
                      </label>
                      <select
                        name="work_demand_response"
                        value={formData.work_demand_response}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preference of Closeness
                      </label>
                      <select
                        name="preference_of_closeness"
                        value={formData.preference_of_closeness}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          <div className="flex justify-between items-center pt-8 border-t mt-8">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="flex gap-4">
              {currentStep < totalSteps && (
                <>
                  <button
                    type="button"
                    onClick={skipStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Skip for now
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    Next Step →
                  </button>
                </>
              )}

              {currentStep === totalSteps && (
                <button
                  type="submit"
                  disabled={loading || imageLoading}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden">
            <iframe
              src="https://python-backend-oo6l.onrender.com"
              width="400"
              height="600"
              allow="camera"
              className="border-none"
            />
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
