import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const categoryColors = {
  Snacks:    { bg: '#fff7ed', text: '#ea580c', dot: '#fb923c' },
  Beverages: { bg: '#eff6ff', text: '#2563eb', dot: '#60a5fa' },
  Meals:     { bg: '#f0fdf4', text: '#16a34a', dot: '#4ade80' },
  Desserts:  { bg: '#fdf2f8', text: '#db2777', dot: '#f472b6' },
};

const FoodCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const colors = categoryColors[product.category] || {
    bg: '#f8fafc', text: '#64748b', dot: '#94a3b8',
  };

  const handleAdd = () => {
    if (!product.availability) return;
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="food-card fade-in"
      style={{
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        cursor: 'default',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden', background: '#f8fafc' }}>
        <img
          src={imgError ? 'https://placehold.co/600x400/f8f9fa/ff6b35?text=🍽️' : (product.image || 'https://placehold.co/600x400/f8f9fa/ff6b35?text=🍽️')}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: product.availability ? 1 : 0.45,
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        />

        {/* Unavailable overlay */}
        {!product.availability && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              background: '#ef4444', color: '#fff',
              padding: '0.3rem 0.9rem', borderRadius: '999px',
              fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.04em',
            }}>UNAVAILABLE</span>
          </div>
        )}

        {/* Category badge */}
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.dot}44`,
          padding: '0.25rem 0.7rem',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: '700',
          backdropFilter: 'blur(6px)',
          letterSpacing: '0.03em',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot, display: 'inline-block', marginRight: '5px', verticalAlign: 'middle' }} />
          {product.category}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {/* Name + Price row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: '800',
            color: '#1e293b',
            lineHeight: 1.3,
            flex: 1,
            paddingRight: '0.5rem',
          }}>
            {product.name}
          </h3>
          <span style={{
            fontWeight: '800',
            fontSize: '1.05rem',
            color: '#ea580c',
            whiteSpace: 'nowrap',
            background: '#fff7ed',
            padding: '0.15rem 0.55rem',
            borderRadius: '8px',
            border: '1px solid #fed7aa',
          }}>
            ₹{product.price}
          </span>
        </div>

        {/* Description */}
        <p style={{
          margin: 0,
          fontSize: '0.8rem',
          color: '#64748b',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {product.description}
        </p>

        {/* Add to Cart Button */}
        <div style={{ marginTop: '0.6rem' }}>
          {user ? (
            <button
              onClick={handleAdd}
              disabled={!product.availability}
              style={{
                width: '100%',
                padding: '0.65rem',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: product.availability ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                background: added
                  ? '#16a34a'
                  : product.availability
                    ? 'linear-gradient(135deg, #ff6b35 0%, #ea580c 100%)'
                    : '#e2e8f0',
                color: product.availability ? '#fff' : '#94a3b8',
                boxShadow: product.availability && !added ? '0 4px 14px rgba(234,88,12,0.3)' : 'none',
                transform: 'translateY(0)',
              }}
              onMouseEnter={e => {
                if (product.availability) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {added ? '✅ Added!' : '🛒 Add to Cart'}
            </button>
          ) : (
            <Link to="/login" style={{ width: '100%', display: 'block' }}>
              <button style={{
                width: '100%',
                padding: '0.65rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.875rem',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ea580c'; e.currentTarget.style.color = '#ea580c'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
              >
                🔐 Login to Order
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
