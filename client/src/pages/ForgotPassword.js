import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';
import { API_URL } from '../config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });

      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Error sending reset email';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email address to receive a password reset link</p>
        </div>

        {message && (
          <div className="success-message">
            <strong>Email Sent!</strong>
            <p>{message}</p>
            <p>Please check your email and click the reset link to continue.</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Remember your password? Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
