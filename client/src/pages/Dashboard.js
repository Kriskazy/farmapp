import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/overview');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTaskPriorityColor = (priority) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      urgent: '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#6c757d',
      'in-progress': '#007bff',
      completed: '#28a745',
      planted: '#007bff',
      growing: '#28a745',
      ready: '#ffc107',
      harvested: '#28a745',
      healthy: '#28a745',
      sick: '#dc3545',
      injured: '#fd7e14'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="page-container dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>{isAdmin ? '🎯 Farm Management Dashboard' : '🚜 My Farm Dashboard'}</h1>
        <p>Welcome back, {dashboardData?.user?.name}! Here's your farm overview.</p>
      </div>

      {/* Quick Stats Overview */}
      <div className="dashboard-stats-grid">
        <div className="stat-card tasks">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Tasks</h3>
            <div className="stat-number">{dashboardData?.taskStats?.total || 0}</div>
            <div className="stat-detail">
              {dashboardData?.taskStats?.pending || 0} pending • {dashboardData?.taskStats?.overdue || 0} overdue
            </div>
          </div>
          <Link to="/tasks" className="stat-link">View Tasks</Link>
        </div>

        <div className="stat-card crops">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <h3>Crops</h3>
            <div className="stat-number">{dashboardData?.cropStats?.total || 0}</div>
            <div className="stat-detail">
              {dashboardData?.cropStats?.growing || 0} growing • {dashboardData?.cropStats?.ready || 0} ready
            </div>
          </div>
          <Link to="/crops" className="stat-link">View Crops</Link>
        </div>

        <div className="stat-card livestock">
          <div className="stat-icon">🐄</div>
          <div className="stat-content">
            <h3>Livestock</h3>
            <div className="stat-number">{dashboardData?.livestockStats?.total || 0}</div>
            <div className="stat-detail">
              {dashboardData?.livestockStats?.healthy || 0} healthy • {dashboardData?.livestockStats?.needAttention || 0} need attention
            </div>
          </div>
          <Link to="/livestock" className="stat-link">View Livestock</Link>
        </div>

        {isAdmin && (
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Team</h3>
              <div className="stat-number">{dashboardData?.totalUsers || 0}</div>
              <div className="stat-detail">
                {dashboardData?.totalWorkers || 0} workers • {dashboardData?.activeUsers || 0} active
              </div>
            </div>
            <Link to="/admin/users" className="stat-link">Manage Users</Link>
          </div>
        )}
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Upcoming Tasks */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>🎯 {isAdmin ? 'Upcoming Tasks' : 'My Upcoming Tasks'}</h3>
              <Link to="/tasks" className="see-all-link">See all</Link>
            </div>
            <div className="dashboard-list">
              {dashboardData?.upcomingTasks?.length > 0 ? (
                dashboardData.upcomingTasks.map(task => (
                  <div key={task._id} className="dashboard-item">
                    <div className="item-content">
                      <div className="item-title">{task.title}</div>
                      <div className="item-meta">
                        <span 
                          className="item-status"
                          style={{ backgroundColor: getTaskPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </span>
                        <span className="item-date">{formatDate(task.dueDate)}</span>
                      </div>
                      {isAdmin && (
                        <div className="item-assignee">Assigned to: {task.assignedTo?.name}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No upcoming tasks</div>
              )}
            </div>
          </div>

          {/* Recent Crops */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>🌱 Recent Crop Activity</h3>
              <Link to="/crops" className="see-all-link">See all</Link>
            </div>
            <div className="dashboard-list">
              {dashboardData?.recentCrops?.length > 0 ? (
                dashboardData.recentCrops.map(crop => (
                  <div key={crop._id} className="dashboard-item">
                    <div className="item-content">
                      <div className="item-title">{crop.name}</div>
                      <div className="item-meta">
                        <span 
                          className="item-status"
                          style={{ backgroundColor: getStatusColor(crop.status) }}
                        >
                          {crop.status}
                        </span>
                        <span className="item-location">{crop.field}</span>
                      </div>
                      <div className="item-dates">
                        Expected harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recent crop activity</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>⚡ Quick Actions</h3>
            </div>
            <div className="quick-actions">
              {isAdmin && (
                <>
                  <Link to="/tasks" className="quick-action-btn primary">
                    <span className="action-icon">📝</span>
                    Create Task
                  </Link>
                  <Link to="/crops" className="quick-action-btn secondary">
                    <span className="action-icon">🌱</span>
                    Add Crop
                  </Link>
                </>
              )}
              <Link to="/livestock" className="quick-action-btn secondary">
                <span className="action-icon">🐄</span>
                {isAdmin ? 'Add Animal' : 'View Animals'}
              </Link>
              {isAdmin && (
                <Link to="/admin/users" className="quick-action-btn tertiary">
                  <span className="action-icon">👥</span>
                  Manage Team
                </Link>
              )}
            </div>
          </div>

          {/* Livestock Summary */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>🐄 Livestock Overview</h3>
              <Link to="/livestock" className="see-all-link">See all</Link>
            </div>
            <div className="livestock-summary">
              {dashboardData?.livestockByType?.length > 0 ? (
                dashboardData.livestockByType.map(type => (
                  <div key={type._id} className="livestock-type">
                    <div className="type-info">
                      <span className="type-name">{type._id}</span>
                      <span className="type-count">{type.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No livestock registered</div>
              )}
            </div>
          </div>

          {/* Farm Overview */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>📊 Farm Overview</h3>
            </div>
            <div className="farm-overview">
              <div className="overview-item">
                <span className="overview-label">Total Area</span>
                <span className="overview-value">
                  {dashboardData?.cropAreaData?.reduce((total, area) => total + area.totalArea, 0) || 0} acres
                </span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Crop Fields</span>
                <span className="overview-value">{dashboardData?.cropStats?.total || 0}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Active Animals</span>
                <span className="overview-value">{dashboardData?.livestockStats?.total || 0}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Tasks This Week</span>
                <span className="overview-value">
                  {dashboardData?.weeklyTaskData?.reduce((total, day) => total + day.count, 0) || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;