import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = activeRole === 'admin';

  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Signing in...');
    try {
      const { data } = await api.post('/api/auth/login', { email, password, role: activeRole });
      login(data);
      toast.success(`Welcome back, ${data.name}! 👋`, { id: toastId });
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">

        {/* Role Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '5px',
          marginBottom: '1.5rem',
          gap: '5px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <button
            type="button"
            onClick={() => handleRoleSwitch('student')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              border: 'none',
              borderRadius: 'calc(var(--radius-md) - 3px)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.25s ease',
              background: !isAdmin ? 'var(--primary)' : 'transparent',
              color: !isAdmin ? 'white' : 'var(--text-muted)',
              boxShadow: !isAdmin ? 'var(--shadow-sm)' : 'none',
            }}
          >
            🎓 Student Login
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              border: 'none',
              borderRadius: 'calc(var(--radius-md) - 3px)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              transition: 'all 0.25s ease',
              background: isAdmin ? '#ea580c' : 'transparent',
              color: isAdmin ? 'white' : 'var(--text-muted)',
              boxShadow: isAdmin ? 'var(--shadow-sm)' : 'none',
            }}
          >
            🛡️ Admin Login
          </button>
        </div>

        {/* Header */}
        <div className="auth-header" style={{ marginBottom: '1.2rem' }}>
          <div className="auth-icon">{isAdmin ? '🛡️' : '🎓'}</div>
          <h1>{isAdmin ? 'Admin Portal' : 'Student Portal'}</h1>
          <p>{isAdmin ? 'Sign in to manage the canteen' : 'Sign in to your Smart Canteen account'}</p>
        </div>

        {/* Card */}
        <div className="card" style={{
          borderTop: `3px solid ${isAdmin ? '#ea580c' : 'var(--primary)'}`,
          transition: 'border-color 0.3s ease',
        }}>
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isAdmin ? 'admin@canteen.com' : 'you@college.edu'}
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
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                marginTop: '0.5rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                background: isAdmin ? '#ea580c' : 'var(--primary)',
                color: 'white',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: '8px', verticalAlign: 'middle' }}></span>
                  Signing in...
                </>
              ) : isAdmin ? '🛡️ Sign In as Admin →' : '🎓 Sign In as Student →'}
            </button>
          </form>
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
