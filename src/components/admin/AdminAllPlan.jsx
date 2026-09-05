import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPlanModal from "./EditPlansModal";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import { useNavigate } from "react-router-dom";
import ManagePlanModal from "./ManagePlanModal.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
const BASE_URL = `${API_BASE_URL}/api/admin/plans`;

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
  const [loading, setLoading] = useState(true); // ✅ added
  const [activeTab, setActiveTab] = useState("active"); // ✅ added
  const [settings, setSettings] = useState({
    member_approval: 0,
    check_video_call_limit: 0,
    check_audio_call_limit: 0,
    check_search_limit: 0,
    check_message_limit: 0,
  }); // ✅ added
  const [settingsLoading, setSettingsLoading] = useState(false); // ✅ added

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    duration: 0,
    video_call_limit: 0,
    people_search_limit: 0,
    people_message_limit: 0,
    audio_call_limit: 0,
    billing_info: "",
  });

  // Fetch plans from the API
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL);
      if (Array.isArray(res.data)) {
        // Old response shape (only plans)
        setPlans(res.data);
      } else {
        // New response shape (plans + config)
        setPlans(res.data.plans);
        setConfig(res.data.config);
      }
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/settings/get-member-approval`, {
        withCredentials: true
      });
      if (res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      setSettingsLoading(true);
      const updated = { ...settings, [key]: value ? 1 : 0 };
      setSettings(updated);
      await axios.put(`${API_BASE_URL}/api/settings/update-member-approval`, updated, {
        withCredentials: true
      });
    } catch (e) {
      console.error("Failed to update setting:", e);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    if(e.target.name === "is_active") {
      setFormData({...formData, [e.target.name]: Number(e.target.value)})
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openEdit = (plan) => {
    const defaultFeatures = {
      dashboard: true,
      profile: true,
      message: true,
      basic_search: true,
      advance_search: true,
      edit_profile: true,
      my_matches: true,
      ai_suggestion: true,
      near_me: true,
      browse_members: true,
      ai_agent: true,
    };
    setFormData({
      ...plan,
      allowed_features: plan.allowed_features || defaultFeatures
    });
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

  const activePlans = plans.filter((p) => p.is_active === 1);
  const inactivePlans = plans.filter((p) => p.is_active !== 1);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">
            Subscription Plans
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Define pricing tiers, platform limits, and access durations for members
          </p>
        </div>
        <button
          onClick={addNewPlanForm}
          className="flex items-center gap-2 bg-[#002060] hover:bg-[#001740] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition duration-150"
        >
          <i className="fa-solid fa-plus text-[10px]"></i>
          Add New Plan
        </button>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-slate-100 mb-6 gap-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-1 transition-all ${
            activeTab === "active"
              ? "border-[#FF2A6D] text-slate-800"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Active Packages ({activePlans.length})
        </button>
        <button
          onClick={() => setActiveTab("inactive")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-1 transition-all ${
            activeTab === "inactive"
              ? "border-[#FF2A6D] text-slate-800"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Inactive / Archives ({inactivePlans.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-1 transition-all ${
            activeTab === "settings"
              ? "border-[#FF2A6D] text-slate-800"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Plan Settings
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm animate-pulse space-y-5">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 rounded-full w-14"></div>
                <div className="h-4 bg-slate-200 rounded-full w-10"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-2/3"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-12 self-end"></div>
              </div>
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="h-3 bg-slate-100 rounded w-full"></div>
                <div className="h-3 bg-slate-100 rounded w-5/6"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-100 rounded-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-100 rounded-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-100 rounded-full"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <div className="flex-1 h-9 bg-slate-100 rounded-xl"></div>
                <div className="flex-1 h-9 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === "settings" ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 max-w-2xl mx-auto mt-2 animate-fade-in">
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-2">Global Limit Controls</h3>
          <p className="text-xs text-slate-400 font-semibold mb-6">Enable or disable subscription-level limits enforcement across the entire platform</p>
          
          <div className="space-y-4 divide-y divide-slate-100">
            {[
              { key: "check_video_call_limit", label: "Video Call Limit", desc: "Enforce video call duration or count limits based on user subscription level", icon: "fa-solid fa-video" },
              { key: "check_audio_call_limit", label: "Audio Call Limit", desc: "Enforce audio call limits and restrict access based on active plan", icon: "fa-solid fa-phone" },
              { key: "check_search_limit", label: "People Search Limit", desc: "Apply limitations to search frequency and advanced filters search", icon: "fa-solid fa-magnifying-glass" },
              { key: "check_message_limit", label: "People Message Limit", desc: "Limit the daily number of direct messages sent to new connections", icon: "fa-solid fa-envelope" }
            ].map((cfg) => (
              <div key={cfg.key} className="flex items-center justify-between py-4 first:pt-0">
                <div className="flex items-start gap-4">
                  <span className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 mt-0.5">
                    <i className={cfg.icon}></i>
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">{cfg.label}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 max-w-md">{cfg.desc}</p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings[cfg.key] === 1}
                    onChange={(e) => updateSetting(cfg.key, e.target.checked ? 1 : 0)}
                    disabled={settingsLoading}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF2A6D]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : (activeTab === "active" ? activePlans : inactivePlans).length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60 shadow-sm w-full">
          <p className="text-slate-400 text-xs font-semibold">No subscription plans found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "active" ? activePlans : inactivePlans).map((plan) => (
            <div
              key={plan.id}
              className="group relative rounded-2xl p-6 bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Gear & Manage button at top right */}
              <div className="absolute right-4 top-4 z-10">
                <button
                  onClick={() => openManageModal(plan)}
                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#002060] flex items-center justify-center transition-all duration-150 border border-slate-200/40 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Manage status"
                >
                  <i className="fa-solid fa-gear text-sm"></i>
                </button>
              </div>

              <div>
                {/* Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full border ${
                    plan.type === "Pro" || plan.type === "Advance"
                      ? "bg-pink-50 text-[#FF2A6D] border-pink-100"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}>
                    {plan.type || "Tier"}
                  </span>
                  
                  {/* Active pill */}
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full ${
                    plan.is_active === 1
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    {plan.is_active === 1 ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Title & Price */}
                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-black text-slate-900">£{plan.price}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {plan.duration} Days</span>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 border-b border-slate-100 pb-4">
                  {plan.description || "No description provided for this subscription plan."}
                </p>

                {/* Limits List */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                    <i className="fa-solid fa-clock w-4 text-slate-400 text-center"></i>
                    <span>Duration: {plan.duration} Days</span>
                  </li>

                  {plan.video_call_limit > 0 ? (
                    <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                      <i className="fa-solid fa-video w-4 text-slate-400 text-center"></i>
                      <span>Video Calls: {plan.video_call_limit} min/day</span>
                    </li>
                  ) : null}

                  {plan.audio_call_limit > 0 ? (
                    <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                      <i className="fa-solid fa-phone w-4 text-slate-400 text-center"></i>
                      <span>Audio Calls: {plan.audio_call_limit} min/day</span>
                    </li>
                  ) : null}

                  {plan.people_search_limit > 0 ? (
                    <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                      <i className="fa-solid fa-magnifying-glass w-4 text-slate-400 text-center"></i>
                      <span>Search Limit: {plan.people_search_limit} queries/day</span>
                    </li>
                  ) : null}

                  {plan.people_message_limit > 0 ? (
                    <li className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
                      <i className="fa-solid fa-envelope w-4 text-slate-400 text-center"></i>
                      <span>Message Limit: {plan.people_message_limit} texts/day</span>
                    </li>
                  ) : null}

                  {plan.billing_info ? (
                    <li className="flex items-start gap-3 text-[11px] text-slate-400 font-medium mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                      <i className="fa-solid fa-circle-info w-4 text-slate-400 text-center mt-0.5 shrink-0"></i>
                      <span>{plan.billing_info}</span>
                    </li>
                  ) : null}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex-1 py-2.5 border border-[#002060] text-[#002060] hover:bg-[#002060]/5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150"
                >
                  Edit Details
                </button>

                <button
                  onClick={() => openDelete(plan.id)}
                  className="flex-1 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {selectedPlan && (
        <ManagePlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onUpdated={fetchPlans}
        />
      )}
    </div>
  );
}
