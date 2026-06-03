
import { Link } from "react-router-dom";
import { getPlainText } from "../blog/contentUtilis";
export default function BlogCard({ a }) {
  const id = a.id || a._id;
  const createdDate = new Date(a.created_at || a.createdAt);
  const dateString = !isNaN(createdDate) ? createdDate.toLocaleDateString() : "Unknown date";
  const category = a.category || "Uncategorized";

  // Use shared utility to get a plain-text preview from possibly-encoded HTML
  const contentPreview = getPlainText(a.content);

  // Dev: warn if preview still contains HTML-like angle brackets (helps detect edge cases)
  if (process.env.NODE_ENV !== 'production' && /<[^>]+>/.test(contentPreview)) {
    // eslint-disable-next-line no-console
    console.warn("BlogCard: preview still contains HTML-like markup for article", id, contentPreview.slice(0,120));
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition h-full flex flex-col">
      {/* Image Container with Category & Date Badges */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        {a.cover_image && (
          <img
            src={a.cover_image}
            alt={a.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
          {category}
        </div>

        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
          {dateString}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {a.title}
        </h2>

        {/* Subtitle */}
        {a.subtitle && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {a.subtitle}
          </p>
        )}

        {/* Content Preview - Plain Text */}
        {contentPreview && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {contentPreview}
          </p>
        )}

        {/* Read More Button */}
        <Link
          to={`/article/${id}`}
          className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition text-center"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}