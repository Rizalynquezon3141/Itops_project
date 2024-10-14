// Multer setup for image upload
import multer from "multer";
import path from "path";
import Users from "../models/UserModel.js"; // Import your Users model

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Profile Update Route
export const updateProfile = async (req, res) => {
  const uploadSingle = upload.single("profilePicture");

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ msg: "Error uploading file" });
    }

    const { name, email, phoneNumber, password } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    try {
      // Find user by email (or any other criteria like user ID)
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Update the user's profile information
      await Users.update(
        {
          name,
          email,
          phoneNumber,
          password, // You may need to hash the password before saving
          profilePicture,
        },
        { where: { email } }
      );

      return res.status(200).json({ msg: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  });
};
