import React, { useState, useEffect } from "react";
import Calendar from "../MiniComponent/Calendar/calendar";
import AddEod from "../Modal/AddEod";
import axios from "axios";
import Swal from "sweetalert2";

function Eod() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [entry, setEntry] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [eodEntries, setEodEntries] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);

  const timeOptions = [
    "6:00 AM to 3:00 PM",
    "8:00 AM to 4:00 PM (Saturday)",
    "8:00 AM to 5:00 PM",
    "8:30 AM to 5:30 PM",
    "10:00 AM to 6:00 PM",
  ];

  useEffect(() => {
    if (selectedDate) fetchEodEntries(selectedDate);
  }, [selectedDate]);

  const fetchEodEntries = async (date) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/entries/${date}`);
      setEodEntries(data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const openModal = (day) => {
    const formattedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date().setHours(0, 0, 0, 0);

    if (formattedDate > today) {
      Swal.fire({
        title: "Invalid Date",
        text: "You cannot log entries for future dates.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setSelectedDate(formattedDate.toISOString().split("T")[0]);
    resetModalState();
    setModalOpen(true);
  };

  const resetModalState = () => {
    setTime("");
    setEntry("");
    setEditingEntryId(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetModalState();
  };

  const handleSave = async () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);

    if (selected > today) {
      Swal.fire({
        title: "Invalid Action",
        text: "Cannot save entries for future dates.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const newEntry = { date: selectedDate, time, entry };

    try {
      if (editingEntryId) {
        const response = await axios.put(
          `http://localhost:5000/entries/${editingEntryId}`,
          newEntry
        );
        if (response.status === 200) {
          Swal.fire("Updated!", "Log updated successfully.", "success");
        }
      } else {
        const response = await axios.post("http://localhost:5000/entries", newEntry);
        if (response.status === 201) {
          Swal.fire("Saved!", "New log saved successfully.", "success");
        }
      }

      fetchEodEntries(selectedDate);
      closeModal();
    } catch (error) {
      console.error("Error saving entry:", error);
      Swal.fire("Error!", "Failed to save entry.", "error");
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
        setEditingEntryId(entry.id);
        setTime(entry.time);
        setEntry(entry.entry);
        setModalOpen(true);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/entries/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Entry deleted successfully.", "success");
        setEodEntries(eodEntries.filter((entry) => entry.id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      Swal.fire("Error!", "Failed to delete entry.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar Calendar */}
      <div className="w-1/3 p-5 flex justify-center items-center">
        <Calendar
          currentDate={currentDate}
          onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          onDayClick={openModal}
        />
      </div>

      {/* EOD Entries */}
      <div className="w-2/3 p-5">
        <div className="flex justify-end mb-4">
          {["My EOD", "Team", "IT Operations"].map((label, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-lg font-semibold ${idx === 0 ? "bg-red-600" : "bg-gray-700"} text-white mr-2`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 p-5 rounded-lg shadow-md">
          {eodEntries.map(({ id, time, entry }) => (
            <div key={id} className="bg-white shadow p-4 mb-4 rounded">
              <h3 className="font-semibold">Time: {time}</h3>
              <p>{entry}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded mr-2"
                onClick={() => handleEdit({ id, time, entry })}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                onClick={() => handleDelete(id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <AddEod
          isOpen={modalOpen}
          onClose={closeModal}
          timeOptions={timeOptions}
          time={time}
          entry={entry}
          onTimeChange={setTime}
          onEntryChange={setEntry}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default Eod;















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
