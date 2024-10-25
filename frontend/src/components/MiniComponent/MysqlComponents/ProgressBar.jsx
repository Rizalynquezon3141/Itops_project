import React from 'react';

const ProgressBar = ({ percentage, color }) => {
  return (
    <div className="bg-gray-700 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full bg-${color}-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
