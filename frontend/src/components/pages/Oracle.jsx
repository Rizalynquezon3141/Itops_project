import React from "react";
import { TopArea, Table } from "../MiniComponent/OracleComponents"
function Microsoft() {
  return (
    <div className="sm:px-6 w-full">
      <div className="mb-9">
        <TopArea />
      </div>
      <div class="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
        <Table />
      </div>
    </div>
  );
}

export default Microsoft;

{
  /*import React from 'react';

const databases = [
  {
    no: 1,
    name: 'Bills Payment Master A',
    primaryHost: '10.4.2.63',
    serverName: '0301SACRAM07MA',
    machineType: 'Server Instance',
    dateTime: '2024-10-23 14:07:01',
    mysqlStatus: 'Running',
    syncStatus: 'Synchronized',
    replicationStatus: 'N/A',
    homePercentage: 63,
    rootPercentage: 14,
  },
  {
    no: 2,
    name: 'Bills Payment Master B',
    primaryHost: '10.4.2.166',
    serverName: '0301SACRAM07MB',
    machineType: 'Server Instance',
    dateTime: '2024-10-23 14:07:01',
    mysqlStatus: 'Running',
    syncStatus: 'Synchronized',
    replicationStatus: 'Running',
    homePercentage: 64,
    rootPercentage: 19,
  },
  // Add the remaining rows similarly...
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Oracle MySQL Cloud Infrastructure</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Add Database
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="text-gray-400">
              <th>No.</th>
              <th>Database Name</th>
              <th>Primary Host</th>
              <th>Server Name</th>
              <th>Machine Type</th>
              <th>Date/Time</th>
              <th>MySQL Status</th>
              <th>Replication Status</th>
              <th>Home Percentage</th>
              <th>Root Percentage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {databases.map((db) => (
              <tr key={db.no} className="text-sm">
                <td>{db.no}</td>
                <td>{db.name}</td>
                <td>{db.primaryHost}</td>
                <td>{db.serverName}</td>
                <td>{db.machineType}</td>
                <td>{db.dateTime}</td>
                <td>
                  <span className={`px-2 py-1 rounded-md ${db.mysqlStatus === 'Running' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {db.mysqlStatus}
                  </span>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-md ${db.replicationStatus === 'Running' ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {db.replicationStatus}
                  </span>
                </td>
                <td>
                  <div className="bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${db.homePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">{db.homePercentage}%</p>
                </td>
                <td>
                  <div className="bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${db.rootPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">{db.rootPercentage}%</p>
                </td>
                <td className="flex space-x-2">
                  <button className="bg-green-500 p-2 rounded-md hover:bg-green-600">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="bg-red-500 p-2 rounded-md hover:bg-red-600">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button className="bg-gray-700 px-4 py-2 rounded-md text-gray-400">Previous</button>
        <button className="bg-gray-700 px-4 py-2 rounded-md text-gray-400">Next</button>
      </div>
    </div>
  );
};

export default App;*/
}
