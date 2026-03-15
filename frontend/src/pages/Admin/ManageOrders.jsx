import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { AuthContext } from '../../contexts/AuthContext';

const STATUSES = ['Received', 'Preparing', 'Ready'];
const statusIcon = { Received: '📋', Preparing: '👨‍🍳', Ready: '✅' };
const statusColor = { Received: 'var(--text-muted)', Preparing: '#d97706', Ready: '#16a34a' };

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/api/orders/admin');
      // Sort newest first
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.role === 'admin') fetchOrders(); }, [user]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const toastId = toast.loading(`Updating order to ${newStatus}...`);
    try {
      await api.put('/api/order/status', { orderId, orderStatus: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`, { id: toastId });
    } catch (err) {
      toast.error('Failed to update status.', { id: toastId });
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">📦 Manage Orders</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>View and process incoming student orders</p>
        </div>
        <div>
          <button onClick={fetchOrders} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            🔄 Refresh Orders
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-white)', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`filter-pill ${filter === s ? 'active' : ''}`}
            style={{ border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.4rem 1rem' }}
          >
            {s === 'all' ? `All (${orders.length})` : `${statusIcon[s]} ${s} (${orders.filter(o => o.orderStatus === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No orders {filter !== 'all' ? `with status "${filter}"` : 'found'}</p>
        </div>
      ) : (
        <div className="admin-table-container fade-in">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID & Time</th>
                <th>Student</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order._id}>
                  {/* ID & Time */}
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--secondary)' }}>
                      #{order._id?.slice(-6).toUpperCase()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {new Date(order.orderTime || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  
                  {/* Student */}
                  <td>
                    <div style={{ fontWeight: '500', fontSize: '0.85rem' }}>
                      {order.userId?.name || 'Student'}
                    </div>
                  </td>
                  
                  {/* Items */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {order.orderedItems?.slice(0, 2).map((item, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: '600' }}>{item.quantity}x</span> {item.name}
                        </div>
                      ))}
                      {order.orderedItems?.length > 2 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                          + {order.orderedItems.length - 2} more
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Total */}
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                      ₹{order.totalPrice}
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      background: `${statusColor[order.orderStatus]}15`,
                      color: statusColor[order.orderStatus],
                      border: `1px solid ${statusColor[order.orderStatus]}30`,
                      display: 'inline-block'
                    }}>
                      {statusIcon[order.orderStatus]} {order.orderStatus}
                    </span>
                  </td>
                  
                  {/* Actions Dropdown/Buttons */}
                  <td>
                    <select 
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="input-field"
                      style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem', minWidth: '120px' }}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
