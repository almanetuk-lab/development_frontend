import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axiosConfig.js";

export default function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(()=>{ fetch(); }, [id]);

  const fetch = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setArticle(res.data.article || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!article) return <div className="text-center py-10">Loading…</div>;

  return (
    <article className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      {article.subtitle && <h3 className="text-lg text-gray-600 mb-4">{article.subtitle}</h3>}
      {article.cover_image && <img src={article.cover_image} alt={article.title} className="w-full rounded mb-6 max-h-96 object-cover" />}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      <div className="mt-6 text-sm text-gray-500">Published {new Date(article.created_at || article.createdAt).toLocaleString()}</div>
    </article>
  );
}


