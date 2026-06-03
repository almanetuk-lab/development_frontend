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
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* <h1 className="text-2xl font-semibold">Admin Dashboard</h1> */}
        <Link to="/admin/blogs/create" className="px-3 py-1 bg-indigo-600 text-white rounded">New Article</Link>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="grid gap-4">
          {articles.map(a => (
            <div key={a.id || a._id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-gray-500">{new Date(a.created_at || a.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/blogs/edit/${a.id || a._id}`} className="px-3 py-1 bg-yellow-400 rounded">Edit</Link>
                <button onClick={()=>handleDelete(a.id || a._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

