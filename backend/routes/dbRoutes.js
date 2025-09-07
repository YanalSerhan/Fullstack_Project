import express from "express";
import multer from "multer";
import { uploadDbFile, getDbSchema } from "../controllers/dbController.js";

const router = express.Router();

// configure multer (only save .db files in /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, file.originalname)
});

function fileFilter(req, file, cb) {
  if (file.originalname.endsWith(".db")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Please upload a .db file."), false);
  }
}

const upload = multer({ storage, fileFilter });

// POST /api/db/upload
router.post("/upload", upload.single("dbfile"), uploadDbFile);

// GET /api/db/schema
router.get("/schema", getDbSchema);

export default router;
