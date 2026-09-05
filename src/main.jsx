/* src/main.jsx */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProfileProvider } from "./components/context/UseProfileContext.jsx";
import { HashRouter } from "react-router-dom";
import { AdminReportProvider } from "./components/context/AdminReportContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <HashRouter>
      <UserProfileProvider>
        <AdminReportProvider>
        <App />
        </AdminReportProvider>
      </UserProfileProvider>
    </HashRouter>
  </GoogleOAuthProvider>
);
