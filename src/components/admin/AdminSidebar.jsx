import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-solid fa-gauge', end: true },
    { path: '/admin/users', label: 'Users', icon: 'fa-solid fa-users' },
    { path: '/admin/settings', label: 'Settings', icon: 'fa-solid fa-sliders' },
    { path: '/admin/logs', label: 'Logs', icon: 'fa-solid fa-terminal' },
    { path: '/admin/plans', label: 'Plans', icon: 'fa-solid fa-credit-card' },
    { path: '/admin/blogs', label: 'Blogs', icon: 'fa-solid fa-blog' },
    { path: '/admin/reports', label: 'Reports', icon: 'fa-solid fa-flag' },
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
          className="fixed inset-0 bg-black/60 z-20 sm:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed sm:relative z-30
          w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          h-full flex flex-col
        `}
      >
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF2A6D] flex items-center justify-center shadow-md">
            <span className="text-white text-base">🛡️</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">
              Admin Portal
            </h2>
            <span className="text-[10px] text-[#FF2A6D] font-bold tracking-widest uppercase">
              Intentional Conn
            </span>
          </div>
        </div>

        <nav className="mt-6 flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group ${
                  isActive
                    ? 'bg-[#FF2A6D] text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i className={`${item.icon} text-base transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                  }`}></i>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
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