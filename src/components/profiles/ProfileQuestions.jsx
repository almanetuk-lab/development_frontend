import React, { useState, useEffect } from 'react';
import { theme } from "../comman/theme";

const inputClass = `w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-semibold placeholder-slate-400 focus:outline-hidden focus:border-[#002060] focus:ring-4 focus:ring-[#002060]/5 transition-all text-sm resize-none ${theme.tailwind.focusPink}`;

// Complete list of 8 questions
export const PROFILE_QUESTIONS = [
  {
    key: "small_habit",
    label: "A small habit that says a lot about me…",
    placeholder: "E.g., I always make my bed first thing in the morning..."
  },
  {
    key: "life_goal", 
    label: "What I'm genuinely trying to build in my life right now…",
    placeholder: "E.g., A sustainable business that helps local artisans..."
  },
  {
    key: "home_moment",
    label: "A moment that felt like home to me…",
    placeholder: "E.g., That evening when we all cooked together..."
  },
  {
    key: "belief_that_shapes_life",
    label: "One belief that quietly shapes how I live…",
    placeholder: "E.g., That small consistent efforts compound over time..."
  },
  {
    key: "appreciate_people",
    label: "Something I always appreciate in people…",
    placeholder: "E.g., When they remember small details about others..."
  },
  {
    key: "if_someone_knows_me",
    label: "If someone really knows me, they know…",
    placeholder: "E.g., That I need quiet time to recharge..."
  },
  {
    key: "what_makes_me_understood",
    label: "What makes me feel truly understood…",
    placeholder: "E.g., When someone gets my sense of humor..."
  },
  {
    key: "usual_day",
    label: "How my usual day looks like…",
    placeholder: "E.g., Morning workout, work from 9-6, evening reading..."
  }
];

const ProfileQuestions = ({
  profileId,
  initialData = {},
  onSave,
  onClose,
  isOpen = false
}) => {
  // State for answers
  const [answers, setAnswers] = useState({});
  const [characterCounts, setCharacterCounts] = useState({});

  useEffect(() => {
  if (initialData) {
    console.log("📥 ProfileQuestions - Initial Data:", initialData);
    
    let dataToLoad = initialData;

    if (initialData["question-key"]) {
      dataToLoad = initialData["question-key"];
      console.log("⚠️ Found question-key wrapper (legacy):", dataToLoad);
    }

    console.log("📥 Data to load:", dataToLoad);

    if (dataToLoad && typeof dataToLoad === "object") {
      const newAnswers = {};
      const newCounts = {};
      
      PROFILE_QUESTIONS.forEach(question => {
        newAnswers[question.key] = dataToLoad[question.key] || '';
        newCounts[question.key] = (dataToLoad[question.key] || '').length;
      });
      
      console.log("✅ Setting answers:", newAnswers);
      setAnswers(newAnswers);
      setCharacterCounts(newCounts);
    } else {
      console.log("⚠️ No valid data to load");
    }
  }
}, [initialData]);

  // Handle answer change
  const handleAnswerChange = (key, value) => {
    // Limit to 500 characters
    if (value.length > 500) return;
    
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
    
    setCharacterCounts(prev => ({
      ...prev,
      [key]: value.length
    }));
  };

  // Get final data in required format
  const getFinalData = () => {
    const finalData = {};
    
    PROFILE_QUESTIONS.forEach(question => {
      if (answers[question.key] && answers[question.key].trim() !== '') {
        finalData[question.key] = answers[question.key];
      }
    });
    
    console.log("💾 Final data to save:", finalData);
    
    return finalData;
  };

  // Handle save
  const handleSave = () => {
    const finalData = getFinalData();
    console.log("💾 Saving data to EditProfile:", finalData);
    onSave?.(finalData);
    onClose?.();
  };

  // Reset form
  const handleReset = () => {
    const resetAnswers = {};
    const resetCounts = {};
    
    PROFILE_QUESTIONS.forEach(question => {
      resetAnswers[question.key] = '';
      resetCounts[question.key] = 0;
    });
    
    setAnswers(resetAnswers);
    setCharacterCounts(resetCounts);
  };

  // If modal is not open, don't render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl h-[95vh] sm:h-[90vh] flex flex-col mx-auto modal-form-custom">
        
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 sm:p-5 md:p-6 border-b border-slate-100">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Tell Us More About Yourself
              </h2>
              <p className="text-slate-500 text-xs font-semibold mt-1">
                Answer these prompts to help others know you better
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

        {/* Content - Questions */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-6">
          {PROFILE_QUESTIONS.map((question, index) => (
            <div 
              key={question.key}
              className="p-5 border border-slate-100 rounded-3xl bg-slate-50/45 shadow-2xs"
            >
              {/* Question Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-white border border-slate-100 text-[#002060] rounded-xl text-xs sm:text-sm font-black shadow-3xs mr-2 sm:mr-3 shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-700 leading-snug">
                    {question.label}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md shadow-3xs">
                  {characterCounts[question.key] || 0}/500
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={answers[question.key] || ''}
                onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                placeholder={question.placeholder}
                rows="3"
                className={inputClass}
                maxLength={500}
              />

              {/* Character Counter */}
              <div className="flex justify-end mt-2">
                <div className={`text-[11px] font-bold ${
                  (characterCounts[question.key] || 0) > 450 
                    ? "text-red-500" 
                    : "text-slate-400"
                }`}>
                  {500 - (characterCounts[question.key] || 0)} characters remaining
                </div>
              </div>

              {/* Answer Preview */}
              {answers[question.key] && answers[question.key].trim() !== '' && (
                <div className="mt-4 p-4 bg-emerald-50/40 border border-emerald-100/50 rounded-2xl shadow-2xs">
                  <div className="flex items-center mb-2">
                    <span className="text-emerald-600 mr-2 text-sm font-bold">
                      ✓
                    </span>
                    <span className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider">
                      Your Answer
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold text-sm leading-relaxed">
                    {answers[question.key]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 sm:p-5 md:p-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            {/* Stats */}
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Answered:{" "}
              <span className="text-slate-800 font-black">
                {Object.values(answers).filter(answer => answer && answer.trim() !== '').length}
              </span> of {PROFILE_QUESTIONS.length} questions
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-none h-10 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none h-10 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-none h-10 px-6 bg-[#002060] text-white rounded-xl font-bold hover:bg-[#FF2A6D] transition flex items-center justify-center text-xs sm:text-sm cursor-pointer shadow-2xs"
              >
                Save Answers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuestions;









