import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Calendar from "../MiniComponent/Calendar/calendar";
import AddEod from "../Modal/AddEod";

function Eod() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [eodEntries, setEodEntries] = useState([]);
  const [selectedDayEntries, setSelectedDayEntries] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);

  const timeOptions = [
    "6:00 AM to 3:00 PM",
    "8:00 AM to 4:00 PM (Saturday)",
    "8:00 AM to 5:00 PM",
    "8:30 AM to 5:30 PM",
    "10:00 AM to 6:00 PM",
  ];

  useEffect(() => {
    const formattedDate = formatDateForBackend(new Date());
    setSelectedDate(formattedDate);
    fetchEodEntries(formattedDate);
  }, []);

  useEffect(() => {
    if (selectedDate) fetchEodEntries(selectedDate);
  }, [selectedDate]);

  const fetchEodEntries = async (date) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/entries/${date}`);
      setSelectedDayEntries(data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching entries:", error);
      setSelectedDayEntries([]); // Reset state if there's an error
    }
  };

  const formatDateForBackend = (date) => {
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - timezoneOffset).toISOString().split("T")[0];
  };

  const handleDateClick = async (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = formatDateForBackend(clickedDate);
    setSelectedDate(formattedDate);

    // Prevent creating entries for future dates
    if (clickedDate > new Date()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "You cannot add EOD entries for future dates.",
      });
      return;
    }

    // Fetch entries for the clicked date
    try {
      const { data } = await axios.get(
        `http://localhost:5000/entries/${formattedDate}`
      );

      if (data && data.length > 0) {
        Swal.fire({
          icon: "info",
          title: "Entries Exist",
          text: "This date already has EOD entries.",
        });
      } else {
        setModalOpen(true); // Open modal if no entries exist
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch EOD entries.",
      });
    }
  };

  const resetModalState = () => {
    setTime("");
    setDescription("");
  };

  const handleSave = async () => {
    if (!time || !description) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Entry",
        text: "Please fill in both time and description.",
      });
      return;
    }

    const entryData = { user_id: 1, date: selectedDate, time, description };

    try {
      if (editingEntryId) {
        // Update existing entry
        const response = await axios.put(
          `http://localhost:5000/entries/${editingEntryId}`,
          entryData
        );
        if (response.status === 200) {
          Swal.fire("Updated!", "Entry updated successfully.", "success");
          setSelectedDayEntries((prevEntries) =>
            prevEntries.map((entry) =>
              entry.eod_id === editingEntryId
                ? { ...entry, ...entryData }
                : entry
            )
          );
        }
      } else {
        // Create new entry
        const response = await axios.post(
          "http://localhost:5000/entries",
          entryData
        );
        if (response.status === 201) {
          Swal.fire("Saved!", "New log saved successfully.", "success");
          fetchEodEntries(selectedDate);
        }
      }

      // Reset modal and editing state
      setModalOpen(false);
      resetModalState();
      setEditingEntryId(null);
    } catch (error) {
      console.error("Error saving entry:", error.response || error.message);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save entry. Please try again.";
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  const handleEdit = (entry) => {
    Swal.fire({
      title: "Edit Entry",
      text: "You are about to edit this entry.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingEntryId(entry.eod_id);
        setTime(entry.time);
        setDescription(entry.description);
        setModalOpen(true);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/entries/${id}`
      );
      if (response.status === 200) {
        Swal.fire("Deleted!", "Entry deleted successfully.", "success");

        // Remove the deleted entry from the list
        setSelectedDayEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.eod_id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      Swal.fire("Error!", "Failed to delete entry.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="w-1/3 p-5 flex justify-center items-center">
        <Calendar
          currentDate={currentDate}
          onPrevMonth={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
            )
          }
          onNextMonth={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
            )
          }
          onDayClick={handleDateClick}
        />
      </div>

      <div className="w-2/3 p-5">
        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          {selectedDayEntries.length > 0 ? (
            <div className="bg-white shadow p-4 mb-4 rounded">
              <h3 className="font-semibold">Entries for {selectedDate}:</h3>
              {selectedDayEntries.map(({ eod_id, time, description, user }) => (
                <div key={eod_id} className="mt-4">
                  <h4 className="font-semibold">Time: {time}</h4>
                  <p>{description}</p>
                  <p>User: {user.fullname}</p>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
                    onClick={() => handleEdit({ eod_id, time, description })}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                    onClick={() => handleDelete(eod_id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No entries for this date.</p>
          )}
        </div>

        <AddEod
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          timeOptions={timeOptions}
          time={time}
          entry={description}
          onTimeChange={setTime}
          onEntryChange={setDescription}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default Eod;

// Second code sunod sa code na mugana
// import React, { useState, useEffect } from "react";
// import Calendar from "../MiniComponent/Calendar/calendar";
// import AddEod from "../Modal/AddEod";
// import axios from "axios";
// import Swal from "sweetalert2";

// function Eod() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [modalOpen, setModalOpen] = useState(false);
//   const [time, setTime] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eodEntries, setEodEntries] = useState([]);
//   const [selectedDayEntries, setSelectedDayEntries] = useState([]);

//   const timeOptions = [
//     "6:00 AM to 3:00 PM",
//     "8:00 AM to 4:00 PM (Saturday)",
//     "8:00 AM to 5:00 PM",
//     "8:30 AM to 5:30 PM",
//     "10:00 AM to 6:00 PM",
//   ];

//   useEffect(() => {
//     if (selectedDate) fetchEodEntries(selectedDate);
//   }, [selectedDate]);

//   const fetchEodEntries = async (date) => {
//     try {
//       const { data } = await axios.get(`http://localhost:5000/entries/${date}`);
//       setEodEntries(data);
//       setSelectedDayEntries(data.filter((entry) => entry.date === date)); // Update for the selected day
//     } catch (error) {
//       console.error("Error fetching entries:", error);
//     }
//   };

//   const handleDayClick = (day) => {
//     const formattedDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       day
//     );
//     const selectedDateString = formatDateForBackend(formattedDate);

//     // Filter entries for the selected day
//     const dayEntries = eodEntries.filter(
//       (entry) => entry.date === selectedDateString
//     );

//     setSelectedDate(selectedDateString);
//     setSelectedDayEntries(dayEntries);

//     // Prevent opening modal if entries exist
//     if (dayEntries.length === 0) {
//       setModalOpen(true);
//       resetModalState();
//     } else {
//       Swal.fire("Info", "Entries already exist for this date.", "info");
//     }
//   };

//   const handleSave = async () => {
//     const newEntry = { user_id: 1, date: selectedDate, time, description };

//     try {
//       const response = await axios.post("http://localhost:5000/entries", newEntry);
//       if (response.status === 201) {
//         Swal.fire("Saved!", "New log saved successfully.", "success");
//         fetchEodEntries(selectedDate); // Refresh entries for the selected date
//         closeModal();
//       }
//     } catch (error) {
//       console.error("Error saving entry:", error);
//       Swal.fire("Error!", "Failed to save entry.", "error");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:5000/entries/${id}`);
//       if (response.status === 200) {
//         Swal.fire("Deleted!", "Entry deleted successfully.", "success");
//         setEodEntries(eodEntries.filter((entry) => entry.eod_id !== id));
//       }
//     } catch (error) {
//       console.error("Error deleting entry:", error);
//       Swal.fire("Error!", "Failed to delete entry.", "error");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900">
//       {/* Sidebar Calendar */}
//       <div className="w-1/3 p-5 flex justify-center items-center">
//         <Calendar
//           currentDate={currentDate}
//           onPrevMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
//             )
//           }
//           onNextMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
//             )
//           }
//           onDayClick={handleDayClick}
//         />
//       </div>

//       {/* EOD Entries */}
//       <div className="w-2/3 p-5">
//         <div className="bg-gray-800 p-5 rounded-lg shadow-md">
//           {selectedDayEntries.length > 0 ? (
//             <div className="bg-white shadow p-4 mb-4 rounded">
//               <h3 className="font-semibold">Stored Entries:</h3>
//               {selectedDayEntries.map(({ eod_id, time, description, user }) => (
//                 <div key={eod_id} className="mt-4">
//                   <h4 className="font-semibold">Time: {time}</h4>
//                   <p>{description}</p>
//                   <p>User: {user ? user.fullname : "Unknown User"}</p>
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
//                     onClick={() => handleDelete(eod_id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No entries for this date. Click to add a new entry.</p>
//           )}
//         </div>

//         <AddEod
//           isOpen={modalOpen}
//           onClose={closeModal}
//           timeOptions={timeOptions}
//           time={time}
//           entry={description}
//           onTimeChange={setTime}
//           onEntryChange={setDescription}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   );
// }

// export default Eod;

// This is a code that works before implemeting the current solution
// import React, { useState, useEffect } from "react";
// import Calendar from "../MiniComponent/Calendar/calendar";
// import AddEod from "../Modal/AddEod";
// import axios from "axios";
// import Swal from "sweetalert2";

// function Eod() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [modalOpen, setModalOpen] = useState(false);
//   const [time, setTime] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eodEntries, setEodEntries] = useState([]);
//   const [editingEntryId, setEditingEntryId] = useState(null);
//   const [selectedDayEntries, setSelectedDayEntries] = useState([]); // Store entries for the selected day

//   const timeOptions = [
//     "6:00 AM to 3:00 PM",
//     "8:00 AM to 4:00 PM (Saturday)",
//     "8:00 AM to 5:00 PM",
//     "8:30 AM to 5:30 PM",
//     "10:00 AM to 6:00 PM",
//   ];

//   useEffect(() => {
//     if (selectedDate) fetchEodEntries(selectedDate);
//   }, [selectedDate]);

//   const fetchEodEntries = async (date) => {
//     try {
//       const { data } = await axios.get(`http://localhost:5000/entries/${date}`);
//       setEodEntries(data);
//     } catch (error) {
//       console.error("Error fetching entries:", error);
//     }
//   };

//   const formatDateForBackend = (date) => {
//     const timezoneOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
//     const localISOTime = new Date(date - timezoneOffset)
//       .toISOString()
//       .split("T")[0];
//     return localISOTime;
//   };

//   const openModal = (day) => {
//     const formattedDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       day
//     );
//     const today = new Date().setHours(0, 0, 0, 0);

//     if (formattedDate > today) {
//       Swal.fire({
//         title: "Invalid Date",
//         text: "You cannot log entries for future dates.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     setSelectedDate(formatDateForBackend(formattedDate)); // Use formatted date
//     resetModalState();
//     setModalOpen(true);
//   };

//   const resetModalState = () => {
//     setTime("");
//     setDescription("");
//     setEditingEntryId(null);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     resetModalState();
//   };

//   const isSameOrPastDate = (dateString) => {
//     const today = new Date(); // Today's date (local)
//     today.setHours(0, 0, 0, 0); // Set time to midnight

//     const selectedDate = new Date(dateString); // Convert the selected string to a Date object
//     selectedDate.setHours(0, 0, 0, 0); // Ensure no time component affects the comparison

//     return selectedDate <= today; // Returns true if the selected date is today or earlier
//   };

//   const handleSave = async () => {
//     if (!isSameOrPastDate(selectedDate)) {
//       Swal.fire({
//         title: "Invalid Action",
//         text: "Cannot save entries for future dates.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     const newEntry = { user_id: 1, date: selectedDate, time, description };

//     try {
//       if (editingEntryId) {
//         const response = await axios.put(
//           `http://localhost:5000/entries/${editingEntryId}`,
//           newEntry
//         );
//         if (response.status === 200) {
//           Swal.fire("Updated!", "Log updated successfully.", "success");
//         }
//       } else {
//         const response = await axios.post(
//           "http://localhost:5000/entries",
//           newEntry
//         );
//         if (response.status === 201) {
//           Swal.fire("Saved!", "New log saved successfully.", "success");
//         }
//       }

//       fetchEodEntries(selectedDate);
//       closeModal();
//     } catch (error) {
//       console.error("Error saving entry:", error);
//       Swal.fire("Error!", "Failed to save entry.", "error");
//     }
//   };

//   const handleEdit = (entry) => {
//     Swal.fire({
//       title: "Edit Entry",
//       text: "You are about to edit this entry.",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonText: "Proceed",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setEditingEntryId(entry.eod_id);
//         setTime(entry.time);
//         setDescription(entry.description);
//         setModalOpen(true);
//       }
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/entries/${id}`
//       );
//       if (response.status === 200) {
//         Swal.fire("Deleted!", "Entry deleted successfully.", "success");
//         setEodEntries(eodEntries.filter((entry) => entry.eod_id !== id));
//       }
//     } catch (error) {
//       console.error("Error deleting entry:", error);
//       Swal.fire("Error!", "Failed to delete entry.", "error");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900">
//       {/* Sidebar Calendar */}
//       <div className="w-1/3 p-5 flex justify-center items-center">
//         <Calendar
//           currentDate={currentDate}
//           onPrevMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
//             )
//           }
//           onNextMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
//             )
//           }
//           onDayClick={openModal}
//         />
//       </div>

//       {/* EOD Entries */}
//       <div className="w-2/3 p-5">
//         <div className="bg-gray-800 p-5 rounded-lg shadow-md">
//           {selectedDayEntries.length > 0 ? (
//             <div className="bg-white shadow p-4 mb-4 rounded">
//               <h3 className="font-semibold">Stored Entries:</h3>
//               {selectedDayEntries.map(({ eod_id, time, description, user }) => (
//                 <div key={eod_id} className="mt-4">
//                   <h4 className="font-semibold">Time: {time}</h4>
//                   <p>{description}</p>
//                   <p>User: {user.fullname}</p>
//                   <button
//                     className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
//                     onClick={() => handleEdit({ eod_id, time, description })}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
//                     onClick={() => handleDelete(eod_id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No entries for this date. Click to add a new entry.</p>
//           )}
//         </div>

//         <AddEod
//           isOpen={modalOpen}
//           onClose={closeModal}
//           timeOptions={timeOptions}
//           time={time}
//           entry={description}
//           onTimeChange={setTime}
//           onEntryChange={setDescription}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   );
// }

// export default Eod;

// import React, { useState, useEffect } from "react";
// import Calendar from "../MiniComponent/Calendar/calendar";
// import AddEod from "../Modal/AddEod";
// import axios from "axios";
// import Swal from "sweetalert2";
// import dayjs from "dayjs";

// function Eod() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [modalOpen, setModalOpen] = useState(false);
//   const [time, setTime] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eodEntries, setEodEntries] = useState([]);
//   const [editingEntryId, setEditingEntryId] = useState(null);
//   const [selectedDayEntries, setSelectedDayEntries] = useState([]);

//   const timeOptions = [
//     "6:00 AM to 3:00 PM",
//     "8:00 AM to 4:00 PM (Saturday)",
//     "8:00 AM to 5:00 PM",
//     "8:30 AM to 5:30 PM",
//     "10:00 AM to 6:00 PM",
//   ];

//   useEffect(() => {
//     if (selectedDate) {
//       fetchEodEntries(selectedDate); // Fetch entries when the selected date changes
//     }
//   }, [selectedDate]);

//   const fetchEodEntries = async (date) => {
//     try {
//       const { data } = await axios.get(`http://localhost:5000/entries/${date}`);
//       console.log("Fetched entries:", data); // Log the data received from the backend
//       setEodEntries(data);
//       setSelectedDayEntries(data);
//     } catch (error) {
//       console.error("Error fetching entries:", error);
//     }
//   };

//   const formatDateForBackend = (date) => {
//     // Format date to 'YYYY-MM-DD' format for backend
//     return dayjs(date).format("YYYY-MM-DD");
//   };

//   const openModal = async (day) => {
//     const formattedDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       day
//     );
//     const today = new Date().setHours(0, 0, 0, 0);

//     // Prevent opening modal for future dates
//     if (formattedDate > today) {
//       Swal.fire({
//         title: "Invalid Date",
//         text: "You cannot log entries for future dates.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     const selectedFormattedDate = formatDateForBackend(formattedDate);
//     setSelectedDate(selectedFormattedDate);

//     try {
//       // Fetch entries for the selected date
//       const { data } = await axios.get(`http://localhost:5000/entries/${selectedFormattedDate}`);
//       setSelectedDayEntries(data);

//       // If there are existing entries, do not open the modal
//       if (data.length > 0) {
//         Swal.fire({
//           title: "Entries Found",
//           text: "This date already has EOD entries. Please view or edit the existing entries.",
//           icon: "info",
//           confirmButtonText: "OK",
//         });
//         return;
//       }

//       // Open modal if no entries exist
//       setModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching entries:", error);
//       Swal.fire("Error!", "Failed to fetch entries.", "error");
//     }
//   };

//   const resetModalState = () => {
//     setTime("");
//     setDescription("");
//     setEditingEntryId(null);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     resetModalState();
//   };

//   const isSameOrPastDate = (dateString) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const selectedDate = new Date(dateString);
//     selectedDate.setHours(0, 0, 0, 0);

//     return selectedDate <= today;
//   };

//   const handleSave = async () => {
//     if (!isSameOrPastDate(selectedDate)) {
//       Swal.fire({
//         title: "Invalid Action",
//         text: "Cannot save entries for future dates.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     const newEntry = { user_id: 1, date: selectedDate, time, description };

//     try {
//       if (editingEntryId) {
//         const response = await axios.put(
//           `http://localhost:5000/entries/${editingEntryId}`,
//           newEntry
//         );
//         if (response.status === 200) {
//           Swal.fire("Updated!", "Log updated successfully.", "success");
//         }
//       } else {
//         const response = await axios.post(
//           "http://localhost:5000/entries",
//           newEntry
//         );
//         if (response.status === 201) {
//           Swal.fire("Saved!", "New log saved successfully.", "success");
//         }
//       }

//       fetchEodEntries(selectedDate); // Refresh the entries after saving
//       closeModal();
//     } catch (error) {
//       console.error("Error saving entry:", error);
//       Swal.fire("Error!", "Failed to save entry.", "error");
//     }
//   };

//   const handleEdit = (entry) => {
//     Swal.fire({
//       title: "Edit Entry",
//       text: "You are about to edit this entry.",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonText: "Proceed",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setEditingEntryId(entry.eod_id);
//         setTime(entry.time);
//         setDescription(entry.description);
//         setModalOpen(true);
//       }
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/entries/${id}`
//       );
//       if (response.status === 200) {
//         Swal.fire("Deleted!", "Entry deleted successfully.", "success");
//         setEodEntries(eodEntries.filter((entry) => entry.eod_id !== id));
//         fetchEodEntries(selectedDate); // Re-fetch after deletion
//       }
//     } catch (error) {
//       console.error("Error deleting entry:", error);
//       Swal.fire("Error!", "Failed to delete entry.", "error");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900">
//       {/* Sidebar Calendar */}
//       <div className="w-1/3 p-5 flex justify-center items-center">
//         <Calendar
//           currentDate={currentDate}
//           onPrevMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
//             )
//           }
//           onNextMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
//             )
//           }
//           onDayClick={openModal}
//         />
//       </div>

//       {/* EOD Entries */}
//       <div className="w-2/3 p-5">
//         <div className="w-2/3 p-5">
//           <div className="bg-gray-800 p-5 rounded-lg shadow-md">
//             {selectedDayEntries.length > 0 ? (
//               <div className="bg-white shadow p-4 mb-4 rounded">
//                 <h3 className="font-semibold">Stored Entries:</h3>
//                 {selectedDayEntries.map(
//                   ({ eod_id, time, description, user }) => (
//                     <div key={eod_id} className="mt-4">
//                       <h4 className="font-semibold">Time: {time}</h4>
//                       <p>{description}</p>
//                       <p>User: {user.fullname}</p>
//                       <button
//                         className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
//                         onClick={() =>
//                           handleEdit({ eod_id, time, description })
//                         }
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
//                         onClick={() => handleDelete(eod_id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )
//                 )}
//               </div>
//             ) : (
//               <p>No entries for this date. Click to add a new entry.</p>
//             )}
//           </div>
//         </div>

//         <AddEod
//           isOpen={modalOpen}
//           onClose={closeModal}
//           timeOptions={timeOptions}
//           time={time}
//           entry={description}
//           onTimeChange={setTime}
//           onEntryChange={setDescription}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   );
// }

// export default Eod;

// import React, { useState, useEffect } from "react";
// import Calendar from "../MiniComponent/Calendar/calendar";
// import AddEod from "../Modal/AddEod";
// import axios from "axios";
// import Swal from "sweetalert2";

// function Eod() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [modalOpen, setModalOpen] = useState(false);
//   const [time, setTime] = useState("");
//   const [entry, setEntry] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eodEntries, setEodEntries] = useState([]);
//   const [editingEntryId, setEditingEntryId] = useState(null);

//   const timeOptions = [
//     "6:00 AM to 3:00 PM",
//     "8:00 AM to 4:00 PM (Saturday)",
//     "8:00 AM to 5:00 PM",
//     "8:30 AM to 5:30 PM",
//     "10:00 AM to 6:00 PM",
//   ];

//   useEffect(() => {
//     if (selectedDate) fetchEodEntries(selectedDate);
//   }, [selectedDate]);

//   const fetchEodEntries = async (date) => {
//     try {
//       const { data } = await axios.get(`http://localhost:5000/entries/${date}`);
//       setEodEntries(data);
//     } catch (error) {
//       console.error("Error fetching entries:", error);
//     }
//   };

//   const openModal = (day) => {
//     const formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
//     const today = new Date().setHours(0, 0, 0, 0);

//     if (formattedDate > today) {
//       Swal.fire({
//         title: "Invalid Date",
//         text: "You cannot log entries for future dates.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     setSelectedDate(formattedDate.toISOString().split("T")[0]);
//     resetModalState();
//     setModalOpen(true);
//   };

//   const resetModalState = () => {
//     setTime("");
//     setEntry("");
//     setEditingEntryId(null);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     resetModalState();
//   };

//   const handleSave = async () => {
//     const today = new Date().setHours(0, 0, 0, 0);
//     const selected = new Date(selectedDate);

//     if (selected > today) {
//       Swal.fire({
//         title: "Invalid Action",
//         text: "Cannot save entries for future dates.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     const newEntry = { date: selectedDate, time, entry };

//     try {
//       if (editingEntryId) {
//         const response = await axios.put(
//           `http://localhost:5000/entries/${editingEntryId}`,
//           newEntry
//         );
//         if (response.status === 200) {
//           Swal.fire("Updated!", "Log updated successfully.", "success");
//         }
//       } else {
//         const response = await axios.post("http://localhost:5000/entries", newEntry);
//         if (response.status === 201) {
//           Swal.fire("Saved!", "New log saved successfully.", "success");
//         }
//       }

//       fetchEodEntries(selectedDate);
//       closeModal();
//     } catch (error) {
//       console.error("Error saving entry:", error);
//       Swal.fire("Error!", "Failed to save entry.", "error");
//     }
//   };

//   const handleEdit = (entry) => {
//     Swal.fire({
//       title: "Edit Entry",
//       text: "You are about to edit this entry.",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonText: "Proceed",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setEditingEntryId(entry.id);
//         setTime(entry.time);
//         setEntry(entry.entry);
//         setModalOpen(true);
//       }
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:5000/entries/${id}`);
//       if (response.status === 200) {
//         Swal.fire("Deleted!", "Entry deleted successfully.", "success");
//         setEodEntries(eodEntries.filter((entry) => entry.id !== id));
//       }
//     } catch (error) {
//       console.error("Error deleting entry:", error);
//       Swal.fire("Error!", "Failed to delete entry.", "error");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900">
//       {/* Sidebar Calendar */}
//       <div className="w-1/3 p-5 flex justify-center items-center">
//         <Calendar
//           currentDate={currentDate}
//           onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
//           onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
//           onDayClick={openModal}
//         />
//       </div>

//       {/* EOD Entries */}
//       <div className="w-2/3 p-5">
//         <div className="flex justify-end mb-4">
//           {["My EOD", "Team", "IT Operations"].map((label, idx) => (
//             <button
//               key={idx}
//               className={`px-4 py-2 rounded-lg font-semibold ${idx === 0 ? "bg-red-600" : "bg-gray-700"} text-white mr-2`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         <div className="bg-gray-800 p-5 rounded-lg shadow-md">
//           {eodEntries.map(({ id, time, entry }) => (
//             <div key={id} className="bg-white shadow p-4 mb-4 rounded">
//               <h3 className="font-semibold">Time: {time}</h3>
//               <p>{entry}</p>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
//                 onClick={() => handleEdit({ id, time, entry })}
//               >
//                 Edit
//               </button>
//               <button
//                 className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
//                 onClick={() => handleDelete(id)}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>

//         <AddEod
//           isOpen={modalOpen}
//           onClose={closeModal}
//           timeOptions={timeOptions}
//           time={time}
//           entry={entry}
//           onTimeChange={setTime}
//           onEntryChange={setEntry}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   );
// }

// export default Eod;

// import React, { useState, useEffect } from "react";
// import Calendar from "../MiniComponent/Calendar/calendar";
// import AddEod from "../Modal/AddEod";
// import axios from "axios";
// import Swal from "sweetalert2";

// function Eod() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [modalOpen, setModalOpen] = useState(false);
//   const [time, setTime] = useState("");
//   const [entry, setEntry] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eodEntries, setEodEntries] = useState([]);
//   const [editingEntryId, setEditingEntryId] = useState(null);
//   const timeOptions = [
//     "6:00 AM to 3:00 PM",
//     "8:00 AM to 4:00 PM (Saturday)",
//     "8:00 AM to 5:00 PM",
//     "8:30 AM to 5:30 PM",
//     "10:00 AM to 6:00 PM",
//   ];

//   useEffect(() => {
//     if (selectedDate) {
//       axios
//         .get(`http://localhost:5000/entries${selectedDate}`)
//         .then((response) => setEodEntries(response.data))
//         .catch((error) => console.error("Error fetching entries:", error));
//     }
//   }, [selectedDate]);

//   const openModal = (day) => {
//     const formattedDate = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       day
//     );
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of the day for accurate comparison

//     // Restrict logging for future dates
//     if (formattedDate > today) {
//       Swal.fire({
//         title: "Invalid Date",
//         text: "You cannot log entries for future dates.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       });
//       return; // Prevent opening modal for future dates
//     }

//     setSelectedDate(formattedDate.toISOString().split("T")[0]);
//     setModalOpen(true);
//     setEditingEntryId(null);
//     setTime("");
//     setEntry("");
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   const handleSave = async () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
//     const selected = new Date(selectedDate);

//     // Restrict saving for future dates
//     if (selected > today) {
//       Swal.fire({
//         title: "Invalid Action",
//         text: "Cannot save entries for future dates.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     const newEntry = { date: selectedDate, time, entry };

//     try {
//       if (editingEntryId) {
//         const response = await axios.put(
//           `http://localhost:5000/entries${editingEntryId}`,
//           newEntry
//         );
//         if (response.status === 200) {
//           Swal.fire({
//             title: "Updated!",
//             text: "Log updated successfully.",
//             icon: "success",
//             confirmButtonText: "OK",
//           });
//         }
//       } else {
//         const response = await axios.post(
//           "http://localhost:5000/entries",
//           newEntry
//         );
//         if (response.status === 201 || response.status === 200) {
//           Swal.fire({
//             title: "Saved!",
//             text: "New log saved successfully.",
//             icon: "success",
//             confirmButtonText: "OK",
//           });
//         }
//       }

//       axios
//         .get(`http://localhost:5000/entries${selectedDate}`)
//         .then((response) => setEodEntries(response.data))
//         .catch((error) => console.error(error));

//       closeModal();
//       setTime("");
//       setEntry("");
//     } catch (error) {
//       console.error("Error saving entry:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to save entry.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   const handleEdit = (entry) => {
//     Swal.fire({
//       title: "Edit Entry",
//       text: "You are about to edit this entry.",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonText: "Proceed",
//       cancelButtonText: "Cancel",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setModalOpen(true);
//         setEditingEntryId(entry.id);
//         setTime(entry.time);
//         setEntry(entry.entry);
//       }
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/entries${id}`
//       );
//       if (response.status === 200) {
//         Swal.fire({
//           title: "Deleted!",
//           text: "Entry deleted.",
//           icon: "success",
//           confirmButtonText: "OK",
//         });
//         setEodEntries(eodEntries.filter((entry) => entry.id !== id));
//       }
//     } catch (error) {
//       console.error("Error deleting entry:", error);
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to delete entry.",
//         icon: "error",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-900 ">
//       <div className="w-1/3 p-5 flex justify-center items-center">
//         <Calendar
//           currentDate={currentDate}
//           onPrevMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
//             )
//           }
//           onNextMonth={() =>
//             setCurrentDate(
//               new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
//             )
//           }
//           onDayClick={openModal}
//         />
//       </div>

//       {/* Main Content: EOD Details */}
//       <div className="w-2/3 p-5">
//         <div className="flex justify-end mb-4">
//           <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold mr-2">
//             My EOD
//           </button>
//           <button className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold mr-2">
//             Team
//           </button>
//           <button className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold">
//             IT Operations
//           </button>
//         </div>

//         <div className="bg-gray-800 p-5 rounded-lg shadow-md">
//           {eodEntries.map((entry) => (
//             <div key={entry.id} className="bg-white shadow p-4 mb-4 rounded">
//               <h3 className="font-semibold">Time: {entry.time}</h3>
//               <p>{entry.entry}</p>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
//                 onClick={() => handleEdit(entry)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
//                 onClick={() => handleDelete(entry.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>

//         <AddEod
//           isOpen={modalOpen}
//           onClose={closeModal}
//           timeOptions={timeOptions}
//           time={time}
//           entry={entry}
//           onTimeChange={setTime}
//           onEntryChange={setEntry}
//           onSave={handleSave}
//         />
//       </div>
//     </div>
//   );
// }

// export default Eod;
