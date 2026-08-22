// src/components/AdminFooter.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminFooter() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 mt-auto py-8">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Footer Grid - 4 Columns for Admin */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          {/* Column 1: Dashboard */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
              Dashboard
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavigation('/admin')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/users')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/reports')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Management */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
              Management
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavigation('/admin/plans')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/blogs')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Blogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/settings')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: System */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
              System
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavigation('/admin/logs')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Logs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/messages')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Messages
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/coming-soon')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Coming Soon
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => handleNavigation('/admin/about')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/contact')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/privacy-policy')}
                  className="text-xs font-semibold text-slate-600 hover:text-[#FF2A6D] transition-colors"
                >
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/60 my-5"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Copyright */}
          <div className="text-xs font-medium text-slate-400">
            © {currentYear} Admin Portal. All rights reserved.
          </div>

          {/* Version/Time */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            V1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}









