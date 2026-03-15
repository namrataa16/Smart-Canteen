import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    popularItems: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/orders/admin');
        
        const totalOrders = data.length;
        const totalSales = data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        const pendingOrders = data.filter(o => o.orderStatus !== 'Ready').length;
        
        // Calculate popular items
        const itemCounts = {};
        data.forEach(order => {
          order.orderedItems?.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
          });
        });
        
        const popularItems = Object.entries(itemCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        setStats({ totalOrders, totalSales, pendingOrders, popularItems });
      } catch (err) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div className="admin-banner fade-in" style={{ marginBottom: '2rem', padding: '1.5rem 2rem' }}>
        <div className="admin-banner-icon">👨‍🍳</div>
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p>Here's what's happening in your canteen today.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
            <div className="card-elevated fade-in" style={{ padding: '1.5rem', animationDelay: '0s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Orders</h3>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)' }}>{stats.totalOrders}</div>
                </div>
                <div style={{ fontSize: '1.5rem', background: 'var(--bg-alt)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>📋</div>
              </div>
            </div>
            
            <div className="card-elevated fade-in" style={{ padding: '1.5rem', animationDelay: '0.1s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Sales</h3>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>₹{stats.totalSales}</div>
                </div>
                <div style={{ fontSize: '1.5rem', background: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>💰</div>
              </div>
            </div>
            
            <div className="card-elevated fade-in" style={{ padding: '1.5rem', animationDelay: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Pending Action</h3>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#dc2626' }}>{stats.pendingOrders}</div>
                </div>
                <div style={{ fontSize: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>⏳</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
            {/* Quick Actions (left) */}
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Quick Actions</h2>
              <div className="grid-2">
                <Link to="/admin/menu" style={{ textDecoration: 'none' }}>
                  <div className="card fade-in" style={{ padding: '1.5rem', border: '1px solid var(--border)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍔</div>
                    <h3 style={{ margin: '0 0 0.25rem', color: 'var(--secondary)' }}>Manage Menu</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add or update items</p>
                  </div>
                </Link>
                <Link to="/admin/orders" style={{ textDecoration: 'none' }}>
                  <div className="card fade-in" style={{ padding: '1.5rem', border: '1px solid var(--border)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                    <h3 style={{ margin: '0 0 0.25rem', color: 'var(--secondary)' }}>Manage Orders</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Update order status</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Popular Items (right) */}
            <div className="card fade-in" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⭐ Popular Items</h2>
              {stats.popularItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.popularItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: idx !== stats.popularItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: '500' }}>{item.name}</span>
                      <span className="badge-pill" style={{ background: 'var(--bg-alt)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.count} sold</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No order data yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
