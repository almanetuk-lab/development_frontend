import { useState, useEffect } from "react";

const LIFE_RHYTHMS_CONFIG = {
  work_rhythm: {
    label: "Work Rhythm",
    singles: {
      Focused:
        "I like working without distractions and staying deeply focused.",
      Balanced: "I keep a healthy balance between work and personal life.",
      Driven: "I like making progress and working toward meaningful goals.",
      Independent: "I prefer having control over my time and decisions.",
    },
    combinations: {
      "Focused and Balanced":
        "I stay focused in work while staying balanced between work and personal life.",
      "Focused and Driven":
        "I bring focused effort to my work and stay driven toward meaningful goals and targets.",
      "Focused and Independent":
        "I prefer focused work and being independent in how I manage my time.",
      "Balanced and Driven":
        "I stay driven in my career while keeping a balanced approach to life.",
      "Balanced and Independent":
        "I value being independent at work while maintaining a balanced routine.",
      "Driven and Independent":
        "I'm driven by outcomes and prefer working in an independent way.",
    },
  },

  social_energy: {
    label: "Social Energy",
    singles: {
      Selective: "I prefer a small circle and meaningful connections.",
      Intentional: "I'm thoughtful about how and when I spend social time.",
      Energetic: "I enjoy lively social moments when the mood is right.",
      Calm: "I prefer calm, low-pressure social interactions.",
    },
    combinations: {
      "Selective and Intentional":
        "I'm selective about who I spend time with and keep my connections intentional.",
      "Selective and Energetic":
        "I'm selective socially, but when I engage, I bring real energy.",
      "Selective and Calm":
        "I prefer a selective circle and enjoy calm, low-pressure interactions.",
      "Intentional and Energetic":
        "I'm intentional with people and bring energy to conversations that matter.",
      "Intentional and Calm":
        "I approach social time in an intentional and calm way.",
      "Energetic and Calm":
        "I enjoy being energetic when needed while staying calm overall.",
    },
  },

  life_pace: {
    label: "Life Pace",
    singles: {
      Steady: "I don't like feeling rushed in daily life.",
      Consistent: "I like routines I can rely on.",
      Flexible: "I'm okay adjusting when plans change.",
      Easygoing: "I let things flow without putting too much pressure on them.",
    },
    combinations: {
      "Steady and Consistent":
        "I prefer a steady pace of life and like things to stay consistent day to day.",
      "Steady and Flexible":
        "I move at a steady life pace but stay flexible when plans change.",
      "Steady and Easygoing":
        "I keep life steady and remain easygoing about how things unfold.",
      "Consistent and Flexible":
        "I value consistent routines while staying flexible when needed.",
      "Consistent and Easygoing":
        "I like a consistent rhythm without losing an easygoing attitude.",
      "Flexible and Easygoing":
        "I'm flexible by nature and generally easygoing about life.",
    },
  },

  emotional_style: {
    label: "Emotional Style",
    singles: {
      Aware: "I notice how people feel, even when they don't say it.",
      Curious: "I enjoy learning about people and how they think.",
      Calm: "I stay composed when emotions run high.",
      Grounded: "I stay emotionally steady and bounce back after challenges.",
    },
    combinations: {
      "Aware and Curious":
        "I'm emotionally aware and genuinely curious about people and perspectives.",
      "Aware and Calm":
        "I stay aware of emotions while remaining calm in my responses.",
      "Aware and Grounded":
        "I'm emotionally aware and stay grounded even in difficult moments.",
      "Curious and Calm":
        "I'm curious about others while keeping a calm emotional tone.",
      "Curious and Grounded":
        "I stay curious about life while remaining grounded in how I respond.",
      "Calm and Grounded": "I approach situations in a calm and grounded way.",
    },
  },
};

