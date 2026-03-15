import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';

const statusSteps = ['Received', 'Preparing', 'Ready'];

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/user');
        setOrders(data);
      } catch (err) {
        toast.error('Failed to fetch your orders.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const statusIndex = (status) => statusSteps.indexOf(status);

  const statusClass = (status) => {
    if (status === 'Ready') return 'status-ready';
    if (status === 'Preparing') return 'status-preparing';
    return 'status-received';
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔐</div>
        <h3>Login to track your orders</h3>
        <Link to="/login"><button className="btn-primary" style={{ padding: '0.7rem 2rem', marginTop: '1rem' }}>Login</button></Link>
      </div>
    );
  }

  return (
    <div className="page-container-sm">
      <h1 className="section-title">📦 My Orders</h1>
      <p className="section-subtitle">Track your order status in real-time</p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No orders yet</h3>
          <p>Place your first order from our menu!</p>
          <Link to="/menu"><button className="btn-primary" style={{ padding: '0.7rem 2rem' }}>Browse Menu</button></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order._id} className="card fade-in">
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.75rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Order ID</p>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{order._id?.slice(-8).toUpperCase()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge-pill ${statusClass(order.orderStatus)}`} style={{ padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '700' }}>
                    {order.orderStatus === 'Ready' ? '✅' : order.orderStatus === 'Preparing' ? '👨‍🍳' : '📋'} {order.orderStatus}
                  </span>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(order.orderTime || order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  {statusSteps.map((step, i) => (
                    <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                      <div className={`step-dot ${statusIndex(order.orderStatus) >= i ? 'completed' : 'pending'}`}>
                        {statusIndex(order.orderStatus) >= i ? '✓' : i + 1}
                      </div>
                      <span className={`step-label ${statusIndex(order.orderStatus) >= i ? 'completed' : 'pending'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(statusIndex(order.orderStatus) / (statusSteps.length - 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Items */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items Ordered</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {order.orderedItems?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-light)' }}>{item.name} × {item.quantity}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: '600' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--primary)' }}>₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
