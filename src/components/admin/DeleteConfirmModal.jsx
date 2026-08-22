import React from "react";

export default function DeleteConfirmModal({ setShowDelete, confirmDelete }) {
    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-[999] p-5 overflow-y-auto">
            <div className="bg-white p-7 rounded-2xl w-[350px] max-w-[90%] border border-slate-200/60 shadow-2xl animate-fade-in text-center">
                
                <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-500 text-lg">
                    <i className="fa-solid fa-trash-can"></i>
                </div>

                <h3 className="text-base font-black text-slate-800 tracking-tight mb-2">
                    Delete Confirmation
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-6">Are you sure you want to permanently delete this plan? This action cannot be undone.</p>

                <div className="flex gap-4">
                    <button
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-150"
                        onClick={confirmDelete}
                    >
                        Yes, Delete
                    </button>

                    <button
                        className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition duration-150"
                        onClick={() => setShowDelete(false)}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

