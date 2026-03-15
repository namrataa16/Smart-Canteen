import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalQty = cartItems.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: '/menu', label: 'Menu' },
    ...(user ? [{ to: '/orders', label: 'My Orders' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <header className="glass navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">Smart Canteen</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="nav-right">
          {user ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="nav-cart">
                <span>🛒</span>
                {totalQty > 0 && <span className="badge">{totalQty}</span>}
              </Link>

              {/* User Info */}
              <div className="nav-user">
                <span style={{ fontSize: '0.75rem' }}>👤</span>
                <span className="nav-user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="nav-logout">
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login">
                <button className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Sign Up</button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
