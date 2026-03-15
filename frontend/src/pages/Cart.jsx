import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    
    // Add a loading toast wrapper for better UX
    const toastId = toast.loading('Placing your order...');
    
    try {
      await api.post('/api/order', {
        orderedItems: cartItems.map(i => ({
          foodItemId: i.foodItemId || i._id,
          quantity: i.quantity || 1,
          price: i.price,
          name: i.name,
        })),
        totalPrice: total,
      });
      clearCart();
      toast.success('Order placed successfully! 🍽️', { id: toastId });
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.', { id: toastId });
    }
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔐</div>
        <h3>Login Required</h3>
        <p>Please log in to view your cart and place orders.</p>
        <Link to="/login"><button className="btn-primary" style={{ padding: '0.7rem 2rem' }}>Login</button></Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some delicious food from our menu!</p>
        <Link to="/menu"><button className="btn-primary" style={{ padding: '0.7rem 2rem' }}>Browse Menu</button></Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="section-title" style={{ marginBottom: '2.5rem' }}>🛒 Your Cart</h1>

      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={item.foodItemId || item._id} className="card fade-in cart-item">
              <img
                src={item.image || 'https://placehold.co/80x80/f8f9fa/ff6b35?text=🍽️'}
                alt={item.name}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.name}</h3>
                <p className="cart-item-price">₹{item.price}</p>
              </div>

              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => {
                    const qty = (item.quantity || 1) - 1;
                    if (qty <= 0) removeFromCart(item.foodItemId || item._id);
                    else updateQuantity(item.foodItemId || item._id, qty);
                  }}
                >−</button>
                <span className="qty-value">{item.quantity || 1}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.foodItemId || item._id, (item.quantity || 1) + 1)}
                >+</button>
              </div>

              <div className="cart-item-total">
                ₹{item.price * (item.quantity || 1)}
              </div>

              <button
                onClick={() => removeFromCart(item.foodItemId || item._id)}
                className="btn-danger"
                aria-label="Remove item"
                title="Remove item"
              >🗑️</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card cart-summary">
          <h3 className="cart-summary-title">Order Summary</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cartItems.map(item => (
              <div key={item.foodItemId || item._id} className="cart-summary-row">
                <span>{item.name} <span style={{ fontSize: '0.85rem' }}>× {item.quantity || 1}</span></span>
                <span style={{ color: 'var(--text)', fontWeight: '600' }}>₹{item.price * (item.quantity || 1)}</span>
              </div>
            ))}
          </div>

          <div className="cart-summary-total">
            <span>Total Payable</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            ✅ Proceed to Checkout
          </button>
          
          <Link to="/menu" style={{ display: 'block', textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
