import express from 'express';
import {
  getChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from '../controllers/checklistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/:tripId', getChecklist);
router.post('/:tripId', addChecklistItem);
router.put('/:tripId/:itemId', updateChecklistItem);
router.delete('/:tripId/:itemId', deleteChecklistItem);

export default router;
