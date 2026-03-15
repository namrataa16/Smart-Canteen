import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    studentId: '',
    phone: '',
    department: 'Computer Engineering',
    year: '1st Year'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const departments = ['Computer Engineering', 'Mechanical Engineering', 'Electronics', 'Civil Engineering', 'Other'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const isAdmin = selectedRole === 'admin';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Creating your account...');
    try {
      await api.post('/api/auth/register', { ...formData, role: selectedRole });
      toast.success('Account created! You can now log in.', { id: toastId });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in" style={{ maxWidth: '580px' }}>

        {/* Header */}
        <div className="auth-header" style={{ marginBottom: '1.2rem' }}>
          <div className="auth-icon">{isAdmin ? '🛡️' : '🎉'}</div>
          <h1>Create Account</h1>
          <p>Join Smart Canteen as a {isAdmin ? 'Canteen Admin' : 'Student'}</p>
        </div>

        {/* Role Selector Cards */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* Student Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            style={{
              flex: 1,
              padding: '1rem',
              border: `2px solid ${!isAdmin ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              background: !isAdmin ? 'var(--primary-light)' : 'var(--bg-white)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.25s ease',
              boxShadow: !isAdmin ? '0 0 0 3px var(--primary-border)' : 'none',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>🎓</div>
            <div style={{
              fontWeight: '700',
              fontSize: '0.9rem',
              color: !isAdmin ? 'var(--primary)' : 'var(--text-muted)',
            }}>Student</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>
              Order food & track orders
            </div>
          </button>

          {/* Admin Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            style={{
              flex: 1,
              padding: '1rem',
              border: `2px solid ${isAdmin ? '#ea580c' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              background: isAdmin ? '#fff7ed' : 'var(--bg-white)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.25s ease',
              boxShadow: isAdmin ? '0 0 0 3px #fed7aa' : 'none',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>🛡️</div>
            <div style={{
              fontWeight: '700',
              fontSize: '0.9rem',
              color: isAdmin ? '#ea580c' : 'var(--text-muted)',
            }}>Admin</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '0.2rem' }}>
              Manage menu & orders
            </div>
          </button>
        </div>

        {/* Form Card */}
        <div className="card" style={{
          borderTop: `3px solid ${isAdmin ? '#ea580c' : 'var(--primary)'}`,
          transition: 'border-color 0.3s ease',
        }}>
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name + (Student ID if student) */}
            <div className={!isAdmin ? 'grid-2' : ''}>
              <div>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>👤</span>
                  <input
                    type="text"
                    name="name"
                    className="input-field"
                    style={{ paddingLeft: '2.2rem' }}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isAdmin ? 'Admin Name' : 'Omkar Sharma'}
                    required
                  />
                </div>
              </div>

              {!isAdmin && (
                <div>
                  <label className="form-label">Student ID / Roll No</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>🆔</span>
                    <input
                      type="text"
                      name="studentId"
                      className="input-field"
                      style={{ paddingLeft: '2.2rem' }}
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="e.g. CS2024001"
                      required={!isAdmin}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid-2">
              <div>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>✉️</span>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    style={{ paddingLeft: '2.2rem' }}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isAdmin ? 'admin@canteen.com' : 'you@college.edu'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>📱</span>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    style={{ paddingLeft: '2.2rem' }}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Department + Year — only for students */}
            {!isAdmin && (
              <div className="grid-2">
                <div>
                  <label className="form-label">Department</label>
                  <select name="department" className="input-field" value={formData.department} onChange={handleChange}>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Year / Semester</label>
                  <select name="year" className="input-field" value={formData.year} onChange={handleChange}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Password + Confirm */}
            <div className="grid-2">
              <div>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>🔒</span>
                  <input
                    type="password"
                    name="password"
                    className="input-field"
                    style={{ paddingLeft: '2.2rem' }}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}>🛡️</span>
                  <input
                    type="password"
                    name="confirm"
                    className="input-field"
                    style={{ paddingLeft: '2.2rem' }}
                    value={formData.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '1rem',
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
              {loading ? 'Creating Account...' : isAdmin ? '🛡️ Create Admin Account' : '🚀 Create Student Account'}
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
