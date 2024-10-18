import Users from "../models/UserModel.js";

// Update User Details
export const updateUserDetails = async (req, res) => {
    const { fullname, email, contact } = req.body; // Get updated data from request body
    const userId = req.user.userId; // Get user ID from decoded JWT
  
    try {
      // Find the user in the database
      const user = await Users.findOne({
        where: { id: userId },
        attributes: ["id", "fullname", "email", "contact", "designation"],
      });
  
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      // Update user details
      user.fullname = fullname;
      user.contact = contact;
      user.email = email;
      await user.save(); // Save updated user back to the database
  
      // Return updated user data
      res.json(user);
    } catch (error) {
      console.error("Error updating user details:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  