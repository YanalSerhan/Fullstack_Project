import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename to prevent path traversal attacks
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}_${sanitizedName}`);
  },
});

function fileFilter(req, file, cb) {
  // Only allow specific file types for security
  const allowedTypes = [
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv', // .csv
    'application/x-sqlite3', // .sqlite3
    'application/x-sqlite', // .sqlite
    'application/octet-stream' // .db files
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel, CSV, and SQLite files are allowed.'), false);
  }
}

// Configure multer with security limits
export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Only one file at a time
    fieldSize: 1024 * 1024 // 1MB field size limit
  }
});