import pool from "../config/dbConfig.js";

// Save history to DB
export async function saveHistory(sql, result) {
  const query = "INSERT INTO history (sql_query, result, created_at) VALUES (?, ?, NOW())";
  await pool.query(query, [sql, JSON.stringify(result)]);
}

// Get all history from DB
export async function getHistory() {
  const [rows] = await pool.query("SELECT * FROM history ORDER BY created_at DESC");
  return rows;
}