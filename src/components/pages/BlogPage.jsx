// src/components/pages/BlogPage.jsx (Refined, Premium UI Design with Search, Filters, & Pagination)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll } from "../services/blogAPI";
import { getPlainText } from "../blog/contentUtilis";
import { FiCalendar, FiClock, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsData = await getAll();
      setBlogs(blogsData.data?.articles || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories dynamically from database articles
  const categories = ["All", ...new Set(blogs.map(post => post.subtitle).filter(Boolean))];

  // Filter blogs based on Search Query & Selected Category
  const filteredBlogs = blogs.filter(post => {
    const plainText = getPlainText(post.content || "").toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      plainText.includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || post.subtitle === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Calculations for filtered list
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset page on category change
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page on search change
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Blog Hero Banner */}
      <section className="py-12 md:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF2A6D] bg-pink-50 px-3.5 py-1.5 rounded-full mb-4 inline-block">
            Intentional Insights
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002060] mb-4 tracking-tight">
            The Connection Blog
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Guides, stories, and research-backed perspectives on building healthy, mindful, and compatible relationships.
          </p>

          {/* Search bar inside Hero */}
          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <FiSearch size={18} />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#FF2A6D] focus:ring-4 focus:ring-pink-50/50 transition-all duration-200 text-sm shadow-sm placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-wrap justify-center gap-2 pb-2 border-b border-slate-100">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 border ${
                selectedCategory === category
                  ? "bg-[#FF2A6D] text-white border-transparent shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid Section */}
      <section className="py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-[#FF2A6D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-500">Loading articles...</p>
            </div>
          ) : currentBlogs.length > 0 ? (
            <>
              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {currentBlogs.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-pink-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Cover Image */}
                    {post.cover_image && (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta Information */}
                      <div className="flex items-center justify-between mb-3.5">
                        {post.subtitle && (
                          <span className="px-3 py-1 bg-pink-50 text-[#FF2A6D] border border-pink-100 rounded-full text-xs font-bold uppercase tracking-wide">
                            {post.subtitle}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                          <FiCalendar />
                          <span>
                            {new Date(post.created_at || post.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 hover:text-[#FF2A6D] transition-colors duration-200 cursor-pointer" 
                        onClick={() => navigate(`/blogs/${post.id}`)}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt Description */}
                      <div className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
                        {getPlainText(post.content)}
                      </div>

                      {/* Action Button - aligned to bottom */}
                      <div className="mt-auto pt-2">
                        <button
                          className="w-full py-3 bg-[#FF2A6D] hover:bg-[#e0105a] text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 text-sm"
                          onClick={() => navigate(`/blogs/${post.id}`)}
                        >
                          Read Article
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 border border-slate-200 text-slate-600 bg-white rounded-xl hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    aria-label="Previous Page"
                  >
                    <FiChevronLeft size={18} />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
                        currentPage === i + 1
                          ? "bg-[#FF2A6D] text-white shadow-md shadow-pink-100"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 border border-slate-200 text-slate-600 bg-white rounded-xl hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    aria-label="Next Page"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Articles Found</h3>
              <p className="text-sm text-slate-500">Try modifying your search query or selecting a different category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
