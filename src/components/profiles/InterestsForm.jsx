import { useState, useEffect } from "react";
import { theme } from "../comman/theme";

const inputClass = `w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-2xs outline-none transition duration-200 hover:border-slate-300 ${theme.tailwind.focusPink}`;

const INTERESTS_CONFIG = {
  creative_cultural: {
    label: "Creative and Cultural",
    options: {
      "Arts": "Visual arts, painting, drawing, sculpture",
      "Crafts": "Handmade crafts, pottery, knitting",
      "Design": "Graphic design, interior design, fashion design",
      "Photography": "Photography, photo editing, nature photography",
      "Literature": "Reading books, writing, poetry, novels",
      "Music": "Listening to music, playing instruments",
      "Movies & Series": "Watching movies, TV series, documentaries",
      "Plays": "Theatre plays, drama, stage performances"
    }
  },

  lifestyle_exploration: {
    label: "Lifestyle and Exploration",
    options: {
      "Gardening & Plants": "Gardening, plant care, indoor plants",
      "Podcasts": "Listening to podcasts, audio content",
      "Slow living/Quiet time": "Slow living, meditation, quiet moments",
      "Cooking & Baking": "Cooking, baking, recipe experimentation",
      "Dining out & Cafes": "Eating out, cafe hopping, food exploration",
      "Travel & Exploration": "Traveling, exploring new places",
      "Nature & Wildlife": "Nature walks, wildlife observation",
      "Automotive": "Cars, motorbikes, automotive technology"
    }
  },

  mind_purpose: {
    label: "Mind and Purpose",
    options: {
      "Spirituality": "Spiritual practices, meditation, mindfulness",
      "Science and Technology": "Science, tech innovations, gadgets",
      "Digital Trends": "Digital trends, social media, online culture",
      "Self-Development": "Personal growth, self-improvement",
      "DIY Projects": "Do-it-yourself projects, home improvements",
      "Video Games": "Gaming, video game culture",
      "Social Causes": "Volunteering, social work, community service",
      "Events and Cultural Outings": "Cultural events, exhibitions, festivals"
    }
  },

  sports_activity: {
    label: "Sports & Activity",
    options: {
      "Gym / Workouts": "Gym workouts, fitness training",
      "Running": "Running, jogging, marathons",
      "Walking": "Walking, hiking, trekking",
      "Yoga & Pilates": "Yoga, pilates, flexibility exercises",
      "Football": "Football, soccer",
      "Cricket": "Cricket, batting, bowling",
      "Basketball": "Basketball, hoops",
      "Tennis": "Tennis, racquet sports",
      "Swimming": "Swimming, water sports",
      "Boxing": "Boxing, martial arts",
      "Martial Arts": "Karate, judo, taekwondo",
      "Adventure Sports": "Adventure sports, extreme activities",
      "Not very sporty": "Not very active in sports"
    }
  },

  music_genres: {
    label: "Music Genres",
    options: {
      "Pop": "Popular music, mainstream hits",
      "Rock": "Rock music, classic rock, alternative rock",
      "Indie": "Independent music, indie bands",
      "Alternative": "Alternative music, non-mainstream",
      "Electronic/Dance": "Electronic, EDM, dance music",
      "Hip-hop/Rap": "Hip-hop, rap music",
      "Jazz": "Jazz, blues, soul",
      "Classical/Instrumental": "Classical music, instrumental",
      "World": "World music, cultural music",
      "Spiritual/Ambient": "Spiritual, ambient, meditation music",
      "Folk": "Folk music, traditional",
      "Metal": "Metal, heavy metal"
    }
  }
};

