import Sidebar from "./sidebar"; // Importing the Sidebar component
import { Outlet } from "react-router-dom"; // Import Outlet for rendering child routes

// RootLayout component which serves as the layout wrapper for the entire page
function RootLayout() {
  return (
    <div className="flex h-screen">
      {/* Render the Sidebar component on the left */}
      <Sidebar className="flex-shrink-0" /> {/* Sidebar remains fixed */}

      {/* Main content area where child components will be rendered */}
      <main className="flex-1 overflow-y-auto py-10">
        <Outlet />
        {/* 'children' represents the content passed into the RootLayout */}
      </main>
    </div>
  );
}

export default RootLayout;
