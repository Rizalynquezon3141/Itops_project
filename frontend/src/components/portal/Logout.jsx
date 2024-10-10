import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make API call to logout user and clear the refresh token from the database
      await axios.delete("http://localhost:5000/logout", {
        withCredentials: true,
      });

      // Remove the token from local storage
      localStorage.removeItem("accessToken");

      // Redirect to login page
      navigate("/login"); // Adjust this to your login route
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally, handle the error (e.g., show a notification)
    }
  };

  return <button onClick={handleLogout} >Logout</button>;
}

export default Logout;
