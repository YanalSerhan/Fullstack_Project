import { validateDbFile, readDbSchema } from "../services/dbServices.js";

let currentDbPath = null; // keep track of uploaded file

// Upload .db file
export async function uploadDbFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    await validateDbFile(filePath); // check it's a valid SQLite DB
    currentDbPath = filePath;

    res.json({ message: "Database loaded successfully", path: filePath });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Return schema (tables + columns)
export async function getDbSchema(req, res) {
  try {
    if (!currentDbPath) {
      return res.status(400).json({ error: "No database loaded" });
    }

    const schema = await readDbSchema(currentDbPath);
    res.json(schema);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
