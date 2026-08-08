// src/components/pages/ArticleDetails.jsx (Refined, Premium UI Design)
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOne } from "../services/blogAPI";
import { FiArrowLeft, FiCalendar, FiClock } from "react-icons/fi";

export default function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
    window.scrollTo(0, 0); // Scroll to top when page opens
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const res = await getOne(id);
      // Backend returns either { article } or direct payload
      setArticle(res.data?.article || res.data);
    } catch (err) {
      console.error("Error fetching article details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF1493] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Article Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">The article you are looking for may have been removed or does not exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
          >
            <FiArrowLeft /> Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#FF2A6D] font-semibold text-sm transition-colors duration-200"
          >
            <FiArrowLeft size={16} /> Back to Blogs
          </Link>
        </div>

        {/* Article Details Card */}
        <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 md:p-12 relative overflow-hidden">
          
          {/* Header Metadata */}
          <div className="mb-6">
            {article.subtitle && (
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF2A6D] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                {article.subtitle}
              </span>
            )}
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#002060] mt-4 mb-4 tracking-tight leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 font-medium border-b border-slate-100 pb-6 mt-4">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-slate-400" />
                <span>
                  {new Date(article.created_at || article.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
              <span className="text-slate-200">•</span>
              <div className="flex items-center gap-1.5">
                <FiClock className="text-slate-400" />
                <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="w-full rounded-2xl overflow-hidden shadow-md ring-4 ring-slate-100/50 mb-8">
              <img 
                src={article.cover_image} 
                alt={article.title} 
                className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover" 
              />
            </div>
          )}

          {/* Rich Content Area */}
          <div 
            className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm sm:text-base prose-headings:text-slate-800 prose-headings:font-bold prose-a:text-[#FF2A6D] prose-strong:text-slate-800" 
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

        </article>
      </div>
    </div>
  );
}
