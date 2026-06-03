
// src/components/SocialPages/FacebookPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";

export default function FacebookPage() {
  const handleFacebookRedirect = () => {
    window.open("https://facebook.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          
          {/* Facebook Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
              <FaFacebook className="w-12 h-12 text-[#1877F2]" />
            </div>
          </div>

          {/* Updated Heading with new message */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Like us on Facebook
          </h1>
          <h2 className="mb-6 text-lg text-[#1877F2] font-semibold">
            We'll connect with you soon!
          </h2>
          
          {/* Message */}
          <p className="mb-6 text-gray-700">
            Connect with our community, join discussions, and get regular updates on Facebook.
          </p>

          {/* Redirect Button */}
          <button
            onClick={handleFacebookRedirect}
            className="w-full mb-6 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#1666d9] transition-colors duration-200"
          >
            <FaFacebook className="w-5 h-5 mr-2" />
            Visit our Facebook Page
            <FaExternalLinkAlt className="w-4 h-4 ml-2" />
          </button>

          {/* Info Box */}
          <div className="p-4 mb-8 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="mb-2 font-semibold text-gray-900">Community Features:</h3>
            <ul className="text-sm text-gray-700 text-left space-y-1">
              <li>• Community discussions and events</li>
              <li>• Photo and video updates</li>
              <li>• Live Q&A sessions</li>
              <li>• Polls and surveys</li>
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









