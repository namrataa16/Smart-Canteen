import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading('Signing in...');
    
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data);
      toast.success(`Welcome back, ${data.name}! 👋`, { id: toastId });
      navigate('/menu');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">👋</div>
          <h1>Welcome back</h1>
          <p>Sign in to your Smart Canteen account</p>
        </div>

        {/* Card */}
        <div className="card">

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.95rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                  Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Admin hint */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.75rem',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            borderRadius: 'var(--radius-sm)',
          }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Admin Login:</span> superadmin@canteen.com / password123
            </p>
          </div>
        </div>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
