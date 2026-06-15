import React from "react";

export default function DeleteConfirmModal({ setShowDelete, confirmDelete }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[999] p-5 overflow-y-auto">

            <div className="bg-white p-6 rounded-xl w-[350px] max-w-[90%] shadow-xl animate-fadeIn">

                <h3 className="text-center text-lg font-semibold mb-6">
                    Are you sure to delete?
                </h3>

                <div className="flex justify-between">
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        onClick={confirmDelete}
                    >
                        Yes, Delete
                    </button>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => setShowDelete(false)}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

