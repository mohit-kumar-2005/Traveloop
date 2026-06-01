import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get('/:tripId', getNotes);
router.post('/:tripId', createNote);
router.put('/:tripId/:noteId', updateNote);
router.delete('/:tripId/:noteId', deleteNote);

export default router;
