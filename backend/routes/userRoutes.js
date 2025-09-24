import express from "express";
import { signup, login, getUsers, getProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateUserRegistration, sanitizeInput } from "../middleware/validation.js";
import { authLimiter, generalLimiter } from "../middleware/security.js";

const router = express.Router();

// Apply rate limiting and input sanitization to all routes
router.use(generalLimiter);
router.use(sanitizeInput);

// Public routes (with auth rate limiting)
router.post("/signup", authLimiter, validateUserRegistration, signup);
router.post("/login", authLimiter, login);

// Protected routes (require authentication)
router.get("/", authenticateToken, getUsers);
router.get("/profile", authenticateToken, getProfile);

export default router;