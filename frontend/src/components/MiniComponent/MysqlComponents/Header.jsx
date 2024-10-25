import { useState, useRef, useEffect } from "react";
import AddMySQLDatabase from "../../Modal/AddMysqlDatabase";

function Header() {
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // State to handle transition
  const modalRef = useRef(null); // Ref for the modal content
  const [activeButton, setActiveButton] = useState("Production");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  // Function to open the modal with a transition
  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      setIsTransitioning(true); // Start transition after rendering
    }, 10); // Small delay to ensure transition
  };

  // Function to close the modal with a transition
  const closeModal = () => {
    setIsTransitioning(false); // Set the transition state for closing
    setTimeout(() => {
      setIsModalOpen(false); // After transition ends, close the modal
    }, 300); // Timeout matches the transition duration
  };

  // Function to handle clicking outside the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal(); // Close the modal if clicked outside
    }
  };

  // Add event listener when modal is open, remove when closed
  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="mb-4">
        {/* Flex container for buttons, will stack vertically on small screens */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4 h-fit">
          {/* Add Database Button */}
          <button
            onClick={openModal} // Open modal on click
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs w-full sm:w-auto"
          >
            Add Database
          </button>
          {/* Environment Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              className={`px-4 py-2 rounded-md text-xs w-full sm:w-auto ${
                activeButton === "Production"
                  ? "bg-blue-500 text-white"
                  : "bg-[#333333] text-gray-300"
              }`}
              onClick={() => handleButtonClick("Production")}
            >
              Production
            </button>
            <button
              className={`px-4 py-2 rounded-md text-xs w-full sm:w-auto ${
                activeButton === "Pre-production"
                  ? "bg-blue-500 text-white"
                  : "bg-[#333333] text-gray-300"
              }`}
              onClick={() => handleButtonClick("Pre-production")}
            >
              Pre-production
            </button>

            <button
              className={`px-4 py-2 rounded-md text-xs w-full sm:w-auto ${
                activeButton === "Tech-QA"
                  ? "bg-blue-500 text-white"
                  : "bg-[#333333] text-gray-300"
              }`}
              onClick={() => handleButtonClick("Tech-QA")}
            >
              Tech-QA
            </button>

            <button
              className={`px-4 py-2 rounded-md text-xs w-full sm:w-auto ${
                activeButton === "Development"
                  ? "bg-blue-500 text-white"
                  : "bg-[#333333] text-gray-300"
              }`}
              onClick={() => handleButtonClick("Development")}
            >
              Development
            </button>
          </div>
        </div>

        {/* Flex container for "Show entries" and "Search", will stack on small screens */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Show entries dropdown */}
          <div className="text-xs flex-shrink-0">
            Show{" "}
            <select className="bg-gray-700 text-white px-2 py-1 rounded-md text-xs">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>{" "}
            entries
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              className="bg-gray-800 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Modal for Adding Database */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            style={{ zIndex: 1000 }}
          >
            <div
              ref={modalRef}
              className={` p-6 rounded-lg shadow-lg w-11/12 max-w-md transform transition-transform duration-300 ease-in-out 
                ${
                  isTransitioning
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }`}
            >
              <AddMySQLDatabase
                isModalOpen={isModalOpen}
                closeModal={closeModal}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
