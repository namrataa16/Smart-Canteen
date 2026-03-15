import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div>
          <div className="footer-brand">
            <span className="footer-logo">🍽️</span>
            <span className="footer-name">Smart Canteen</span>
          </div>
          <p className="footer-text" style={{ marginTop: '0.35rem' }}>
            Your campus food, reimagined.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <Link to="/menu" className="footer-link">Menu</Link>
          <Link to="/cart" className="footer-link">Cart</Link>
          <Link to="/orders" className="footer-link">Orders</Link>
          <Link to="/login" className="footer-link">Login</Link>
        </div>

        {/* Tech */}
        <p className="footer-tech">
          Built with React + Node.js + MongoDB
        </p>
      </div>
    </footer>
  );
};

export default Footer;
