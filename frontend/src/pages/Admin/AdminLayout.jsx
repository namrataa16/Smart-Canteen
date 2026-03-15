import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

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
        <header className="admin-header">
          <div className="admin-header-left">
            <h2 className="admin-page-title">
              {location.pathname === '/admin' ? 'Dashboard Overview' : 
               location.pathname.includes('menu') ? 'Menu Management' : 
               'Order Management'}
            </h2>
          </div>
          <div className="admin-header-right">
            <div className="admin-profile">
              <span className="admin-name">Logged in as: <strong>{user?.name}</strong></span>
              <button onClick={logout} className="nav-logout" style={{ marginLeft: '1rem' }}>
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
