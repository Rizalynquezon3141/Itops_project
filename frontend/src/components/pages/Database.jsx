import React from 'react'
import { useParams } from "react-router-dom"; // Importing the useParams hook to access URL parameters
import Mysql from "./Mysql";
import Microsoft from "./Microsoft";
import Oracle from "./Oracle";

function Database() {
  // Extract the 'aID' parameter from the URL using the useParams hook
  const { aID } = useParams();

  // Render the correct component based on the aID parameter
  const renderContent = () => {
    switch (aID) {
      case "Mysql":
        return <Mysql/>; // Render the Dashboard component
      case "Microsoft":
        return <Microsoft />; // Render the Events component
      case "Oracle":
        return <Oracle />; // Render the Realtime component
      default:
        return <p>Analytics Option Not Found</p>; // Handle unknown aID values
    }
  };

  // Display the content for the selected Database option
  return (
    <div>
      <h1 className='text-white'>Databases / {aID}</h1>
      {renderContent()} {/* Render the component based on the aID */}
    </div>
  );
}

export default Database