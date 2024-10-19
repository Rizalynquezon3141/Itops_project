import Users from "../models/UserModel.js";
import bcrypt from "bcrypt"; // For hashing passwords

// Update User Password
export const updatePassword = async (req, res) => {
    const { password } = req.body; // Get the new password from the request body
    const userId = req.user.userId; // Get user ID from decoded JWT

    if (!password) {
        return res.status(400).json({ msg: "Password is required" });
    }

    try {
        // Find the user in the database
        const user = await Users.findOne({
            where: { id: userId },
            attributes: ["id", "firstname", "lastname", "email", "contact", "designation", "password"], // Add any additional fields as needed
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save(); // Save updated user back to the database

        // Return success message
        res.json({ msg: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};
