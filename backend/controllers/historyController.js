import { saveHistory, getHistory } from "../services/historyServices.js";

// Save SQL result to history
export async function handleSaveHistory(req, res) {
  try {
    const { sql, result } = req.body;
    if (!sql || !result) {
      return res.status(400).json({ error: "SQL and result are required" });
    }
    await saveHistory(sql, result);
    res.status(201).json({ message: "History saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all history
export async function handleGetHistory(req, res) {
  try {
    const history = await getHistory();
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}