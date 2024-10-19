import Users from "../models/UserModel.js";

// Update User Details
export const updateUserDetails = async (req, res) => {
  const { fullName, email, contact } = req.body; // Get updated data from request body
  const userId = req.user.userId; // Get user ID from decoded JWT

  try {
    // Find the user in the database
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["id", "firstname", "lastname", "email", "contact", "designation"],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Split fullname into firstname and lastname
    const [firstname, lastname] = fullName.split(' ');

    // Update user details
    user.firstname = firstname || user.firstname; // Only update if value is provided
    user.lastname = lastname || user.lastname;   // Only update if value is provided
    user.email = email || user.email;            // Only update if value is provided
    user.contact = contact || user.contact;      // Only update if value is provided
    
    await user.save(); // Save updated user back to the database

    // Return updated user data
    res.json(user);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
