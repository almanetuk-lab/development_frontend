import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPlanModal from "./EditPlansModal";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import { useNavigate } from "react-router-dom";
import ManagePlanModal from "./ManagePlanModal.jsx";

const BASE_URL = "https://backend-q0wc.onrender.com/api/admin/plans";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

export default function AdminPlans({
  editingId,
  setEditingId,
  plans,
  setPlans,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  // Inside AdminPlans component
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [config, setConfig] = useState({}); // ✅ added
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: 0,
    video_call_limit: 0,
    people_search_limit: 0,
    people_message_limit: 0,
    audio_call_limit: 0,
    billigng_info: "",
  });

  // Fetch plans from the API
  const fetchPlans = async () => {
    const res = await axios.get(BASE_URL);
    if (Array.isArray(res.data)) {
      // Old response shape (only plans)
      setPlans(res.data);
    } else {
      // New response shape (plans + config)
      setPlans(res.data.plans);
      setConfig(res.data.config);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    if(e.target.name === "is_active") {
      setFormData({...formData, [e.target.name]: Number(e.target.value)})
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEdit = (plan) => {
    setFormData(plan);
    setEditingId(plan.id);
    setIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`${BASE_URL}/${editingId}`, formData);
    setIsOpen(false);
    setEditingId(null);
    fetchPlans();
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    await axios.delete(`${BASE_URL}/${deleteId}`);
    setShowDelete(false);
    fetchPlans();
  };

  let addNewPlanForm = () => navigate("/admin-plans-new");

  const openManageModal = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={addNewPlanForm}
          className="bg-blue-600 text-white mt-5 float-right rounded-xl px-5 py-2 hover:bg-blue-700 shadow-md transition"
        >
          Add New Plan
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto mt-5 px-4 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="group relative rounded-xl p-5 bg-gradient-to-br from-white to-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between"
            >
              <div className="relative">
                <h3 className="text-xl font-semibold text-center mb-3">
                  {plan.name} — £{plan.price}
                </h3>

                {/* ⚙ Gear icon — hidden by default, visible on hover */}
                <i
                  className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 fa-solid fa-gear text-gray-600 hover:text-blue-600 text-xl cursor-pointer"
                  onClick={() => openManageModal(plan)}
                ></i>
              </div>

              <ul className="text-gray-700 text-sm mb-4">
                <li className="mb-1">Duration: {plan.duration} Days</li>

                <p>{plan.description}</p>

                {plan.video_call_limit > 0 && (
                  <li className="mb-1">Video Calls: {plan.video_call_limit}</li>
                )}
                {plan.people_search_limit > 0 && (
                  <li className="mb-1">
                    Search Limit: {plan.people_search_limit}
                  </li>
                )}
                {plan.people_message_limit > 0 && (
                  <li className="mb-1">
                    Message Limit: {plan.people_message_limit}
                  </li>
                )}
                {plan.audio_call_limit > 0 && (
                  <li className="mb-1">Audio Calls: {plan.audio_call_limit}</li>
                )}
                {plan.billing_info && (
                  <li className="mb-1">Billing Info: {plan.billing_info}</li>
                )}
              </ul>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => openEdit(plan)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 shadow transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => openDelete(plan.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {isOpen && (
          <EditPlanModal
            formData={formData}
            handleChange={handleChange}
            handleUpdate={handleUpdate}
            setIsOpen={setIsOpen}
          />
        )}

        {showDelete && (
          <DeleteConfirmModal
            setShowDelete={setShowDelete}
            confirmDelete={confirmDelete}
          />
        )}
      </div>
      {selectedPlan && (
        <ManagePlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onUpdated={fetchPlans}
        />
      )}
    </>
  );
}
