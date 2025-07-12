import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import axios from "axios";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.headers.common["Content-Type"] = "application/json";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 