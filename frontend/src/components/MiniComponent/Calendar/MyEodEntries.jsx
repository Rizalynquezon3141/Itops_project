const MyEodEntries = ({ data }) => {
    const myUserId = 1; // Replace with dynamic user ID if needed
    const filteredData = data.filter((entry) => entry.user_id === myUserId);
  
    return (
      <>
        <h3 className="text-lg font-semibold mb-4">My Entries:</h3>
        {filteredData.length > 0 ? (
          filteredData.map(({ eod_id, time, description }) => (
            <div key={eod_id} className="bg-gray-700 p-4 mb-4 rounded shadow-md">
              <h4 className="font-semibold">Time: {time}</h4>
              <p>{description}</p>
            </div>
          ))
        ) : (
          <p>No entries found for you.</p>
        )}
      </>
    );
  };
  
  export default MyEodEntries;
  