import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

// Admin only routes
router.get('/users', protect, admin, getUsers);
router.route('/users/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUserRole);

export default router;
