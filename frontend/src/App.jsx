import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageMenu from './pages/Admin/ManageMenu';
import ManageOrders from './pages/Admin/ManageOrders';
import './App.css';

const NotFound = () => (
  <div className="empty-state" style={{ padding: '5rem 1rem' }}>
    <div className="empty-icon">🔍</div>
    <h1 style={{ fontWeight: '900', fontSize: '3rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
    <p>Oops! This page doesn't exist.</p>
    <a href="/">
      <button className="btn-primary" style={{ padding: '0.7rem 2rem' }}>Go Home</button>
    </a>
  </div>
);

// Public Layout Wrapper
const PublicLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
    <Header />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{ 
          style: { 
            background: 'var(--bg-white)', 
            color: 'var(--secondary)', 
            fontWeight: '600',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: 'var(--radius-md)'
          },
          success: {
            iconTheme: {
              primary: 'var(--primary)',
              secondary: 'white',
            },
          },
        }} 
      />
      <Routes>
        {/* Public Routes with Header & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderTracking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes with Sidebar Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<ManageMenu />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
