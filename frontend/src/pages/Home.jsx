import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  const categories = [
    { icon: '🍛', name: 'Meals', desc: 'Hearty rice, rotis & combos', color: '#16a34a' },
    { icon: '🍿', name: 'Snacks', desc: 'Samosa, vada pav & more', color: '#d97706' },
    { icon: '🥤', name: 'Beverages', desc: 'Tea, coffee & cold drinks', color: '#2563eb' },
    { icon: '🍰', name: 'Desserts', desc: 'Sweets & ice creams', color: '#db2777' },
  ];

  const popularItems = [
    { icon: '🍕', name: 'Paneer Pizza', price: 120, tag: 'Bestseller' },
    { icon: '🍛', name: 'Veg Thali', price: 80, tag: 'Value Pack' },
    { icon: '☕', name: 'Masala Chai', price: 15, tag: 'Most Ordered' },
    { icon: '🍔', name: 'Veg Burger', price: 60, tag: 'Popular' },
  ];

  const features = [
    { icon: '🍛', title: 'Fresh Menu Daily', desc: 'Explore a wide variety of freshly prepared meals, snacks, and beverages.' },
    { icon: '🛒', title: 'Quick Ordering', desc: 'Add items to cart and place your order in seconds — no waiting in line.' },
    { icon: '📡', title: 'Live Order Tracking', desc: 'Track your order status in real-time from Received → Preparing → Ready.' },
    { icon: '⚡', title: 'Fast & Reliable', desc: 'Our streamlined system ensures your food is always on time.' },
  ];

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="hero fade-in-up">
        <div className="hero-badge">
          🔥 NOW SERVING • ORDER ONLINE
        </div>

        <h1>
          Smart Canteen –{' '}
          <span className="gradient-text">Order Food Faster</span>
        </h1>

        <p>
          Order your favourite meals, track your food, and enjoy a seamless canteen experience — all from your phone.
        </p>

        <div className="hero-buttons">
          <Link to="/menu">
            <button className="btn-primary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
              🍽️ Order Now
            </button>
          </Link>
          {!user && (
            <Link to="/register">
              <button className="btn-secondary" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
                Create Account
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-row">
        {[
          { value: '50+', label: 'Menu Items' },
          { value: '4', label: 'Categories' },
          { value: 'Live', label: 'Order Tracking' },
          { value: '100%', label: 'Fresh Food' },
        ].map((stat, i) => (
          <div key={i} className="stat-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ===== FOOD CATEGORIES ===== */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">Find exactly what you're craving</p>
        </div>

        <div className="grid-4">
          {categories.map((cat, i) => (
            <Link to="/menu" key={cat.name}>
              <div
                className="card-elevated fade-in"
                style={{
                  textAlign: 'center',
                  padding: '2rem 1.5rem',
                  animationDelay: `${i * 0.1}s`,
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  fontSize: '2.8rem',
                  marginBottom: '0.75rem',
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: `${cat.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                  {cat.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: '1.5' }}>
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== POPULAR FOOD ITEMS ===== */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 1.5rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">🔥 Popular Right Now</h2>
          <p className="section-subtitle">Most loved items from our canteen</p>
        </div>

        <div className="grid-4">
          {popularItems.map((item, i) => (
            <div
              key={item.name}
              className="card-elevated fade-in"
              style={{
                textAlign: 'center',
                padding: '1.75rem 1.25rem',
                animationDelay: `${i * 0.1}s`,
                position: 'relative',
              }}
            >
              {/* Tag */}
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--primary-border)',
              }}>
                {item.tag}
              </span>

              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--secondary)', marginBottom: '0.3rem' }}>
                {item.name}
              </h3>
              <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                ₹{item.price}
              </div>
              <Link to="/menu">
                <button className="btn-primary" style={{ padding: '0.45rem 1.2rem', fontSize: '0.8rem' }}>
                  View in Menu
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY SMART CANTEEN? ===== */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="section-title">Why Smart Canteen?</h2>
          <p className="section-subtitle">Everything you need for a better canteen experience</p>
        </div>

        <div className="grid-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-elevated fade-in"
              style={{
                textAlign: 'center',
                padding: '2rem 1.25rem',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{
                fontSize: '2.2rem',
                marginBottom: '1rem',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: 'var(--secondary)', fontSize: '1rem' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.65', margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      {!user && (
        <section style={{ padding: '2rem 1.5rem 4rem', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,107,53,0.02))',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2rem',
            maxWidth: '650px',
            margin: '0 auto',
          }}>
            <h2 style={{ fontWeight: '800', fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--secondary)' }}>
              Ready to Order?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>
              Create your free account and start ordering in minutes.
            </p>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                🚀 Get Started — It's Free
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
