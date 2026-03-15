import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import FoodCard from '../components/FoodCard';
import { AuthContext } from '../contexts/AuthContext';

const CATEGORIES = ['All', 'Snacks', 'Beverages', 'Meals', 'Desserts'];

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category !== 'All' ? `/api/menu?category=${category}` : '/api/menu';
        const { data } = await api.get(url);
        setProducts(data);
      } catch (err) {
        toast.error('Failed to load menu. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchProducts();
  }, [category]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">🍽️ Our Menu</h1>
        <p className="section-subtitle" style={{ marginBottom: '0' }}>
          {products.length} items available{user ? '' : ' — Login to order'}
        </p>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="input-field"
            placeholder="Search menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="filter-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`filter-pill ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <div className="spinner"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">😔</div>
          <h3>No items found</h3>
          <p>Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map(product => (
            <FoodCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
