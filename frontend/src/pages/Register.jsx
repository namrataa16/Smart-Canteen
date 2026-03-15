import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    
    const toastId = toast.loading('Creating your account...');
    
    try {
      await api.post('/api/auth/register', { name, email, password });
      toast.success('Account created successfully! You can now log in.', { id: toastId });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-header">
          <div className="auth-icon">🎉</div>
          <h1>Create Account</h1>
          <p>Join Smart Canteen and start ordering</p>
        </div>

        <div className="card">

          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Omkar Sharma"
                required
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.95rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creating Account...' : '🚀 Create Account'}
            </button>
          </form>
        </div>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
