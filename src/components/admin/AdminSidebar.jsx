import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', end: true },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/settings', label: 'Settings' },
    { path: '/admin/logs', label: 'Logs' },
    { path: '/admin/plans', label: 'Plans' },
    { path: '/admin/blogs', label: 'Blogs' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed sm:relative z-30
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          h-full
        `}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Admin Panel
          </h2>
        </div>

        <nav className="mt-4 sm:mt-6">
          {menuItems.map((item) => (
            <div key={item.path} className="px-4 sm:px-6 py-2 sm:py-3">
              <NavLink
                to={item.path}
                end={item.end}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `block px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sm:hidden fixed top-4 left-4 z-40 text-gray-600 hover:text-gray-800 bg-white p-2 rounded shadow"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
};

export default AdminSidebar;