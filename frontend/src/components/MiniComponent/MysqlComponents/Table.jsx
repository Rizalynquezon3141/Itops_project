import React from 'react';
import TableRow from './TableRow';

const Table = ({ data }) => {
  return (
    <div className="bg-[#333333] rounded-lg shadow-md p-6">
      <table className="min-w-full table-auto text-left">
        <thead>
          <tr className="text-gray-400">
            <th>No.</th>
            <th>Database Name</th>
            <th>Primary Host</th>
            <th>Server Name</th>
            <th>Machine Type</th>
            <th>Date/Time</th>
            <th>Date/Time Status</th>
            <th>MySQL Status</th>
            <th>Replication Status</th>
            <th>Home Percentage</th>
            <th>Root Percentage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((db, index) => (
            <TableRow key={index} db={db} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
