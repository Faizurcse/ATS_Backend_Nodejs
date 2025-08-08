// ✅ routes/authRoutes.js
import express from "express";
import { 
  sendOtp, 
  verifyOtp, 
  createUser, 
  getAllUsers, 
  getAllLoginHistory, 
  updateUser, 
  deleteUser,
  getUsersByType,
  getUserById
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/create-user", createUser);
router.get("/all-users", getAllUsers);
router.get("/users/:userType", getUsersByType);
router.get("/user/:id", getUserById);
router.get("/all-login-history", getAllLoginHistory);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
