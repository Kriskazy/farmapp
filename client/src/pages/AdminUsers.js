import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Pages.css';

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
      const response = await axios.get('http://localhost:5000/api/admin/users');
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
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`);
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
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, {
        isActive: !currentStatus
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
      <div className="page-container">
        <div className="error-message">Access denied. Admin only.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>👥 User Management</h1>
        <p>Manage farm workers and administrators</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem._id}>
                <td>{userItem.name}</td>
                <td>{userItem.email}</td>
                <td>
                  <span className={`role-badge ${userItem.role}`}>
                    {userItem.role}
                  </span>
                </td>
                <td>{userItem.phone || 'Not provided'}</td>
                <td>
                  <span className={`status-badge ${userItem.isActive ? 'active' : 'inactive'}`}>
                    {userItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleToggleStatus(userItem._id, userItem.isActive)}
                      className={`btn-small ${userItem.isActive ? 'btn-warning' : 'btn-success'}`}
                    >
                      {userItem.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    {userItem._id !== user._id && (
                      <button
                        onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                        className="btn-small btn-danger"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="content-placeholder">
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;