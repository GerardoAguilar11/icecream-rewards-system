import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import "./index.css";

import App from "./App.jsx";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";

import NotificationProvider
  from "./context/NotificationContext.jsx";

import NotificationContainer
  from "./components/ui/NotificationContainer.jsx";


createRoot(
  document.getElementById(
    "root"
  )
).render(
  <StrictMode>

    <AuthProvider>

      <NotificationProvider>

        <App />

        <NotificationContainer />

      </NotificationProvider>

    </AuthProvider>

  </StrictMode>
);