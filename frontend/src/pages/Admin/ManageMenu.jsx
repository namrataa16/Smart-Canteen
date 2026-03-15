import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { AuthContext } from '../../contexts/AuthContext';

const CATEGORIES = ['Snacks', 'Beverages', 'Meals', 'Desserts'];

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', category: 'Snacks', description: '', image: '', availability: true });
  const { user } = useContext(AuthContext);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/api/menu');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const resetForm = () => {
    setForm({ name: '', price: '', category: 'Snacks', description: '', image: '', availability: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editing ? 'Updating item...' : 'Adding item...');
    try {
      if (editing) {
        await api.put(`/api/menu/${editing}`, form);
        toast.success('Item updated successfully', { id: toastId });
      } else {
        await api.post('/api/menu', form);
        toast.success('Item added to menu', { id: toastId });
      }
      fetchItems();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item.', { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/api/menu/${id}`);
      setItems(items.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch (err) {
      toast.error('Failed to delete item.');
    }
  };

  const handleEdit = (item) => {
    setEditing(item._id);
    setForm({ name: item.name, price: item.price, category: item.category, description: item.description, image: item.image || '', availability: item.availability });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || user.role !== 'admin') return (
    <div className="empty-state">
      <div className="empty-icon">⛔</div>
      <h3>Access Denied</h3>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">🍽️ Manage Menu</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{items.length} items in menu</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }} style={{ fontSize: '0.85rem' }}>
            {showForm ? '✕ Cancel' : '+ Add Item'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card fade-in" style={{ marginBottom: '2rem', borderColor: 'var(--primary-border)' }}>
          <h2 style={{ fontWeight: '700', margin: '0 0 1.5rem', fontSize: '1.1rem', color: 'var(--secondary)' }}>{editing ? '✏️ Edit Item' : '➕ New Menu Item'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Item Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Samosa" required />
            </div>
            <div>
              <label className="form-label">Price (₹) *</label>
              <input className="input-field" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 15" required min="1" />
            </div>
            <div>
              <label className="form-label">Category *</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Image URL</label>
              <input className="input-field" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <input className="input-field" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description of the item" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.availability} onChange={e => setForm({...form, availability: e.target.checked})} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Available</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.6rem' }}>
                {editing ? 'Update Item' : 'Add to Menu'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm} style={{ padding: '0.6rem 1rem' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>No menu items yet. Click "+ Add Item" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item._id} className="card fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={item.image || 'https://placehold.co/60x60/f8f9fa/ff6b35?text=🍽️'} alt={item.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--secondary)' }}>{item.name}</span>
                  {!item.availability && <span className="badge-pill" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.65rem' }}>UNAVAILABLE</span>}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category} • {item.description?.slice(0, 50)}{item.description?.length > 50 ? '...' : ''}</span>
              </div>
              <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem', flexShrink: 0 }}>₹{item.price}</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => handleEdit(item)} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(item._id)} className="btn-danger">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
