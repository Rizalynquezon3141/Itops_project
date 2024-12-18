const ITOperationsEntries = ({ data }) => {
    const filteredData = data.filter((entry) => entry.department === "IT Operations");
  
    return (
      <>
        <h3 className="text-lg font-semibold mb-4">IT Operations Entries:</h3>
        {filteredData.length > 0 ? (
          filteredData.map(({ eod_id, time, description }) => (
            <div key={eod_id} className="bg-gray-700 p-4 mb-4 rounded shadow-md">
              <h4 className="font-semibold">Time: {time}</h4>
              <p>{description}</p>
            </div>
          ))
        ) : (
          <p>No IT operations entries found.</p>
        )}
      </>
    );
  };
  
  export default ITOperationsEntries;
  