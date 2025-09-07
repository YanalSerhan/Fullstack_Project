import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Validate file
export async function validateDbFile(filePath) {
  // try to open it as SQLite database
  try {
    const db = await open({ filename: filePath, driver: sqlite3.Database });
    await db.close();
  } catch (err) {
    throw new Error("Invalid file type. Please upload a valid .db file.");
  }
}

// Read schema (tables + columns)
export async function readDbSchema(filePath) {
  const db = await open({ filename: filePath, driver: sqlite3.Database });

  // get all tables
  const tables = await db.all(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
  );

  // get columns for each table
  const schema = {};
  for (let t of tables) {
    const cols = await db.all(`PRAGMA table_info(${t.name});`);
    schema[t.name] = cols.map(c => ({ name: c.name, type: c.type }));
  }

  await db.close();
  return schema;
}
