import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodItemId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    // Filter out items whose foodItemId was deleted (populate returns null)
    cart.items = cart.items.filter(item => item.foodItemId !== null);
    res.json(cart);
  } catch (error) {
    console.error('getCart error:', error.message);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;

    if (!foodItemId) {
      return res.status(400).json({ message: 'Food item ID is required' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.foodItemId.toString() === foodItemId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity) || 1;
    } else {
      cart.items.push({ foodItemId, quantity: Number(quantity) || 1 });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.foodItemId');
    res.json(updatedCart);
  } catch (error) {
    console.error('addToCart error:', error.message);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.foodItemId.toString() === foodItemId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.foodItemId');
    res.json(updatedCart);
  } catch (error) {
    console.error('updateCartItem error:', error.message);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { foodItemId } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.foodItemId.toString() !== foodItemId.toString()
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.foodItemId');
    res.json(updatedCart);
  } catch (error) {
    console.error('removeFromCart error:', error.message);
    res.status(500).json({ message: 'Server error removing from cart' });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared', items: [] });
  } catch (error) {
    console.error('clearCart error:', error.message);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
