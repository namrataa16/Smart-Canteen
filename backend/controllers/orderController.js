import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/order
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderedItems, totalPrice } = req.body;

    if (!orderedItems || orderedItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderedItems,
      userId: req.user._id,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Clear the user's cart after placing order
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('addOrderItems error:', error.message);
    res.status(500).json({ message: error.message || 'Server error creating order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('orderedItems.foodItemId', 'name image')
      .sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error.message);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'id name')
      .populate('orderedItems.foodItemId', 'name')
      .sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getOrders error:', error.message);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/order/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, orderId, id } = req.body;
    const targetId = orderId || id;

    if (!targetId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(targetId);

    if (order) {
      order.orderStatus = orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('updateOrderStatus error:', error.message);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

export { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
