import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // Only import once

import RootLayout from "../layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import Dailychecklist from "../pages/Dailychecklist";
import Eod from "../pages/Eod";
import Database from "../pages/Database";
import Settings from "../pages/Settings";
import Login from "../portal/Login";
import Register from "../portal/Register";

// Function to get the access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return !!getAccessToken(); // Check if token exists
};

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    index: true,
  },
  {
    path: "/register",
    element: <Register />,
    index: true,
  },
  {
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated()}>
        <RootLayout />
      </ProtectedRoute>
    ), // Pass authentication status
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/eod",
        element: <Eod />,
      },
      {
        path: "/dailychecklist",
        element: <Dailychecklist />,
      },
      {
        path: "/databases/:aID",
        element: <Database />,
      },
    ],
  },
  {
    path: "*",
    element: <p>404 Error - Nothing here...</p>,
  },
]);

export default router;
