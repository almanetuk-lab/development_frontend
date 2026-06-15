
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaArrowLeft, FaExternalLinkAlt, FaEnvelope, FaLock } from "react-icons/fa";

export default function LinkedInPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLinkedInRedirect = () => {
    window.open("https://linkedin.com", "_blank");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you can add login logic or redirect to LinkedIn OAuth
    window.open("https://www.linkedin.com/login", "_blank");
  };

  const handleLinkedInLogin = async () => {
    try {
      //  Fetch Auth URL from Backend
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
      const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
      
      console.log('🔗 Fetching LinkedIn auth URL:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.url) {
        console.log('🚀 Redirecting to LinkedIn:', data.url);
        window.location.href = data.url;
      } else {
        throw new Error('Failed to get LinkedIn Auth URL');
      }
    } catch (error) {
      console.error('❌ LinkedIn login failed:', error);
      alert('Failed to initiate LinkedIn login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          
          {/* LinkedIn Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
              <FaLinkedin className="w-12 h-12 text-[#0077B5]" />
            </div>
          </div>

          {/* Updated Heading with new message */}
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Connect with us on LinkedIn
          </h1>
          <h2 className="mb-6 text-lg text-[#0077B5] font-semibold">
            We'll connect with you soon!
          </h2>
          
          {/* Message */}
          <p className="mb-6 text-gray-700">
            Join our professional network, explore career opportunities, and connect with industry experts.
          </p>

          {/* Direct Redirect Button */}
          <button
            onClick={handleLinkedInRedirect}
            className="w-full mb-4 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-[#0077B5] rounded-lg hover:bg-[#0066a0] transition-colors duration-200"
          >
            <FaLinkedin className="w-5 h-5 mr-2" />
            Visit our LinkedIn Page
            <FaExternalLinkAlt className="w-4 h-4 ml-2" />
          </button>

          {/* LinkedIn Login Button */}
          <button
            onClick={handleLinkedInLogin}
            className="w-full mb-8 inline-flex items-center justify-center px-6 py-3 font-medium text-[#0077B5] bg-white border-2 border-[#0077B5] rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <FaLinkedin className="w-5 h-5 mr-2" />
            Sign in with LinkedIn
          </button>

          {/* Toggle Login Form */}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="mb-6 text-sm text-[#0077B5] hover:underline"
          >
            {showLogin ? "Hide Login Form" : "Show Email Login Form"}
          </button>

          {/* Login Form */}
          {showLogin && (
            <div className="p-6 mb-8 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="mb-4 font-semibold text-gray-900">Login to LinkedIn</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
                      required
                    />
                  </div>
                </div>
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-4 py-2 font-medium text-white bg-[#0077B5] rounded-lg hover:bg-[#0066a0] transition-colors duration-200"
                >
                  <FaLinkedin className="w-4 h-4 mr-2" />
                  Login
                </button>
              </form>
              <p className="mt-4 text-xs text-gray-600">
                This will redirect you to LinkedIn's official login page
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 mb-8 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="mb-2 font-semibold text-gray-900">Professional Benefits:</h3>
            <ul className="text-sm text-gray-700 text-left space-y-1">
              <li>• Network with professionals</li>
              <li>• Job opportunities and career growth</li>
              <li>• Industry insights and articles</li>
              <li>• Company updates and news</li>
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









