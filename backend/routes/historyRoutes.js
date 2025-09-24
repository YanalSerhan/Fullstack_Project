import express from 'express';
import { getUserHistory, saveHistory, updateHistory, deleteHistory, getHistory } from '../controllers/historyController.js';
import { authenticateToken } from '../middleware/auth.js';
import { sanitizeInput } from '../middleware/validation.js';
import { generalLimiter } from '../middleware/security.js';

const router = express.Router();

// Apply rate limiting and input sanitization to all routes
router.use(generalLimiter);
router.use(sanitizeInput);

// All history routes require authentication (should have token)
// it comes from the header of the req, see in auth.js
router.use(authenticateToken);

router.get('/', getHistory);
router.get('/:userID', getUserHistory);
router.post('/', saveHistory);
router.put('/:historyID', updateHistory);
router.delete('/:historyID', deleteHistory);

export default router;