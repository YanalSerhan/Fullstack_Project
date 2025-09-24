import express from "express";
import { handleRunQuery, exportQueryAsCSV, exportQueryAsJSON } from "../controllers/queryController.js";
import { optionalAuth } from "../middleware/auth.js";
import { validateSQLQuery, sanitizeInput } from "../middleware/validation.js";
import { queryLimiter, generalLimiter } from "../middleware/security.js";

const router = express.Router();

// Apply rate limiting and input sanitization to all routes
router.use(generalLimiter);
router.use(sanitizeInput);

// Query routes with optional authentication (for history tracking)
router.post("/run", queryLimiter, optionalAuth, validateSQLQuery, handleRunQuery);

// Export routes (require authentication for security)
router.get("/export/csv", queryLimiter, optionalAuth, exportQueryAsCSV);
router.get("/export/json", queryLimiter, optionalAuth, exportQueryAsJSON);

export default router;