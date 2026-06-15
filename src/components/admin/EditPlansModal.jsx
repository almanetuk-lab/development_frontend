// import React from "react";

// export default function EditPlanModal({
//   formData,
//   handleChange,
//   handleUpdate,
//   setIsOpen,
// }){
//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-5 overflow-y-auto">
//       <div className="bg-white w-[400px] max-w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 animate-[fadeIn_0.3s_ease]">
//         <h3 className="text-center text-xl font-semibold mb-5">Edit Plan</h3>
//         <form onSubmit={handleUpdate} className="space-y-4">
//           {Object.keys(formData)
//             .filter(
//               (key) =>
//                 key !== "created_at" && key !== "updated_at" && key !== "id"
//             )
//             .map((key) => (
//               <div key={key} className="flex flex-col">
//                 <label
//                   htmlFor={key}
//                   className="text-sm font-semibold text-gray-700 mb-1 capitalize"
//                 >
//                   {key.replaceAll("_", " ")}
//                 </label>

//                 {/* 🔹 Type Field */}
//                 {key === "type" ? (
//                   <select
//                     name="type"
//                     id={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     required
//                     className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
//                   >
//                     <option value="">Select</option>
//                     <option value="Free">Free</option>
//                     <option value="Basic">Basic</option>
//                     <option value="Advance">Advance</option>
//                     <option value="Pro">Pro</option>
//                   </select>
//                 ) : key === "description" ? (
//                   // 🔹 Description → textarea
//                   <textarea
//                     name={key}
//                     id={key}
//                     value={formData[key] || ""}
//                     onChange={handleChange}
//                     rows="4"
//                     required
//                     className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 resize-none"
//                   ></textarea>
//                 ) : key === "name" ? (
//                   // 🔹 Name → text
//                   <input
//                     type="text"
//                     name={key}
//                     id={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     required
//                     className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
//                   />
//                 ) : (
//                   // 🔹 Everything else → number
//                   <input
//                     type="number"
//                     name={key}
//                     id={key}
//                     value={formData[key]}
//                     onChange={handleChange}
//                     required
//                     className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
//                   />
//                 )}
//               </div>
//             ))}

//           <div className="flex justify-between gap-4 mt-6">
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition shadow"
//             >
//               Update
//             </button>

//             <button
//               type="button"
//               onClick={() => setIsOpen(false)}
//               className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-medium transition shadow"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function EditPlanModal({
  formData,
  handleChange,
  handleUpdate,
  setIsOpen,
}) {
  const hiddenFields = ["id", "created_at", "updated_at","is_active","type"];

  console.log(formData);

  const renderField = (key) => {
    const value = formData[key] ?? "";

    switch (key) {
      case "name":
        return (
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleChange}
            required
            className="input"
          />
        );

      case "description":
         return (
          <input
            type="text"
            name={key}
            value={value}
            onChange={handleChange}
            required
            className="input"
          />
        );

      case "billing_info":
        return (
          <input
            name={key}
            value={value}
            onChange={handleChange}
            required
            className="input"
          />
        );

      case "price":
      case "duration":
        return (
          <input
            type="number"
            name={key}
            value={value}
            onChange={handleChange}
            required
            className="input"
          />
        );

      case "type":
        return (
          <select
            name={key}
            value={value}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select</option>
            <option value="Free">Free</option>
            <option value="Basic">Basic</option>
            <option value="Advance">Advance</option>
            <option value="Pro">Pro</option>
          </select>
        );

      // case "isActive":
      //   return (
      //     <select
      //       name={key}
      //       value={(value)}
      //       onChange={(e) =>
      //         handleChange({
      //           target: {
      //             name: key,
      //             value: e.target.value == "0" ? 0 : 1, // 🔥 string → boolean
      //           },
      //         })
      //       }
      //       className="input"
      //     >
      //       <option value="true">Active</option>
      //       <option value="false">Inactive</option>
      //     </select>
      //   );

      default:
       // if (key != "is_active") {
          return (
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              className="input"
            />
          );
       // }
    }
  };

  return (
    <div className="fixed inset-0 overflow-auto bg-black/60 flex items-center justify-center z-[999] p-5">
      <div
        className="
    bg-white
    w-full
    max-w-[420px]
    rounded-xl
    shadow-2xl
    p-6
    my-6
    max-h-[90vh]
    overflow-y-auto
  "
      >
        <h3 className="text-center text-xl font-semibold mb-5">Edit Plan</h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          {Object.keys(formData)
            .filter(
              (key) => !hiddenFields.includes(key) && formData[key] !== -1,
            )
            .map((key) => (
              <div key={key} className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1 capitalize">
                  {key.replaceAll("_", " ")}
                </label>
                {renderField(key)}
              </div>
            ))}

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium"
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px;
        }
      `}</style>
    </div>
  );
}
