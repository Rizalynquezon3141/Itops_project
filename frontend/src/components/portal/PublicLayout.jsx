// src/components/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom"; // Import Outlet for rendering child routes


const PublicLayout = () => {
    return (
      <div>
        {/* Public layout can include a header or any other elements you need */}
        <main><Outlet /></main>
      </div>
    );
  };
  
  export default PublicLayout;
  