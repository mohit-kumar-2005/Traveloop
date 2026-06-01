import express from 'express';
import { getBudget, createBudget, updateBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/:tripId', getBudget);
router.post('/:tripId', createBudget);
router.put('/:tripId', updateBudget);

export default router;
