import api from "./axiosConfig";

export const getAll = () => api.get("/api/blogs");
export const getOne = (id) => api.get(`/api/blogs/${id}`);
export const create = (formData) => api.post("/api/blogs/create", formData);
export const update = (id, formData) => api.put(`/api/blogs/update/${id}`, formData);
export const remove = (id) => api.delete(`/api/blogs/delete/${id}`);
