import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Register = () => {
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
      await api.post('/api/auth/register', formData);
      toast.success('Account created successfully! You can now log in.', { id: toastId });
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in" style={{ maxWidth: '550px' }}>
        <div className="auth-header">
          <div className="auth-icon">🎉</div>
          <h1>Create Account</h1>
          <p>Join Smart Canteen and start ordering</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="grid-2">
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
                    placeholder="Omkar Sharma"
                    required
                  />
                </div>
              </div>

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
                    required
                  />
                </div>
              </div>
            </div>

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
                    placeholder="you@college.edu"
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

            <div className="grid-2">
              <div>
                <label className="form-label">Department</label>
                <select 
                  name="department" 
                  className="input-field" 
                  value={formData.department} 
                  onChange={handleChange}
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Year / Semester</label>
                <select 
                  name="year" 
                  className="input-field" 
                  value={formData.year} 
                  onChange={handleChange}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

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
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
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
