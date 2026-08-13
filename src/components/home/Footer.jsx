// src/home/Footer.jsx (Refined, Premium UI Design)
import React, { useState } from "react";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import Logo from "../comman/Logo";
import { Link } from "react-router-dom";

export default function Footer() {
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true);
    try {
      console.log('🔗 Getting LinkedIn auth URL...');
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';
      const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
      console.log('📞 Calling backend for LinkedIn URL:', apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Backend LinkedIn response:', data);

      if (data.url) {
        console.log('🚀 Redirecting to LinkedIn login...');
        window.location.href = data.url;
      } else {
        throw new Error('No LinkedIn URL received from backend');
      }
    } catch (error) {
      console.error('❌ LinkedIn login error:', error);
      alert(`Login failed: ${error.message}. Please try again.`);
    } finally {
      setLinkedinLoading(false);
    }
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Main Footer Grid - Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-8 md:mb-10">

          {/* Column 1: Legal */}
          <div>
            <h3 className="text-sm font-bold text-[#002060] mb-4 uppercase tracking-widest">
              Important Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/privacy-policy"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/accessibility"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  to="/imprint"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Imprint
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/Online-dating-policy"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Online Dating Safety Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-sm font-bold text-[#002060] mb-4 uppercase tracking-widest">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/about"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/contact"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow us */}
          <div>
            <h3 className="text-sm font-bold text-[#002060] mb-4 uppercase tracking-widest">
              Follow Us
            </h3>
            <div className="flex space-x-3 mb-4">
              {/* LinkedIn Link */}
              <button
                onClick={handleLinkedInLogin}
                disabled={linkedinLoading}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0077B5] hover:bg-[#0077B5] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {linkedinLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <FaLinkedin size={18} />
                )}
              </button>

              {/* Facebook Link */}
              <Link
                to="/facebook"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Facebook"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaFacebook size={18} />
              </Link>

              {/* Twitter Link */}
              <Link
                to="/twitter"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Twitter"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaTwitter size={18} />
              </Link>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stay connected with us for updates and community news.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-6"></div>

        {/* Bottom Section with Logo */}
        <div className="flex flex-col items-center md:flex-row md:justify-between text-center md:text-left py-2">
          {/* Logo */}
          <div className="mb-3 md:mb-0">
            <Logo size="text-lg" onClick={() => window.scrollTo(0, 0)} />
          </div>
          {/* Copyright */}
          <div className="text-xs text-slate-400">
            © 2026 Connection Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
