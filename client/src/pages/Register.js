import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, phone } = formData;

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await register(name, email, password, phone);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join us to manage your farm efficiently.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="name@farm.com"
              required
            />

            <Input
              label="Phone Number"
              type="text"
              name="phone"
              value={phone}
              onChange={onChange}
              placeholder="+1 234 567 8900"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Left Side - Image/Decorative */}
        <div className="hidden md:block w-1/2 bg-secondary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 to-secondary-900 opacity-90 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Wheat field"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-center p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Grow Your Business</h2>
            <p className="text-secondary-100 text-lg leading-relaxed">
              Track your harvest, monitor livestock health, and optimize your farm's productivity with data-driven insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
