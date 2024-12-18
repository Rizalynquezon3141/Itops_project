const TeamEntries = ({ data }) => {
    const teamIds = [2, 3, 4]; // Replace with dynamic team IDs
    const filteredData = data.filter((entry) => teamIds.includes(entry.team_id));
  
    return (
      <>
        <h3 className="text-lg font-semibold mb-4">Team Entries:</h3>
        {filteredData.length > 0 ? (
          filteredData.map(({ eod_id, time, description }) => (
            <div key={eod_id} className="bg-gray-700 p-4 mb-4 rounded shadow-md">
              <h4 className="font-semibold">Time: {time}</h4>
              <p>{description}</p>
            </div>
          ))
        ) : (
          <p>No team entries found.</p>
        )}
      </>
    );
  };
  
  export default TeamEntries;
  