export default function InterestsForm({
  userId,
  initialData,
  onSave,
  onClose,
  isOpen = false
}) {
  // INITIAL STATE
  const [formData, setFormData] = useState({
    creative_cultural: [],
    lifestyle_exploration: [],
    mind_purpose: [],
    sports_activity: [],
    music_genres: []
  });

  // Search state
  const [searchTerms, setSearchTerms] = useState({
    creative_cultural: "",
    lifestyle_exploration: "",
    mind_purpose: "",
    sports_activity: "",
    music_genres: ""
  });

  // Load initial data
  useEffect(() => {
    if (initialData) {
      let dataToLoad = initialData;

      if (typeof initialData === "string") {
        try {
          dataToLoad = JSON.parse(initialData);
        } catch (error) {
          console.error("Error parsing interests data:", error);
          dataToLoad = {};
        }
      }

      if (dataToLoad && typeof dataToLoad === "object") {
        const newFormData = { ...formData };
        
        Object.keys(newFormData).forEach(category => {
          if (Array.isArray(dataToLoad[category])) {
            newFormData[category] = dataToLoad[category];
          }
        });
        
        setFormData(newFormData);
      }
    }
  }, [initialData]);

  // Handle checkbox change
  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const currentArray = [...prev[category]];
      
      if (currentArray.includes(value)) {
        return {
          ...prev,
          [category]: currentArray.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...currentArray, value]
        };
      }
    });
  };

  // Handle select all
  const handleSelectAll = (category) => {
    const config = INTERESTS_CONFIG[category];
    const allOptions = Object.keys(config.options);
    
    setFormData(prev => ({
      ...prev,
      [category]: allOptions
    }));
  };

  // Handle clear all
  const handleClearAll = (category) => {
    setFormData(prev => ({
      ...prev,
      [category]: []
    }));
  };

  // Handle search change
  const handleSearchChange = (category, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [category]: value.toLowerCase()
    }));
  };

  // Filter options based on search
  const getFilteredOptions = (category) => {
    const config = INTERESTS_CONFIG[category];
    const searchTerm = searchTerms[category];
    
    if (!searchTerm) return Object.entries(config.options);
    
    return Object.entries(config.options).filter(([key, description]) => 
      key.toLowerCase().includes(searchTerm) || 
      description.toLowerCase().includes(searchTerm)
    );
  };

  // Get final JSON for database
  const getFinalData = () => {
    const finalData = {};
    
    Object.keys(formData).forEach(category => {
      if (formData[category].length > 0) {
        finalData[category] = formData[category];
      }
    });
    
    return finalData;
  };

  // Handle save
  const handleSave = () => {
    const finalData = getFinalData();
    onSave?.(finalData);
    onClose?.();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      creative_cultural: [],
      lifestyle_exploration: [],
      mind_purpose: [],
      sports_activity: [],
      music_genres: []
    });
    
    setSearchTerms({
      creative_cultural: "",
      lifestyle_exploration: "",
      mind_purpose: "",
      sports_activity: "",
      music_genres: ""
    });
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col mx-auto modal-form-custom">
        
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 sm:p-5 md:p-6 border-b border-slate-100">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Interests & Passions
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Select multiple interests from each category
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-slate-400 hover:text-slate-600 -mt-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-6">
          {Object.keys(INTERESTS_CONFIG).map(category => (
            <div 
              key={category} 
              className="p-5 border border-slate-100 rounded-3xl bg-slate-50/45 shadow-2xs"
            >
              
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                  {INTERESTS_CONFIG[category].label}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Selected:{" "}
                    <span className="font-extrabold text-[#002060]">
                      {formData[category].length}
                    </span>
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={`Search ${INTERESTS_CONFIG[category].label.toLowerCase()}...`}
                  value={searchTerms[category]}
                  onChange={(e) => handleSearchChange(category, e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {getFilteredOptions(category).map(([key, description]) => (
                  <div
                    key={key}
                    className={`p-3 border rounded-2xl cursor-pointer transition-all text-sm ${
                      formData[category].includes(key)
                        ? "border-[#002060] bg-[#002060]/5 text-[#002060]"
                        : "border-slate-150 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                    onClick={() => handleCheckboxChange(category, key)}
                  >
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData[category].includes(key)}
                        onChange={() => handleCheckboxChange(category, key)}
                        className="mt-1 mr-3 h-4 w-4 rounded text-[#002060] focus:ring-[#002060] border-slate-300"
                      />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          {key}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed line-clamp-2">
                          {description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => handleSelectAll(category)}
                  className="h-8 px-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition text-xs cursor-pointer"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => handleClearAll(category)}
                  className="h-8 px-3.5 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition text-xs cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Selected Preview */}
              {formData[category].length > 0 && (
                <div className="mt-4 p-4 bg-emerald-50/40 border border-emerald-100/50 rounded-2xl">
                  <div className="flex items-center mb-3">
                    <span className="text-emerald-600 mr-2 text-sm font-bold">
                      ✓
                    </span>
                    <span className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider">
                      Selected ({formData[category].length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData[category].map(item => (
                      <span
                        key={item}
                        className="px-2.5 py-1 bg-white border border-emerald-100 text-emerald-800 text-xs font-bold rounded-full shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 sm:p-5 md:p-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Selected:{" "}
              <span className="text-slate-800 font-black">{Object.values(formData).flat().length}</span> interests
            </div>
            
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none h-10 px-5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-none h-10 px-6 bg-[#002060] text-white rounded-xl font-bold hover:bg-[#FF2A6D] transition flex items-center justify-center text-xs sm:text-sm cursor-pointer shadow-2xs"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}