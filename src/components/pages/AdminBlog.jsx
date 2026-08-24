import React, { useEffect, useState } from "react";
import api from "../services/axiosConfig.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminBlog({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await api.get("/api/blogs");
      setArticles(res.data.articles || res.data.blogs || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/api/blogs/delete/${id}`);
      toast.success("Article deleted successfully");
      fetchArticles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete article");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="text-center py-12 text-slate-500 font-bold">
        Please login as administrator to manage articles.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xs p-6 sm:p-8 max-w-7xl mx-auto w-full animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Blog Management
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-semibold">
            Publish, edit, and moderate articles on the platform
          </p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="flex items-center gap-2 bg-[#002060] hover:bg-[#001740] text-white px-5.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
        >
          <i className="fa-solid fa-plus text-[10px]"></i>
          New Article
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#FF2A6D]"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <i className="fa-solid fa-blog text-lg"></i>
          </div>
          <p className="text-slate-500 text-xs font-bold">No articles published yet.</p>
          <Link
            to="/admin/blogs/create"
            className="text-xs text-[#FF2A6D] font-extrabold uppercase tracking-wide mt-1 inline-block hover:underline"
          >
            Write your first article today
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <div
              key={a.id || a._id}
              className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail/Cover */}
                <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {a.cover_image ? (
                    <img
                      src={a.cover_image}
                      alt={a.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#002060]/5 to-[#FF2A6D]/5 flex items-center justify-center text-[#002060]/20 font-bold select-none text-2xl font-mono">
                      IC Blog
                    </div>
                  )}
                  {/* Category/Status tag */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-900/70 backdrop-blur-xs text-white rounded-lg text-[9px] font-black uppercase tracking-wider">
                    Published
                  </span>
                </div>

                {/* Article Info */}
                <div className="p-5 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <i className="fa-regular fa-clock"></i>
                    {new Date(a.created_at || a.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2 leading-snug">
                    {a.title}
                  </h3>
                  {a.subtitle && (
                    <p className="text-slate-400 text-[11px] font-semibold line-clamp-2 leading-relaxed">
                      {a.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex gap-2">
                <Link
                  to={`/admin/blogs/edit/${a.id || a._id}`}
                  className="flex-1 text-center py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(a.id || a._id)}
                  className="flex-1 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
