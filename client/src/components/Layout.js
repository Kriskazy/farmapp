import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/crops', label: 'Crops', icon: '🌱' },
    { path: '/livestock', label: 'Livestock', icon: '🐄' },
    { path: '/disease-detection', label: 'AI Diagnosis', icon: '📸' },
    { path: '/tasks', label: 'Tasks', icon: '📝' },
    { path: '/finance', label: 'Finance', icon: '💰' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/map', label: 'Field Map', icon: '🗺️' },
    { path: '/help', label: 'Help', icon: '❓' },
  ];


  if (user?.role === 'admin') {
    navItems.push({ path: '/admin/users', label: 'Users', icon: '👥' });
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            F
          </div>
          <span className="font-bold text-slate-800 dark:text-white">FarmApp</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full px-4 py-6 flex flex-col glass-panel m-0 md:m-4 md:rounded-2xl border-r md:border border-white/40 dark:bg-slate-900/95 dark:md:bg-slate-900/50 dark:border-slate-700/50">
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
              F
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
              FarmApp
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto min-h-0 custom-scrollbar">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-2 text-sm font-medium"
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800 transition-colors mb-2"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-80 p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
