import React, { useEffect, useState } from "react";
import { SiMysql, SiMicrosoftsqlserver, SiOracle } from "react-icons/si"; // Specific icons for each DB
import { useAuth } from "../portal/AuthProvider";
import { useNavigate } from "react-router-dom";

// Modal Component
const ConfirmLogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded p-5">
        <h2 className="text-lg font-bold mb-4">Confirmation</h2>
        <p>Do you want to log out?</p>
        <div className="flex justify-end mt-4">
          <button
            className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
            onClick={onConfirm}
          >
            Yes, Log Out
          </button>
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const mysqlData = [
    { name: "KYC Image Customer AB Master B", home: 89, root: 11 },
    { name: "ML Express Master B", home: 86, root: 33 },
    { name: "ChatRA Master A", home: 85, root: 20 },
  ];

  const oracleData = [
    { name: "KYC Image Customer J Master A", home: 81, root: 14 },
    { name: "KYC Image Customer J Master B", home: 80, root: 17 },
    { name: "ML Express Master B", home: 75, root: 29 },
  ];

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = (event) => {
      if (isAuthenticated) {
        event.preventDefault(); // Prevent the default popstate behavior
        setIsModalOpen(true); // Show the confirmation modal
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated]);

  const handleLogoutConfirm = () => {
    logout(); // Perform logout
    navigate("/login"); // Redirect to login page
  };

  const handleLogoutCancel = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="bg-[#252525] text-neutral-400 p-5">
      <h1 className="text-1xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
        {/* MySQL Card */}
        <div className="bg-[#333333] p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px] shadow-lg">
          <span>
            <h2 className="text-xl font-bold mb-2 text-neutral-400">MySQL</h2>
            <p className="text-4xl text-neutral-400">162</p>
          </span>
          <SiMysql className="text-blue-500 text-6xl mb-4" />
        </div>

        {/* SQL Server Card */}
        <div className="bg-[#333333] p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px] shadow-lg">
          <span>
            <h2 className="text-xl font-bold mb-2 text-neutral-400">
              SQL Server
            </h2>
            <p className="text-4xl text-neutral-400">32</p>
          </span>
          <SiMicrosoftsqlserver className="text-red-600 text-6xl mb-4" />
        </div>

        {/* Oracle Card */}
        <div className="bg-[#333333] p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px] shadow-lg">
          <span>
            <h2 className="text-xl font-bold mb-2 text-neutral-400">Oracle</h2>
            <p className="text-4xl text-neutral-400">97</p>
          </span>
          <SiOracle className="text-red-600 text-6xl mb-4" />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4">TOP 10 MYSQL USED STORAGE</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Database Name</th>
                <th className="text-right">Home Percentage</th>
                <th className="text-right">Root Percentage</th>
              </tr>
            </thead>
            <tbody>
              {mysqlData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#333333]" : ""}
                >
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">
                    <div className="relative bg-red-500 h-2 rounded-full">
                      <div
                        className="absolute bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.home}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4 text-teal-500">{item.root}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ORACLE data table (similar structure to MYSQL) */}
        <div className="w-1/2">
          <h2 className="text-xl font-bold mb-4">TOP 10 ORACLE USED STORAGE</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Database Name</th>
                <th className="text-right">Home Percentage</th>
                <th className="text-right">Root Percentage</th>
              </tr>
            </thead>
            <tbody>
              {oracleData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#252525]" : ""}
                >
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">
                    <div className="relative bg-red-500 h-2 rounded-full">
                      <div
                        className="absolute bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.home}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4 text-teal-500">{item.root}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmLogoutModal
        isOpen={isModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
};

export default Dashboard;
