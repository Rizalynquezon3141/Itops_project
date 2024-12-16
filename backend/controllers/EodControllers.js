import Eod from "../models/EodModel.js"; // Import Eod schema
import Users from "../models/UserModel.js"; // Import Users schema
import dayjs from "dayjs"; // Import dayjs library for date formatting

export const getEodEntriesByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const entries = await Eod.findAll({
      where: { date },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["firstname", "lastname"], // Adjust if `fullname` doesn't exist in DB
        },
      ],
      attributes: ["eod_id", "time", "description"], // Ensure columns match the database
    });

    const formattedEntries = entries.map((entry) => ({
      eod_id: entry.eod_id,
      time: entry.time,
      description: entry.description,
      user: {
        fullname: entry.user
          ? `${entry.user.firstname} ${entry.user.lastname}`
          : "Unknown User",
      },
    }));

    res.status(200).json(formattedEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// Add a new EOD entry
export const addEodEntry = async (req, res) => {
  const { user_id, date, time, description } = req.body;

  // Format the date to YYYY-MM-DD to ensure consistency
  const formattedDate = dayjs(date).format("YYYY-MM-DD");

  try {
    const newEntry = await Eod.create({
      user_id, // Make sure the user_id is valid and exists in the Users table
      date: formattedDate, // Store the formatted date
      time,
      description,
    });

    res.status(201).json(newEntry); // Respond with the created entry
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ message: "Failed to create entry" });
  }
};

// Update an existing EOD entry
export const updateEodEntry = async (req, res) => {
  const { id } = req.params;
  const { date, time, description } = req.body;

  // Format the date to ensure it is consistent
  const formattedDate = dayjs(date).format("YYYY-MM-DD");

  try {
    const updated = await Eod.update(
      { date: formattedDate, time, description }, // Pass the formatted date here
      { where: { eod_id: id } } // Use eod_id to match the entry
    );
    if (updated[0] > 0) {
      res.status(200).json({ message: "Entry updated successfully" });
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    console.error("Error updating entry:", error);
    res.status(500).json({ message: "Failed to update entry" });
  }
};

// Delete an EOD entry
export const deleteEodEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Eod.destroy({ where: { eod_id: id } });
    if (deleted) {
      res.status(200).json({ message: "Entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Entry not found" });
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ message: "Failed to delete entry" });
  }
};

