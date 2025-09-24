import express from "express";
import { signup, login, getUsers, changeUserPassword, updateProfile, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Simple middleware to set req.user for all requests
const setUser = (req, res, next) => {
  console.log(`Request received: ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  req.user = { isGuest: false }; // For now, assume all requests are from logged-in users
  next();
};

// Public routes
router.get("/", getUsers);
router.post("/signup", signup);
router.post("/login", login);

// Test route
router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "Test route working" });
});

// Protected routes (require authentication)
router.get("/profile", setUser, getUserProfile);
router.put("/profile", setUser, updateProfile);
router.put("/change-password", setUser, changeUserPassword);

export default router;