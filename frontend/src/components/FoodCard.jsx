import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


const categoryColors = {
  Snacks: { bg: 'rgba(245, 158, 11, 0.08)', text: '#d97706', border: 'rgba(245, 158, 11, 0.2)' },
  Beverages: { bg: 'rgba(59, 130, 246, 0.08)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' },
  Meals: { bg: 'rgba(34, 197, 94, 0.08)', text: '#16a34a', border: 'rgba(34, 197, 94, 0.2)' },
  Desserts: { bg: 'rgba(236, 72, 153, 0.08)', text: '#db2777', border: 'rgba(236, 72, 153, 0.2)' },
};

const FoodCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const colors = categoryColors[product.category] || {
    bg: 'rgba(148, 163, 184, 0.08)',
    text: '#64748b',
    border: 'rgba(148, 163, 184, 0.2)',
  };

  const handleAdd = () => {
    if (!product.availability) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="food-card fade-in">
      {/* Image */}
      <div className="food-card-image">
        <img
          src={product.image || 'https://placehold.co/300x200/f8f9fa/ff6b35?text=🍽️'}
          alt={product.name}
          style={{ opacity: product.availability ? 1 : 0.4 }}
        />
        {!product.availability && (
          <div className="food-card-unavailable">
            <span>Unavailable</span>
          </div>
        )}
        <span
          className="food-card-category"
          style={{
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="food-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 className="food-card-title">{product.name}</h3>
          <span className="food-card-price">₹{product.price}</span>
        </div>
        <p className="food-card-desc">{product.description}</p>
        
        <div className="food-card-footer">
          {user ? (
            <button
              onClick={handleAdd}
              disabled={!product.availability}
              className="btn-primary"
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
            >
              🛒 Add to Cart
            </button>
          ) : (
            <Link to="/login" style={{ width: '100%' }}>
              <button className="btn-secondary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>
                Login to Order
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
