import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from '../services/axiosConfig.js';
import TipTabEditor from "../blog/TiptapEditor.jsx";
import { toast } from "react-toastify";
import TiptapEditor from "../blog/TiptapEditor.jsx";

export default function EditArticle({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetch(); }, [id]);

  const fetch = async () => {
    try {
      const res = await api.get(`/api/blogs/${id}`);
      const a = res.data.article || res.data;
      setArticle(a);
      setTitle(a.title || "");
      setSubtitle(a.subtitle || "");
      setContentHtml(a.content || "");
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async () => {
    if (!title || !contentHtml) { toast.error("Title and content required"); return; }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("subtitle", subtitle);
      form.append("content", contentHtml);
      if (coverFile) form.append("cover_image", coverFile);
      await api.put(`/api/blogs/update/${id}`, form, { headers: {"Content-Type":"multipart/form-data"} });
      toast.success("Updated");
      navigate("/admin-dashboard");
    } catch (err) { console.error(err); toast.error("Update failed"); }
    finally { setLoading(false); }
  };

   const handleBack = () => {
    navigate(-1);
  };

  if (!article) return <div className="text-center py-10">Loading…</div>;

  //console.log("Content HTML:", contentHtml);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded shadow mb-4">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded mb-2" />
        <input value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} placeholder="Subtitle" className="w-full p-2 border rounded mb-2" />
        <div className="mb-2">
          <label className="block text-sm mb-1">Cover image (optional)</label>
          <input type="file" accept="image/*" onChange={(e)=>setCoverFile(e.target.files[0])} />
        </div>
        <TiptapEditor content={contentHtml} onChange={setContentHtml} />
        <div className="mt-3 flex gap-3">
          <button onClick={handleUpdate} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? "Saving..." : "Save changes"}</button>
           <button 
    onClick={handleBack}
    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
  >
    Back  
  </button>
        </div>
      </div>
    </div>
  );
}