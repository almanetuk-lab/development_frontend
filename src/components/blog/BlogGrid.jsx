import React from "react";
import BlogCard from "./BlogCard";

export default function BlogGrid({ articles }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => <BlogCard key={a.id || a._id} a={a} />)}
    </div>
  );
}
