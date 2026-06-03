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
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 sm:px-6 py-4">
        {/* Footer Grid - 4 Columns for Admin */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          {/* Column 1: Dashboard */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Dashboard
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/admin')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/users')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/reports')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Management */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Management
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/admin/plans')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/blogs')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Blogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/settings')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: System */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              System
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/admin/logs')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Logs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/messages')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Messages
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/coming-soon')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Coming Soon
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/admin/about')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/contact')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/admin/privacy-policy')}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Social Links */}
        

          {/* Copyright */}
          <div className="text-xs text-gray-500">
            © {currentYear} Admin Panel v1.0. All rights reserved.
          </div>

          {/* Version/Time */}
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </footer>
  );
}









