import Users from "../models/UserModel.js";

// Fetch Current Logged-In User
export const getCurrentUser = async (req, res) => {
  try {
    // Fetch the user ID from the token (set in `verifyToken.js`)
    const userId = req.user.userId;

    // Find the user by their ID in the database
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["id", "fullname", "email", "contact", "designation"],
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user data
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
