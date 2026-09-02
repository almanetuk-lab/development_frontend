// src/components/home/Footer.jsx (Refined, Premium UI Design)
import React from "react";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import Logo from "../comman/Logo";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Main Footer Grid - Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 mb-8 md:mb-10">

          {/* Column 1: Legal & Policies */}
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
              <li>
                <Link
                  onClick={() => window.scrollTo(0, 0)}
                  to="/blog"
                  className="text-sm text-slate-500 hover:text-[#FF2A6D] transition-colors"
                >
                  Blog & Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect With Us */}
          <div>
            <h3 className="text-sm font-bold text-[#002060] mb-4 uppercase tracking-widest">
              Connect With Us
            </h3>
            <div className="flex space-x-3 mb-4">
              {/* Instagram Link */}
              <a
                href="https://www.instagram.com/intentionalconnectionslifeco/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#E1306C] hover:bg-gradient-to-tr hover:from-[#F56040] hover:to-[#C13584] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Follow us on Instagram"
                title="Follow us on Instagram"
              >
                <FaInstagram size={19} />
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/company/intentional-connections/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Connect on LinkedIn"
                title="Connect on LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>

              {/* Email Us */}
              <a
                href="mailto:almanetuk@gmail.com"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#002060] hover:bg-[#002060] hover:text-white hover:border-transparent transition-all duration-300 flex items-center justify-center shadow-sm"
                aria-label="Email Us"
                title="Email Us"
              >
                <FaEnvelope size={17} />
              </a>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>
                Email:{" "}
                <a
                  href="mailto:almanetuk@gmail.com"
                  className="text-blue-600 hover:text-[#FF2A6D] font-medium transition-colors"
                >
                  almanetuk@gmail.com
                </a>
              </p>
              <p className="text-slate-400">
                Stay connected with us for community updates and support.
              </p>
            </div>
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
            © 2026 Intentional Connections. A brand of Neratech Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
