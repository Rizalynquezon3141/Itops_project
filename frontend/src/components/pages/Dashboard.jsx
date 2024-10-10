import React, { useEffect, useState } from "react";
import { SiMysql, SiMicrosoftsqlserver, SiOracle } from "react-icons/si"; // Specific icons for each DB
import Logout from "../portal/Logout";
import { useAuth } from "../../AuthProvider";
import { useNavigate } from "react-router-dom";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login page
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without logging out
  };

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

  return (
    <div className="bg-[#252525] text-neutral-400 p-5">
      <h1 className="text-1xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* MySQL Card */}
        <div className="bg-[#333333] p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px]">
          <span>
            <h2 className="text-xl font-bold mb-2 text-neutral-400">MySQL</h2>
            <p className="text-4xl text-neutral-400">162</p>
          </span>
          <SiMysql className="text-blue-500 text-6xl mb-4" />
        </div>

        {/* SQL Server Card */}
        <div className="bg-[#333333] p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px]">
          <span>
            <h2 className="text-xl font-bold mb-2 text-neutral-400">SQL Server</h2>
            <p className="text-4xl text-neutral-400">32</p>
          </span>
          <SiMicrosoftsqlserver className="text-red-600 text-6xl mb-4" />
        </div>

        {/* Oracle Card */}
        <div className="bg-[#333333] p-6 rounded-lg flex flex-row items-center justify-between min-h-[150px]">
          <span>
            <h2 className="text-xl font-bold mb-2 text-neutral-400">Oracle</h2>
            <p className="text-4xl text-neutral-400">97</p>
          </span>
          <SiOracle className="text-red-600 text-6xl mb-4" />
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to log out?</h2>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Logout
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                <tr key={index} className={index % 2 === 0 ? "bg-[#333333]" : ""}>
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
                <tr key={index} className={index % 2 === 0 ? "bg-[#252525]" : ""}>
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
    </div>
  );
};

export default Dashboard;
