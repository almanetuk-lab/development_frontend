import axios from "axios";

const AdminHeader = ({ activeSection = "Admin Portal", sidebarOpen, setSidebarOpen }) => {
  const handleLogout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3435';
      await axios.post(`${API_BASE_URL}/api/admin/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Admin logout API error:', err);
    }
    localStorage.removeItem("adminData");
    window.location.href = "/";
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Trigger */}
          {setSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sm:hidden text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200/60 transition-all duration-150"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <h1 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-wider capitalize">
            {activeSection.replace(/-/g, " ")}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7.5 h-7.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 select-none">
              A
            </div>
            <span className="text-xs font-bold text-slate-600 hidden md:inline">
              Welcome, Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50 px-3.5 py-1.5 sm:py-2 rounded-xl hover:text-rose-700 transition-all duration-150 text-xs font-bold uppercase tracking-wider"
          >
            <i className="fa-solid fa-power-off text-[10px]"></i>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;