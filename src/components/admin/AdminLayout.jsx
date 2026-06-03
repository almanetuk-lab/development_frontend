// const AdminLayout = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       <AdminSidebar />
//       <div className="flex-1 overflow-auto min-w-0">
//         {/* Header */}
//         <AdminHeader />
//         {/* Nested routes outlet */}
//         <Outlet />
//       </div>
//     </div>
//   );
// };



// AdminLayout.jsx
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminHeader />
        <div className="p-4">
          <Outlet />  {/* यहाँ दिखेंगे सारे एडमिन पेज */}
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;