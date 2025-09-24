import express from "express";
import { getSQLFromPrompt } from "../controllers/aiController.js";
import { optionalAuth } from "../middleware/auth.js";
import { sanitizeInput } from "../middleware/validation.js";
import { queryLimiter, generalLimiter } from "../middleware/security.js";

const router = express.Router();

// Apply rate limiting and input sanitization to all routes
router.use(generalLimiter); // limit each IP to 100 requests per windowMs each 15 min
router.use(sanitizeInput); 

// AI routes with optional authentication and query rate limiting (20 query per min)
router.post("/generate", queryLimiter, optionalAuth, getSQLFromPrompt);

export default router;
