import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.js";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import "./assets/styles.css";

const appTree = React.createElement(
  React.StrictMode,
  null,
  React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      ToastProvider,
      null,
      React.createElement(AuthProvider, null, React.createElement(App)),
    ),
  ),
);

ReactDOM.createRoot(document.getElementById("root")).render(appTree);
