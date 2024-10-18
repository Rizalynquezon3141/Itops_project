import express from "express";
import { Register, Login, Logout } from "../controllers/Users.js";
import { getCurrentUser } from "../controllers/GetCurrentUser.js";
import { updateUserDetails } from "../controllers/UpdateUserDetails.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { updatePassword } from "../controllers/UpdatePassword.js";

const router = express.Router();

router.put("/update-user", verifyToken, updateUserDetails);
router.put("/update-password", verifyToken, updatePassword);
router.get("/me", verifyToken, getCurrentUser);
router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
