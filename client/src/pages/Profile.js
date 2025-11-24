import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Profile = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/api/auth/profile`,
        profileData
      );

      // Update local user data
      login(response.data.user, localStorage.getItem('farmToken'));
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.put(`${API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-full w-32 h-32 flex items-center justify-center shadow-inner border-4 border-white/20">
            <span className="text-6xl">👤</span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                {user?.role === 'admin' ? '👑 Administrator' : '👷 Farm Worker'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${user?.isActive ? 'bg-green-400/30 text-green-50' : 'bg-red-400/30 text-red-50'}`}>
                {user?.isActive ? '✓ Active Account' : '⊗ Inactive'}
              </span>
            </div>
            <p className="text-primary-100">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Message Alerts */}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <p className="text-green-700 font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Tabs & Content */}
      <Card className="p-0 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-6 py-4 font-medium transition-all text-sm uppercase tracking-wide ${
              activeTab === 'info'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span className="mr-2">📋</span> Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 px-6 py-4 font-medium transition-all text-sm uppercase tracking-wide ${
              activeTab === 'password'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span className="mr-2">🔒</span> Security
          </button>
        </div>

        <div className="p-8">
          {/* Profile Information Tab */}
          {activeTab === 'info' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Update Profile Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Role</label>
                    <p className="text-slate-900 font-medium">
                      {user?.role === 'admin' ? 'Administrator' : 'Farm Worker'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Member Since</label>
                    <p className="text-slate-900 font-medium">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" loading={loading} className="w-full md:w-auto md:px-12">
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Change Password</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-lg">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />

                <div className="space-y-4">
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min 6 characters"
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
                  <span className="text-xl">ℹ️</span>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Password must be at least 6 characters long</li>
                    <li>New password must match confirmation</li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button type="submit" loading={loading} className="w-full">
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
