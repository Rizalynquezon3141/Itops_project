import React, { useState } from "react";

const AddMySQLDatabase = ({ isModalOpen, closeModal}) => {
  const [formData, setFormData] = useState({
    environment: "",
    databaseName: "",
    primaryHost: "",
    secondaryHost: "",
    replicationType: "",
    machineType: "Server Instance",
    backup: "Enabled",
  });

  if(!isModalOpen) return null; // If modal is not open, don't render it

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submit logic here
    console.log("Form Data:", formData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-[#252525] p-6 rounded-lg shadow-md w-full"
      >
        <h2 className="text-gray-400  text-lg font-medium mb-4">Add MySQL Database</h2>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Database System</label>
          <input
            type="text"
            value="MySQL"
            readOnly
            className="w-full bg-[#333333] text-gray-300 p-2 rounded text-xs"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 mb-1 text-sm">Environment</label>
          <select
            name="environment"
            value={formData.environment}
            onChange={handleChange}
            className="w-full bg-[#333333] text-gray-400 p-2 rounded text-xs "
          >
            <option value="" disabled>Select Environment</option>
            <option value="Production">Production</option>
            <option value="Pre-production">Pre-production</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Database Name</label>
          <input
            type="text"
            name="databaseName"
            value={formData.databaseName}
            onChange={handleChange}
            className="w-full bg-[#333333] text-gray-300 p-2 rounded text-xs"
            placeholder="Database Name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Primary Host</label>
          <input
            type="text"
            name="primaryHost"
            value={formData.primaryHost}
            onChange={handleChange}
            className="w-full bg-[#333333] text-gray-300 p-2 rounded text-xs"
            placeholder="Primary Host"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Secondary Host</label>
          <input
            type="text"
            name="secondaryHost"
            value={formData.secondaryHost}
            onChange={handleChange}
            className="w-full bg-[#333333] text-gray-300 p-2 rounded text-xs"
            placeholder="Secondary Host"
          />
          <p className="text-yellow-600 text-xs mt-1">
            If secondary host is not applicable, please leave it blank.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Replication Type</label>
          <select
            name="replicationType"
            value={formData.replicationType}
            onChange={handleChange}
            className="w-full bg-[#333333] text-gray-400 p-2 rounded text-xs"
          >
            <option value="" disabled>Select Replication Type</option>
            <option value="Master-Slave">Master-Slave</option>
            <option value="Master-Master">Master-Master</option>
            {/* Add more replication types as needed */}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">Machine Type</label>
          <input
            type="text"
            value="Server Instance"
            readOnly
            className="w-full bg-[#333333] text-gray-400 p-2 rounded text-xs"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-1 text-sm">
            Enable backup on this server?
          </label>
          <select
            name="backup"
            value={formData.backup}
            onChange={handleChange}
            className="w-full bg-[#333333] text-gray-400 p-2 rounded text-xs"
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600 text-sm"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded  hover:bg-green-700 text-sm"
          >
            Save Database
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMySQLDatabase;
