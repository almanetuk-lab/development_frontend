import React, { useEffect, useState } from "react";
import { getAll, getOne } from "../services/blogAPI";
import { getPlainText } from "../blog/contentUtilis";
const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    // Fetch blogs from API (placeholder logic)
    const blogsData = await getAll();
    console.log("Full API response:", blogsData);
    console.log("blogsData.data:", blogsData?.data);
    console.log("blogsData.data.articles:", blogsData?.data?.articles);
    setBlogs(blogsData.data.articles);
  };

  const getBlogById = async (id) => {
    const blog = await getOne(id);
    console.log("blog is = ", blog);
  };

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Intentional Connect - Finding Your Perfect Match",
      excerpt:
        "Discover how Intentional Connect uses advanced algorithms to connect like-minded individuals and create meaningful relationships.",
      image:
        "https://images.unsplash.com/photo-1519143226970-1d2d783d1e5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhdGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "Platform Features",
    },
    {
      id: 2,
      title: "The Science Behind Our Matching Algorithm",
      excerpt:
        "Learn about the sophisticated technology that powers Mingle Hub's compatibility matching system.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFsZ29yaXRobXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      date: "Dec 10, 2024",
      readTime: "7 min read",
      category: "Technology",
    },
    {
      id: 3,
      title: "Success Stories: Real Connections Made",
      excerpt:
        "Heartwarming stories from couples who found their perfect match through Mingle Hub.",
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      date: "Dec 5, 2024",
      readTime: "4 min read",
      category: "Success Stories",
    },
    {
      id: 4,
      title: "Safety First: Our Commitment to User Security",
      excerpt:
        "How Intentional Connect ensures a safe and secure environment for all our users to connect and interact.",
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2VjdXJpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      date: "Nov 28, 2024",
      readTime: "6 min read",
      category: "Safety",
    },
    {
      id: 5,
      title: "Building Meaningful Connections in Digital Age",
      excerpt:
        "Tips and strategies to create authentic connections in today's digital dating landscape.",
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29ubmVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      date: "Nov 20, 2024",
      readTime: "8 min read",
      category: "Relationship Tips",
    },
    {
      id: 6,
      title: "New Features: Enhanced Chat Experience",
      excerpt:
        "Explore the latest updates to our chat system including video calls and advanced messaging.",
      image:
        "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      date: "Nov 15, 2024",
      readTime: "5 min read",
      category: "Updates",
    },
  ];

  // About Mingle Hub section
  const aboutIntentionalConnect = {
    title: "About Intentional Connect",
    description:
      "Intentional Connect is a revolutionary dating and social connection platform designed to help people find meaningful relationships through advanced matching algorithms, secure communication channels, and a user-friendly interface.",
    features: [
      "Advanced AI-Powered Matching",
      "Secure Video & Audio Calls",
      "Real-time Chat System",
      "Comprehensive Profile Management",
      "Advanced Search Filters",
      "Safety & Privacy First Approach",
    ],
    stats: [
      { number: "50K+", label: "Active Users" },
      { number: "1K+", label: "Success Stories" },
      { number: "95%", label: "User Satisfaction" },
      { number: "24/7", label: "Support" },
    ],
  };

  console.log("Blogs data:", blogs);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section - Clean Design */}
      {/* <section className="bg-white text-gray-800 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Mingle Hub Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600">
            Insights, Stories & Updates from Your Favorite Dating Platform
          </p>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full px-6 py-3 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </section> */}
      {/* About Mingle Hub Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {aboutIntentionalConnect.title}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {aboutIntentionalConnect.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {aboutIntentionalConnect.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-amber-50 rounded-lg border border-amber-100"
                >
                  <div className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutMingleHub.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-white border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-4"></div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-lg text-gray-600">
              Discover insights, updates, and success stories from the Mingle
              Hub community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0
              ? blogs.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category & Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                          {post.subtitle}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <span>
                            {new Date(post.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          {/* <span className="mx-2">•</span> */}
                          {/* <span>{post.readTime}</span> */}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {/* <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.content}
                      </p> */}

                       {/* kashish new code  */}
                      <div className="text-gray-600 mb-4 line-clamp-3">
                        {getPlainText(post.content)}
                      </div>
                           {/* code end */}

                      {/* Read More Button - AMBER COLOR */}
                      <button
                        className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold
                       hover:bg-amber-600 transition-all duration-300 transform hover:scale-105"
                        onClick={() => getBlogById(post.id)}
                      >
                        Read More
                      </button>
                    </div>
                  </article>
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
