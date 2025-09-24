import express from "express";
import {
  uploadDbFile,
  getDbSchema,
  downloadDbFile,
  resetDbFile,
} from "../controllers/dbController.js";
import {upload} from "../middleware/uploadConfig.js";
import { uploadLimiter, generalLimiter } from "../middleware/security.js";
import { sanitizeInput } from "../middleware/validation.js";

const router = express.Router();

// Apply rate limiting and input sanitization to all routes
router.use(generalLimiter);
router.use(sanitizeInput);

// POST /api/db/upload - with upload rate limiting
router.post("/upload", uploadLimiter, upload.single("dbfile"), uploadDbFile);

// GET /api/db/schema
router.get("/schema", getDbSchema);

// GET /api/db/download
router.get("/download", downloadDbFile);

// POST /api/db/reset
router.post("/reset", resetDbFile);

export default router;