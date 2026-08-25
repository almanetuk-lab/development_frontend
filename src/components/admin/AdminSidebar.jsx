import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const AdminSidebar = ({ sidebarOpen: externalOpen, setSidebarOpen: setExternalOpen }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const sidebarOpen = externalOpen !== undefined ? externalOpen : localOpen;
  const setSidebarOpen = setExternalOpen !== undefined ? setExternalOpen : setLocalOpen;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-solid fa-gauge', end: true },
    { path: '/admin/users', label: 'Users', icon: 'fa-solid fa-users' },
    { path: '/admin/settings', label: 'Settings', icon: 'fa-solid fa-sliders' },
    { path: '/admin/logs', label: 'Logs', icon: 'fa-solid fa-terminal' },
    { path: '/admin/plans', label: 'Plans', icon: 'fa-solid fa-credit-card' },
    { path: '/admin/blogs', label: 'Blogs', icon: 'fa-solid fa-blog' },
    { path: '/admin/reports', label: 'Reports', icon: 'fa-solid fa-flag' },
    { path: '/admin/contacts', label: 'Contacts', icon: 'fa-solid fa-envelope' },
    { path: '/admin/newsletter', label: 'Newsletter', icon: 'fa-solid fa-paper-plane' },
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
          className="fixed inset-0 bg-slate-950/60 z-40 sm:hidden backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed sm:relative z-50
          w-64 bg-slate-950 border-r border-slate-900 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          h-full flex flex-col shadow-2xl sm:shadow-none
        `}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#002060] to-[#FF2A6D] flex items-center justify-center shadow-lg shadow-pink-500/10">
            <span className="text-white text-base">🛡️</span>
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wider uppercase">
              Admin Portal
            </h2>
            <span className="text-[9px] text-[#FF2A6D] font-bold tracking-widest uppercase block mt-0.5">
              Intentional Conn
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-4.5 px-4.5 py-3.5 rounded-xl transition-all duration-200 text-xs font-bold tracking-wide uppercase group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF2A6D] to-[#e0105a] text-white shadow-lg shadow-pink-500/20 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <i className={`${item.icon} text-sm transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                  }`}></i>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Minimal info banner */}
        <div className="p-5 border-t border-slate-900 bg-slate-950/60 text-center">
          <p className="text-[10px] font-bold text-slate-500 tracking-wider">SYSTEM SECURE</p>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;