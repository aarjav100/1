import express from 'express';
import {
  submitGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  searchGrievances
} from '../controllers/grievanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search route must be defined BEFORE :id routes to avoid conflict
router.get('/search', protect, searchGrievances);

router.post('/', protect, submitGrievance);
router.get('/', protect, getGrievances);
router.get('/:id', protect, getGrievanceById);
router.put('/:id', protect, updateGrievance);
router.delete('/:id', protect, deleteGrievance);

export default router;
