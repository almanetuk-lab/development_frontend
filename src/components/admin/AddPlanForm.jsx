import React from "react";

export default function AddNewPlan({
  handleSubmit,
  handleChange,
  formData,
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
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mt-10">
      <h3 className="text-2xl font-semibold text-center mb-6">
        {editingId ? "Edit Plan" : "Add New Plan"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formData &&
          Object.keys(formData)
            .filter((key) => {
              // Always show basic fields
              if (alwaysShow.includes(key)) return true;
              // Only show if configuration allows it
              return configMapping[key] === 1;
            })
            .map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block font-semibold mb-1 capitalize"
                >
                  {key === "duration"
                    ? key.replace(/_/g, " in Months")
                    : key.replace(/_/g, " ")}
                </label>

                {/* Type Select */}
                {key === "type" ? (
                  <select
                    name="type"
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select</option>
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
                    onChange={handleChange}
                    rows="4"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 resize-none"
                  ></textarea>
                ) : key === "billing_info" ? (
                  <textarea
                    name={key}
                    id={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    rows="3"
                    placeholder="e.g. 119.99 billed every 12 months, 84.99 billed every 6 months..."
                    required
                    className="w-full border border-gray-300 rounded-md p-2 resize-none"
                  ></textarea>
                ) : key === "name" ? (
                  <input
                    type="text"
                    name={key}
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <input
                    type="number"
                    name={key}
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                )}
              </div>
            ))}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow transition duration-200"
          >
            {editingId ? "Update Plan" : "Add Plan"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
