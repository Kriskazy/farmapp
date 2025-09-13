import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <h2>Register as Farm Worker</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input 
              type="text" 
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone (optional):</label>
            <input 
              type="tel" 
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account? 
          <Link to="/login" className="auth-link"> Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;