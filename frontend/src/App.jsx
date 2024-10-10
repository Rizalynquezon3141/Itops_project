// Import necessary modules and components from "react-router-dom" for routing
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Import custom components
import RootLayout from "./components/layouts/RootLayout";
import PublicLayout from "./components/portal/PublicLayout";
import ProtectedRoute from "./components/route/ProtectedRoute";
// Import individual page components for routing
import Settings from "../src/components/pages/Settings";
import Database from "./components/pages/Database";
import Dashboard from "./components/pages/Dashboard";
import Eod from "./components/pages/Eod";
import Dailychecklist from "./components/pages/Dailychecklist";
import Login from "../src/components/portal/Login";
import Register from "./components/portal/Register";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && !storedUser.includes("undefined")) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Routes>
        {/* Redirect from root to the registration page */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Public routes for registration and login without the sidebar */}
        <Route element={<PublicLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Routes that include RootLayout for pages with sidebar */}
        <Route element={<RootLayout />}>
          {/* Protect routes by wrapping them in the ProtectedRoute component */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eod"
            element={
              <ProtectedRoute>
                <Eod />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dailychecklist"
            element={
              <ProtectedRoute>
                <Dailychecklist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/databases/:aID"
            element={
              <ProtectedRoute>
                <Database />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;











































// Import necessary modules and components from "react-router-dom" for routing
{/*import { Route, Routes, Navigate } from "react-router-dom";
// Import the main layout component (RootLayout) which will wrap the routes
import RootLayout from "./components/layouts/RootLayout";
import PublicLayout from "./components/portal/PublicLayout";
import { useEffect } from "react";

// Import individual page components for routing
import Settings from "../src/components/pages/Settings";
import Database from "./components/pages/Database";
import Dashboard from "./components/pages/Dashboard";
import Eod from "./components/pages/Eod";
import Dailychecklist from "./components/pages/Dailychecklist";
import Login from "../src/components/portal/Login";
import Register from "./components/portal/Register";

// Define the main App component that sets up routing
const App = () => {
  useEffect(() => {
    const theUser = localStorage.getItem("user");

    if (theUser && !theUser.includes("undefined")) {
      setUser(JSON.parse(theUser));
    }
  }, []);
  return (
    <>
      <Routes>
        {/* Redirect from root to the registration page }
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Public routes for registration and login without the sidebar }
        <Route element={<PublicLayout />}>
          <Route path="/register" element={<Register />} />{" "}
          {/* Route for Registration }
          <Route path="/login" element={<Login />} /> {/* Route for Login }
        </Route>

        {/* Routes that include RootLayout for pages with sidebar }
        <Route element={<RootLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/eod" element={<Eod />} />
          <Route path="/dailychecklist" element={<Dailychecklist />} />
          <Route path="/databases/:aID" element={<Database />} />
        </Route>
      </Routes>
    </>
  );
};

// Export the App component as the default export
export default App;*/}
