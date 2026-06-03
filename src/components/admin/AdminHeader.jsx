const AdminHeader = () => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href = "/#/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">
            Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
            Welcome, Admin
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;