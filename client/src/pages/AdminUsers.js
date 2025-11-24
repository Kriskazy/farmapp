import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await axios.delete(`${API_URL}/api/admin/users/${userId}`);
        setMessage('User deleted successfully');
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage('Error deleting user');
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      setMessage('User status updated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
      setMessage('Error updating user status');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 font-bold text-xl">Access denied. Admin only.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage farm workers and administrators</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border-l-4 ${
            message.includes('Error')
              ? 'bg-red-50 border-red-500 text-red-700'
              : 'bg-green-50 border-green-500 text-green-700'
          }`}
        >
          {message}
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Phone</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Joined</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((userItem) => (
                <tr key={userItem._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium">{userItem.name}</td>
                  <td className="px-6 py-4 text-slate-600">{userItem.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userItem.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userItem.role === 'admin' ? '👑 Admin' : '👷 Worker'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{userItem.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userItem.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userItem.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(userItem.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={userItem.isActive ? 'warning' : 'success'}
                        onClick={() => handleToggleStatus(userItem._id, userItem.isActive)}
                      >
                        {userItem.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      {userItem._id !== user._id && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            No users found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;
