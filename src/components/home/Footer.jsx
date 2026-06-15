// src/home/Footer.jsx (Compact Version)
// import React from "react";
import React, { useState } from "react";
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";



export default function Footer() {
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  
  const handleLinkedInLogin = async () => {
    setLinkedinLoading(true);
    try {
        console.log('🔗 Getting LinkedIn auth URL...');
        
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://backend-q0wc.onrender.com';
        const apiUrl = `${backendUrl}/api/linkedin/auth-url`;
        
        console.log('📞 Calling backend for LinkedIn URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend LinkedIn response:', data);
        
        //  IMPORTANT: Backend { url: '...' } format में return कर रहा है
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
    <footer className="bg-gradient-to-b from-[#F8F9FA] to-[#E3F2FD] border-t border-gray-200 ">
      {" "}
      {/* mt-20 se mt-10 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* py-12 se py-8 */}
        {/* Main Footer Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {" "}
          {/* gap-10 se gap-8, mb-12 se mb-8 */}
          {/* Column 1: Legal */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              {" "}
              {/* text-lg se text-base, mb-6 se mb-4 */}
              Important Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* gap-6 se gap-4 */}
              {/* Sub-column 1 */}
              <div>
                <ul className="space-y-2">
                  {" "}
                  {/* space-y-3 se space-y-2 */}
                  <li>
                    <Link
                      onClick={() => window.scrollTo(0, 0)}
                      to="/privacy-policy"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/accessibility"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Accessibility
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/imprint"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Imprint
                    </Link>
                  </li>
                  <li>

                    <Link
                      to="/terms-and-conditions"
                      className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Terms & Condition.
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Additional Legal Items */}
            <div className="mt-4 space-y-2">
              <div>
                <Link
                  to="/Online-dating-policy"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Online dating Safety Policy 
                </Link>
              </div>
              <div>
                <Link
                  to="/security"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                 Security
                </Link>
              </div>
            </div>
          </div>
          {/* Column 2: Company */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/about"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/contact"
                  className="text-sm text-[#546E7A] hover:text-[#4D6D9E] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3: Follow us */}
          <div>
            <h3 className="text-base font-bold text-[#2C3E50] mb-4 uppercase tracking-wide">
              Follow us
            </h3>
            <div className="flex space-x-4">
              {/* LinkedIn Link */}
                <button
  onClick={handleLinkedInLogin}
  disabled={linkedinLoading}
  className="w-10 h-10 rounded-full bg-[#0077B5] text-white hover:opacity-90 transition shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
>
  {linkedinLoading ? (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
  ) : (
    <FaLinkedin size={20} />
  )}
</button>
              {/* <Link
                to="/linkedin"
                className="w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:bg-[#0066a0] transition-colors"
                aria-label="LinkedIn"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaLinkedin size={20} />
              </Link> */}

              {/* Facebook Link */}
              <Link
                to="/facebook"
                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:bg-[#1666d9] transition-colors"
                aria-label="Facebook"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaFacebook size={20} />
              </Link>

              {/* Twitter Link */}
              <Link
                to="/twitter"
                className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:bg-[#1a8cd9] transition-colors"
                aria-label="Twitter"
                onClick={() => window.scrollTo(0, 0)}
              >
                <FaTwitter size={20} />
              </Link>
            </div>
            <p className="text-xs text-[#546E7A] mt-4">
              Stay connected with us for updates and community news.
            </p>
          </div>
        </div>
        {/* Divider - Thinner and less margin */}
        <div className="border-t border-gray-300 my-4"></div>{" "}
        {/* my-8 se my-4 */}
        {/* Bottom Section with Logo - Compact */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
          {" "}
          {/* Added py-2 */}
          {/* Logo - Smaller */}
          <div className="mb-4 md:mb-0">
            <div className="text-2xl font-bold text-[#4D6D9E] tracking-wider">
              {" "}
              {/* text-3xl se text-2xl */}
              {/* <img src={logo} alt="logo" size={15} /> */}
            </div>
          </div>
          {/* Copyright - Smaller text */}
          <div className="text-xs text-[#546E7A]">
            {" "}
            {/* text-sm se text-xs */}© 2026 Connection Platform. All rights
            reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
