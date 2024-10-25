import React from 'react';
import ProgressBar from './ProgressBar';

const TableRow = ({ db }) => {
  return (
    <tr className="text-sm">
      <td>{db.no}</td>
      <td>{db.name}</td>
      <td>{db.primaryHost}</td>
      <td>{db.serverName}</td>
      <td>{db.machineType}</td>
      <td>{db.dateTime}</td>
      <td>
        <span className={`px-2 py-1 rounded-md ${db.dateTimeStatus === 'Synchronized' ? 'bg-green-500' : 'bg-red-500'}`}>
          {db.dateTimeStatus}
        </span>
      </td>
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
        <ProgressBar percentage={db.homePercentage} color="yellow" />
        <p className="text-xs text-gray-400">{db.homePercentage}%</p>
      </td>
      <td>
        <ProgressBar percentage={db.rootPercentage} color="green" />
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
  );
};

export default TableRow;
