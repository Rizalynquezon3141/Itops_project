import Sidebar from "./sidebar"; // Importing the Sidebar component
import { Outlet } from "react-router-dom"; // Import Outlet for rendering child routes

// RootLayout component which serves as the layout wrapper for the entire page
function RootLayout() {
  return (
    <div className="flex gap-7">
      {/* Render the Sidebar component on the left */}
      <Sidebar />

      {/* Main content area where child components will be rendered */}
      <main className="max-w-screen-2xl flex-1 py-4">
        <Outlet />{" "}
        {/* 'children' represents the content passed into the RootLayout */}
      </main>
    </div>
  );
}

export default RootLayout;
