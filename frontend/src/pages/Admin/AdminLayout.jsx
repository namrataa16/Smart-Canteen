import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">🍽️ Smart Canteen</div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📊</span>
            Dashboard
          </NavLink>
          
          <NavLink
            to="/admin/menu"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">🍔</span>
            Manage Menu
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">📦</span>
            Manage Orders
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            onClick={logout}
            className="btn-danger"
            style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
