import express from 'express';
import {
  registerStudent,
  loginStudent,
  updatePassword,
  updateCourse,
  getMe,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/update-password', protect, updatePassword);
router.put('/update-course', protect, updateCourse);
router.get('/me', protect, getMe);

export default router;
