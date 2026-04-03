/**
 * ============================================================
 * src/main.jsx — Vite Application Entry Point
 * ============================================================
 * Mounts the React root onto the #root div in index.html.
 * React.StrictMode is enabled for development warnings.
 * ============================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
