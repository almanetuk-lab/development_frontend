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
    } catch (err) { console.error(err); toast.error("Fetch failed"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchArticles(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete article?")) return;
    try {
      await api.delete(`/api/blogs/delete/${id}`);
      toast.success("Deleted");
      fetchArticles();
    } catch (err) { console.error(err); toast.error("Delete failed"); }
  };

  if (!user || user.role !== "admin") {
    return <div className="text-center py-10">Please login as admin to manage articles.</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sm:p-8 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Blog Management</h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Publish, edit, and moderate articles on the platform</p>
        </div>
        <Link to="/admin/blogs/create" className="flex items-center gap-2 bg-[#002060] hover:bg-[#001740] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm">
          <i className="fa-solid fa-plus text-[10px]"></i>
          New Article
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#FF2A6D]"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400 text-xs font-semibold">No articles found. Write your first article today!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map(a => (
            <div key={a.id || a._id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:border-slate-200 transition duration-150">
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{a.title}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(a.created_at || a.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/blogs/edit/${a.id || a._id}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition">
                  Edit
                </Link>
                <button onClick={()=>handleDelete(a.id || a._id)} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition">
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

