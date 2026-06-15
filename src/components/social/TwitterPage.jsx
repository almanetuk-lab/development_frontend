
// src/components/SocialPages/TwitterPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";

export default function TwitterPage() {
  const handleTwitterRedirect = () => {
    window.open("https://twitter.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          
          {/* Twitter Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
              <FaTwitter className="w-12 h-12 text-[#1DA1F2]" />
            </div>
          </div>

          {/* Updated Heading with new message */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Follow us on Twitter
          </h1>
          <h2 className="mb-6 text-lg text-[#1DA1F2] font-semibold">
            We'll connect with you soon!
          </h2>
          
          {/* Message */}
          <p className="mb-6 text-gray-700">
            Stay updated with our latest news, announcements, and community updates on Twitter.
          </p>

          {/* Redirect Button */}
          <button
            onClick={handleTwitterRedirect}
            className="w-full mb-6 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-[#1DA1F2] rounded-lg hover:bg-[#1a8cd9] transition-colors duration-200"
          >
            <FaTwitter className="w-5 h-5 mr-2" />
            Visit our Twitter Page
            <FaExternalLinkAlt className="w-4 h-4 ml-2" />
          </button>

          {/* Info Box */}
          <div className="p-4 mb-8 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="mb-2 font-semibold text-gray-900">What you'll find:</h3>
            <ul className="text-sm text-gray-700 text-left space-y-1">
              <li>• Latest announcements and updates</li>
              <li>• Community highlights</li>
              <li>• Quick tips and insights</li>
              <li>• Live interaction with our team</li>
            </ul>
          </div>

          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FaArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
}

