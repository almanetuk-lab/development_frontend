import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3435";
const API = `${API_BASE_URL}/api/admin/plans`;


export const getPlans = () => axios.get(API);

export const addPlan = (data) => axios.post(API, data);

export const updatePlan = (id, data) => axios.put(`${API}/${id}`, data);

export const deletePlan = (id) => axios.delete(`${API}/${id}`);

export const updatePlanStatus = (id) => axios.put(`${API_BASE_URL}/api/admin/plans/${id}/toggle`);
