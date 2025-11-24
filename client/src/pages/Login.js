import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, password } = formData;

  const redirect = location.search ? location.search.split('=')[1] : '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transition-colors duration-200">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400">Enter your details to access your farm.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="name@farm.com"
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end mt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Right Side - Image/Decorative */}
        <div className="hidden md:block w-1/2 bg-primary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Farm landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 h-full flex flex-col justify-center p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Smart Farming for a Better Future</h2>
            <p className="text-primary-100 text-lg leading-relaxed">
              Manage your crops, livestock, and tasks efficiently with our comprehensive farm management system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
