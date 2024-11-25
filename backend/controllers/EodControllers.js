import Eod from "../models/EodModel.js"; // Import Eod schema
import Users from "../models/UserModel.js"; // Import Users schema

// Get EOD entries by date
export const getEodEntriesByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const entries = await Eod.findAll({
      where: { date },
      include: [{ model: Users, as: "user", attributes: ["id", "fullname"] }],
    });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

// Add a new EOD entry
export const addEodEntry = async (req, res) => {
  const { user_id, date, time, description } = req.body;
  try {
    const newEntry = await Eod.create({ user_id, date, time, description });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ message: "Failed to create entry" });
  }
};

// Update an existing EOD entry
export const updateEodEntry = async (req, res) => {
  const { id } = req.params;
  const { date, time, description } = req.body;
  try {
    const updated = await Eod.update(
      { date, time, description },
      { where: { eod_id: id } }
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
