/* src/main.jsx */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./components/context/AuthProvider.jsx";
import "./index.css";
import { UserProfileProvider } from "./components/context/UseProfileContext.jsx";
import { HashRouter } from "react-router-dom";
import { AdminReportProvider } from "./components/context/AdminReportContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <HashRouter>
      <UserProfileProvider>
        <AdminReportProvider>
        <App />
        </AdminReportProvider>
      </UserProfileProvider>
    </HashRouter>
  </AuthProvider>
);



