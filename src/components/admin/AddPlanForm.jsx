import React from "react";

export default function AddNewPlan({
  handleSubmit,
  handleChange,
  formData,
  setFormData,
  config = {},
  editingId,
  setEditingId,
  onCancel,
}) {
  // Always visible fields
  const alwaysShow = [
    "name",
    "description",
    "duration",
    "type",
    "billing_info",
    "price",
  ];

  // Config-based field mapping
  const configMapping = {
    video_call_limit: config?.check_video_call_limit,
    audio_call_limit: config?.check_audio_call_limit,
    people_message_limit: config?.check_message_limit,
    people_search_limit: config?.check_search_limit,
  };

  const limitFields = [
    "video_call_limit",
    "audio_call_limit",
    "people_search_limit",
    "people_message_limit",
  ];

  const handleLocalChange = (e) => {
    const { name, value } = e.target;

    if (limitFields.includes(name)) {
      if (value === "") {
        handleChange(e);
        return;
      }

      // Stop negative values other than -1 and minus prefix
      if (value.startsWith("-") && value !== "-1" && value !== "-") {
        return;
      }

      // Clear leading zeroes: e.g. "05" -> "5"
      if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
        const cleanedValue = parseInt(value, 10).toString();
        e.target.value = cleanedValue;
      }
    }
    handleChange(e);
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    for (const field of limitFields) {
      if (formData[field] !== undefined) {
        const val = Number(formData[field]);
        if (val < -1) {
          alert(`The field "${field.replace(/_/g, " ")}" must be -1 (for unlimited) or 0 or greater.`);
          return;
        }
      }
    }
    handleSubmit(e);
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="text-center mb-8 border-b border-slate-100 pb-5">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          {editingId ? "Edit Subscription Plan" : "Add New Subscription Plan"}
        </h3>
        <p className="text-xs text-slate-400 mt-1 font-semibold">
          Configure access limits and billing info for this tier
        </p>
      </div>

      {/* Template selector buttons */}
      {setFormData && !editingId && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
            ⚡ Quick Plan Templates
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                label: "Free Plan",
                type: "Free",
                values: {
                  name: "Free Trial Tier",
                  description: "Standard entrance tier with restricted search capabilities and messaging quotas.",
                  price: 0,
                  duration: 1,
                  video_call_limit: 0,
                  people_search_limit: 5,
                  people_message_limit: 5,
                  audio_call_limit: 0,
                  type: "Free",
                  billing_info: "£0 billed monthly (free tier access)",
                }
              },
              {
                label: "Basic Plan",
                type: "Basic",
                values: {
                  name: "Basic Growth Tier",
                  description: "For users looking to initiate direct connection matches with audio limit inclusions.",
                  price: 9.99,
                  duration: 1,
                  video_call_limit: 10,
                  people_search_limit: 50,
                  people_message_limit: 20,
                  audio_call_limit: 30,
                  type: "Basic",
                  billing_info: "£9.99 billed monthly",
                }
              },
              {
                label: "Advance Plan",
                type: "Advance",
                values: {
                  name: "Advance Connection Tier",
                  description: "Perfect tier for moderate matching sessions, increased searches, and video calls.",
                  price: 24.99,
                  duration: 3,
                  video_call_limit: 60,
                  people_search_limit: 250,
                  people_message_limit: 100,
                  audio_call_limit: 180,
                  type: "Advance",
                  billing_info: "£24.99 billed quarterly",
                }
              },
              {
                label: "Pro Plan",
                type: "Pro",
                values: {
                  name: "Pro Platinum Tier",
                  description: "Elite subscription access with heavy call allocations, message counts, and dedicated status.",
                  price: 49.99,
                  duration: 12,
                  video_call_limit: 300,
                  people_search_limit: 1000,
                  people_message_limit: 1000,
                  audio_call_limit: 900,
                  type: "Pro",
                  billing_info: "£49.99 billed annually",
                }
              }
            ].map((tmpl) => (
              <button
                key={tmpl.type}
                type="button"
                onClick={() => setFormData(tmpl.values)}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 transition active:scale-95 text-center flex flex-col items-center justify-center gap-1 hover:border-[#FF2A6D]/30"
              >
                <span className="text-[10px] uppercase font-black text-slate-800">{tmpl.label}</span>
                <span className="text-[9px] text-[#FF2A6D] font-semibold">Prefill</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleLocalSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {formData &&
            Object.keys(formData)
              .map((key) => {
                const isFullWidth = key === "description" || key === "billing_info" || key === "name";
                const isLimitField = limitFields.includes(key);
                return (
                  <div key={key} className={isFullWidth ? "sm:col-span-2" : ""}>
                    <label
                      htmlFor={key}
                      className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center justify-between"
                    >
                      <span>
                        {key === "duration"
                          ? "Duration in Days"
                          : key.replace(/_/g, " ")}
                      </span>
                      {configMapping[key] === 0 && (
                        <span className="text-[9px] font-bold text-rose-500 lowercase tracking-normal">
                          (Globally Disabled)
                        </span>
                      )}
                    </label>

                    {/* Type Select */}
                    {key === "type" ? (
                      <select
                        name="type"
                        id={key}
                        value={formData[key]}
                        onChange={handleLocalChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-bold text-slate-700 transition-all duration-150 cursor-pointer"
                      >
                        <option value="">Select Tier</option>
                        <option value="Free">Free</option>
                        <option value="Basic">Basic</option>
                        <option value="Advance">Advance</option>
                        <option value="Pro">Pro</option>
                      </select>
                    ) : key === "description" ? (
                      <textarea
                        name={key}
                        id={key}
                        value={formData[key] || ""}
                        onChange={handleLocalChange}
                        rows="3"
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150 resize-none"
                      ></textarea>
                    ) : key === "billing_info" ? (
                      <textarea
                        name={key}
                        id={key}
                        value={formData[key] || ""}
                        onChange={handleLocalChange}
                        rows="3"
                        placeholder="e.g. 119.99 billed every 12 months, 84.99 billed every 6 months..."
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150 resize-none"
                      ></textarea>
                    ) : key === "name" ? (
                      <input
                        type="text"
                        name={key}
                        id={key}
                        value={formData[key]}
                        onChange={handleLocalChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150"
                      />
                    ) : (
                      <div>
                        <input
                          type="number"
                          name={key}
                          id={key}
                          value={formData[key]}
                          onChange={handleLocalChange}
                          required
                          min={isLimitField ? "-1" : "0"}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002060] focus:border-transparent outline-none text-xs font-semibold text-slate-800 transition-all duration-150"
                        />
                        {isLimitField && (
                          <div className="mt-1.5 flex items-center justify-between text-[10px] font-semibold leading-none">
                            <span className="text-slate-400">
                              Set to <code className="bg-slate-100 px-1 py-0.5 rounded text-[#002060] font-mono font-bold">-1</code> for Unlimited
                            </span>
                            {Number(formData[key]) === -1 ? (
                              <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                <i className="fa-solid fa-sparkles text-[8px]"></i>
                                Unlimited
                              </span>
                            ) : Number(formData[key]) < -1 ? (
                              <span className="text-rose-500 font-bold">
                                ⚠️ Must be -1 or greater
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex-1 bg-[#002060] hover:bg-[#001740] text-white font-bold py-3 px-4 rounded-xl shadow-xs transition duration-200 text-xs uppercase tracking-wider"
          >
            {editingId ? "Update Plan" : "Create Plan"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl transition duration-200 text-xs uppercase tracking-wider"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
