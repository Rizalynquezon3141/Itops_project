import express from "express";
import { Register, Login, Logout } from "../controllers/Users.js";
import { getCurrentUser } from "../controllers/GetCurrentUser.js";
import { updateUserDetails } from "../controllers/UpdateUserDetails.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { updatePassword } from "../controllers/UpdatePassword.js";
import {
  getEodEntriesByDate,
  addEodEntry,
  updateEodEntry,
  deleteEodEntry,
} from "../controllers/EodControllers.js";

const router = express.Router();

router.put("/update-user", verifyToken, updateUserDetails);
router.put("/update-password", verifyToken, updatePassword);
router.get("/me", verifyToken, getCurrentUser);
router.post("/api-users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

// Get EOD entries by date
router.get("/entries/:date/:filter", verifyToken, getEodEntriesByDate);

// Add a new EOD entry
router.post("/entries", addEodEntry);

// Update an existing EOD entry
router.put("/entries/:id", updateEodEntry);

// Delete an EOD entry
router.delete("/entries/:id", deleteEodEntry);

export default router;
