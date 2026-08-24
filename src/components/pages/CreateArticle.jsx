import React, { useState } from "react";
import api from "../services/axiosConfig.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TiptapEditor from "../blog/TiptapEditor.jsx";

export default function CreateArticle({ user }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!title || !contentHtml) { 
      toast.error("Title and content required"); 
      return; 
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("subtitle", subtitle);
      form.append("content", contentHtml);
      if (coverFile) form.append("cover_image", coverFile);
      
      await api.post("/api/blogs/create", form, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      toast.success("Article created successfully");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header Area */}
      <div className="flex items-center gap-3.5 mb-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:shadow-xs transition duration-150 cursor-pointer"
          title="Go back"
        >
          <i className="fa-solid fa-arrow-left text-xs"></i>
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Write New Article
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-semibold">
            Draft and publish a new blog post for platform subscribers
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type a captivating title..."
            className="w-full text-base sm:text-lg font-bold px-4.5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] transition"
          />
        </div>

        {/* Subtitle Input */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Subtitle / Short Excerpt
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Provide a brief summary of the article..."
            className="w-full text-xs font-semibold px-4.5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#FF2A6D]/20 focus:border-[#FF2A6D] transition"
          />
        </div>

        {/* Cover Image Upload Area */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Cover Image
          </label>
          <div className="border-2 border-dashed border-slate-200 hover:border-[#FF2A6D]/40 rounded-2xl p-6 text-center transition bg-slate-50/50 cursor-pointer relative group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setCoverFile(e.target.files[0]);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {coverFile ? (
              <div className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(coverFile)}
                  alt="Cover Preview"
                  className="max-h-48 object-cover rounded-xl shadow-xs mb-3 border border-slate-100"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block truncate max-w-xs">
                  {coverFile.name}
                </span>
                <span className="text-[9px] text-[#FF2A6D] font-black tracking-wider block mt-1 uppercase">
                  Click to replace cover image
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#FF2A6D]/5 group-hover:text-[#FF2A6D] transition mb-3">
                  <i className="fa-solid fa-image text-lg"></i>
                </div>
                <span className="text-xs font-bold text-slate-600">Select cover image</span>
                <span className="text-[9px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                  PNG, JPG or WEBP (Max 5MB)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tiptap Rich Text Editor */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
            Article Content
          </label>
          <div className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FF2A6D]/20 focus-within:border-[#FF2A6D] transition">
            <TiptapEditor content={contentHtml} onChange={setContentHtml} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-3 pt-4 border-t border-slate-150">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-3 bg-[#002060] hover:bg-[#001740] disabled:bg-slate-300 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane text-[10px]"></i>
                Publish Article
              </>
            )}
          </button>
          <button
            onClick={handleBack}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
