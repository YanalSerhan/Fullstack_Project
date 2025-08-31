import express from "express";
import { handleSaveHistory, handleGetHistory } from "../controllers/historyController.js";

const router = express.Router();

router.post("/", handleSaveHistory);
router.get("/", handleGetHistory);

export default router;