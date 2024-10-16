import express from "express";
import { Register, Login, Logout, getCurrentUser, updateUserDetails} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
 
const router = express.Router();

router.get('/update-user', verifyToken, updateUserDetails);
router.get('/me', verifyToken, getCurrentUser);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
export default router;