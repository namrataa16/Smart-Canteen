import express from 'express';
import {
  getFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from '../controllers/foodItemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getFoodItems).post(protect, admin, createFoodItem);
router.route('/:id')
  .put(protect, admin, updateFoodItem)
  .delete(protect, admin, deleteFoodItem);

export default router;
