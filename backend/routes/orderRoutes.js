import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/order').post(protect, addOrderItems);
router.route('/orders/user').get(protect, getMyOrders);
router.route('/orders/admin').get(protect, admin, getOrders);
router.route('/order/status').put(protect, admin, updateOrderStatus);

export default router;
