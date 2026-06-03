// src/components/FallbackPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTools, FaClock, FaHome, FaEnvelope } from "react-icons/fa";

export default function FallbackPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
              <FaTools className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Work in Progress
          </h1>
          
          {/* Subheading */}
          <p className="mb-6 text-xl text-gray-700">
            We're crafting something amazing for you!
          </p>

          {/* Note Box */}
          <div className="p-6 mb-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-left">
            <div className="flex items-start">
              <FaClock className="w-5 h-5 mt-1 mr-3 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Important Note
                </h3>
                <p className="text-gray-800">
                  This section of our website is currently under development. 
                  Our team is working diligently to bring you an enhanced experience. 
                  We appreciate your patience and look forward to sharing the 
                  finished product with you soon.
                </p>
                <div className="flex items-center mt-3 text-sm text-gray-600">
                  <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Development Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-4 mb-10 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 mb-3 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Design Phase</h4>
              <p className="text-sm text-gray-700">Completed</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 mb-3 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <FaTools className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Development</h4>
              <p className="text-sm text-gray-700">In Progress</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 mb-3 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 font-bold">?</span>
              </div>
              <h4 className="mb-2 font-semibold text-gray-900">Testing</h4>
              <p className="text-sm text-gray-700">Pending</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaHome className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <FaEnvelope className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </div>

          {/* Estimated Timeline */}
          <div className="p-4 mt-10 text-sm text-gray-600 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center">
              <FaClock className="w-4 h-4 mr-2 text-gray-500" />
              <span>Estimated completion: 2-3 weeks</span>
            </div>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-sm text-gray-500">
            Thank you for visiting. We're working hard to improve your experience.
          </p>
        </div>
      </div>
    </div>
  );
}