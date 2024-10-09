// Import necessary modules and components from "react-router-dom" for routing
import { Route, Routes, Navigate } from "react-router-dom";
// Import the main layout component (RootLayout) which will wrap the routes
import RootLayout from "./components/layouts/RootLayout";
import PublicLayout from "./components/portal/PublicLayout";
import { useEffect, useState } from "react";

// Import individual page components for routing
import Settings from "./components/pages/Settings";
import Database from "./components/pages/Database";
import Dashboard from "./components/pages/Dashboard";
import Eod from "./components/pages/Eod";
import Dailychecklist from "./components/pages/Dailychecklist";
import Login from "./components/portal/Login";
import Register from "./components/portal/Register";

// Define the main App component that sets up routing
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const theUser = localStorage.getItem("user");

    if (theUser && !theUser.includes("undefined")) {
      setUser(JSON.parse(theUser));
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
          <Route path="/login" element={<Login setUser={setUser} />} /> {/* Pass setUser to Login */}
        </Route>

        {/* Routes that include RootLayout for pages with sidebar */}
        <Route element={<RootLayout />}>
          {/* Redirect to dashboard if user is logged in */}
          <Route path="/dashboard/:userId" element={<Dashboard />} />
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
export default App;