export default function LifeRhythmsForm({
  userId,
  initialData,
  onSave,
  onClose,
  isOpen = false,
}) {
  // INITIAL STATE
  const [formData, setFormData] = useState({
    work_rhythm: { single: "", combination: "", statement: "" },
    social_energy: { single: "", combination: "", statement: "" },
    life_pace: { single: "", combination: "", statement: "" },
    emotional_style: { single: "", combination: "", statement: "" },
  });

  // Load initial data from EditProfile
  useEffect(() => {
    if (initialData) {
      // Check if data is string or object
      let dataToLoad = initialData;

      // If it's a string (JSON string from database), parse it
      if (typeof initialData === "string") {
        try {
          dataToLoad = JSON.parse(initialData);
        } catch (error) {
          console.error("Error parsing life rhythms data:", error);
          dataToLoad = {};
        }
      }

      // Load data if available
      if (dataToLoad && typeof dataToLoad === "object") {
        setFormData({
          work_rhythm: dataToLoad.work_rhythm || {
            single: "",
            combination: "",
            statement: "",
          },
          social_energy: dataToLoad.social_energy || {
            single: "",
            combination: "",
            statement: "",
          },
          life_pace: dataToLoad.life_pace || {
            single: "",
            combination: "",
            statement: "",
          },
          emotional_style: dataToLoad.emotional_style || {
            single: "",
            combination: "",
            statement: "",
          },
        });
      }
    }
  }, [initialData]);

  // Handle selection change
  const handleSelectionChange = (category, type, value) => {
    const config = LIFE_RHYTHMS_CONFIG[category];

    let newData = { ...formData[category] };
    newData[type] = value;

    // Clear other type if one is selected
    if (type === "single") {
      newData.combination = "";
      newData.statement = config.singles[value] || "";
    } else if (type === "combination") {
      newData.single = "";
      newData.statement = config.combinations[value] || "";
    }

    setFormData((prev) => ({
      ...prev,
      [category]: newData,
    }));
  };

  // Get final JSON for database (EditProfile में save करने के लिए)
  const getFinalData = () => {
    // Remove empty objects
    const finalData = {};

    Object.keys(formData).forEach((category) => {
      const data = formData[category];
      if (data.single || data.combination) {
        finalData[category] = data;
      }
    });

    return finalData;
  };

  // Handle save
  const handleSave = () => {
    const finalData = getFinalData();

    // Call parent's onSave function with the data
    // This will be handled by EditProfile's handleSubmit
    onSave?.(finalData);

    // Close the modal
    onClose?.();
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      work_rhythm: { single: "", combination: "", statement: "" },
      social_energy: { single: "", combination: "", statement: "" },
      life_pace: { single: "", combination: "", statement: "" },
      emotional_style: { single: "", combination: "", statement: "" },
    });
  };

  // Render category section
  const renderCategory = (category) => {
    const config = LIFE_RHYTHMS_CONFIG[category];
    const data = formData[category];

    return (
      <div
        key={category}
        className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">{config.label}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Single Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select one word
            </label>
            <select
              value={data.single}
              onChange={(e) =>
                handleSelectionChange(category, "single", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose one --</option>
              {Object.keys(config.singles).map((word) => (
                <option key={word} value={word}>
                  {word}
                </option>
              ))}
            </select>

            {data.single && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: <span className="font-medium">{data.single}</span>
              </p>
            )}
          </div>

          {/* Combination Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or select combination
            </label>
            <select
              value={data.combination}
              onChange={(e) =>
                handleSelectionChange(category, "combination", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Choose combination --</option>
              {Object.keys(config.combinations).map((combo) => (
                <option key={combo} value={combo}>
                  {combo}
                </option>
              ))}
            </select>

            {data.combination && (
              <p className="text-xs text-gray-500 mt-1">
                Selected:{" "}
                <span className="font-medium">{data.combination}</span>
              </p>
            )}
          </div>
        </div>

        {/* Generated Statement */}
        {data.statement && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <div className="flex">
              <div className="mr-2 text-blue-500">💬</div>
              <p className="text-blue-800 font-medium">{data.statement}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Life Rhythms</h2>
              <p className="text-gray-600 mt-1">
                Describe your personal and work style
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mt-3 flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
            <span className="mr-2">ℹ️</span>
            For each category, select <strong>either</strong> a single word{" "}
            <strong>OR</strong> a combination
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {Object.keys(LIFE_RHYTHMS_CONFIG).map(renderCategory)}

          {/* Preview JSON */}
          <div className="mt-8 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-700">
                Data Preview (will be saved in EditProfile):
              </h3>
              <button
                onClick={handleReset}
                className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Reset All
              </button>
            </div>
            {/* <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-40 border">
              {JSON.stringify(getFinalData(), null, 2)}
            </pre> */}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-6 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Note:</span> This data will be saved
              when you click "Save" in EditProfile
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
