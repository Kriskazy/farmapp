import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

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
      const response = await axios.get(`${API_URL}/api/dashboard/overview`);
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
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      planted: 'bg-blue-100 text-blue-700',
      growing: 'bg-green-100 text-green-700',
      ready: 'bg-yellow-100 text-yellow-700',
      harvested: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg max-w-md">
          <div className="flex items-center">
            <span className="text-red-500 text-2xl mr-3">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient Background */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isAdmin ? 'Farm Management Dashboard' : 'My Farm Dashboard'}
              </h1>
              <p className="text-green-100 text-lg">
                Welcome back, {dashboardData?.user?.name}! Here's your farm
                overview.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl animate-bounce">
                {isAdmin ? '🎯' : '🚜'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tasks Card */}
          <Link to="/tasks" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-blue-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">📋</div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-medium">Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.taskStats?.total || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {dashboardData?.taskStats?.pending || 0} pending
                </span>
                <span className="text-red-600 font-semibold">
                  {dashboardData?.taskStats?.overdue || 0} overdue
                </span>
              </div>
              <div className="mt-4 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                View all tasks →
              </div>
            </div>
          </Link>

          {/* Crops Card */}
          <Link to="/crops" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-green-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🌱</div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-medium">Crops</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.cropStats?.total || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {dashboardData?.cropStats?.growing || 0} growing
                </span>
                <span className="text-green-600 font-semibold">
                  {dashboardData?.cropStats?.ready || 0} ready
                </span>
              </div>
              <div className="mt-4 text-green-600 text-sm font-medium group-hover:text-green-700">
                View all crops →
              </div>
            </div>
          </Link>

          {/* Livestock Card */}
          <Link to="/livestock" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-yellow-500 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">🐄</div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm font-medium">Livestock</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.livestockStats?.total || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {dashboardData?.livestockStats?.healthy || 0} healthy
                </span>
                <span className="text-orange-600 font-semibold">
                  {dashboardData?.livestockStats?.needAttention || 0} need
                  attention
                </span>
              </div>
              <div className="mt-4 text-yellow-600 text-sm font-medium group-hover:text-yellow-700">
                View livestock →
              </div>
            </div>
          </Link>

          {/* Team Card (Admin Only) */}
          {isAdmin && (
            <Link to="/admin/users" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-purple-500 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">👥</div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm font-medium">Team</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.totalUsers || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {dashboardData?.totalWorkers || 0} workers
                  </span>
                  <span className="text-purple-600 font-semibold">
                    {dashboardData?.activeUsers || 0} active
                  </span>
                </div>
                <div className="mt-4 text-purple-600 text-sm font-medium group-hover:text-purple-700">
                  Manage users →
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">🎯</span>
                  {isAdmin ? 'Upcoming Tasks' : 'My Upcoming Tasks'}
                </h3>
                <Link
                  to="/tasks"
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData?.upcomingTasks?.length > 0 ? (
                  dashboardData.upcomingTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-sm text-gray-600">
                              {formatDate(task.dueDate)}
                            </span>
                            {isAdmin && task.assignedTo?.name && (
                              <span className="text-sm text-gray-500">
                                👤 {task.assignedTo.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-5xl mb-3">📭</div>
                    <p>No upcoming tasks</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Crops */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">🌱</span>
                  Recent Crop Activity
                </h3>
                <Link
                  to="/crops"
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardData?.recentCrops?.length > 0 ? (
                  dashboardData.recentCrops.map((crop) => (
                    <div
                      key={crop._id}
                      className="bg-gradient-to-r from-green-50 to-white p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {crop.name}
                          </h4>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                crop.status
                              )}`}
                            >
                              {crop.status}
                            </span>
                            <span className="text-sm text-gray-600">
                              📍 {crop.field}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Expected harvest:{' '}
                            {new Date(
                              crop.expectedHarvestDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-5xl mb-3">🌾</div>
                    <p>No recent crop activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                {isAdmin && (
                  <>
                    <Link
                      to="/tasks"
                      className="block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg text-center"
                    >
                      <span className="mr-2">📝</span>
                      Create Task
                    </Link>
                    <Link
                      to="/crops"
                      className="block w-full bg-white border-2 border-green-600 text-green-600 py-3 px-4 rounded-xl font-medium hover:bg-green-50 transition-all text-center"
                    >
                      <span className="mr-2">🌱</span>
                      Add Crop
                    </Link>
                  </>
                )}
                <Link
                  to="/livestock"
                  className="block w-full bg-white border-2 border-yellow-600 text-yellow-600 py-3 px-4 rounded-xl font-medium hover:bg-yellow-50 transition-all text-center"
                >
                  <span className="mr-2">🐄</span>
                  {isAdmin ? 'Add Animal' : 'View Animals'}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/users"
                    className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-center"
                  >
                    <span className="mr-2">👥</span>
                    Manage Team
                  </Link>
                )}
              </div>
            </div>

            {/* Livestock Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="mr-2">🐄</span>
                  Livestock
                </h3>
                <Link
                  to="/livestock"
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  See all →
                </Link>
              </div>
              <div className="space-y-2">
                {dashboardData?.livestockByType?.length > 0 ? (
                  dashboardData.livestockByType.map((type) => (
                    <div
                      key={type._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-700 font-medium capitalize">
                        {type._id}
                      </span>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {type.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">🐾</div>
                    <p className="text-sm">No livestock registered</p>
                  </div>
                )}
              </div>
            </div>

            {/* Farm Overview */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Farm Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-green-500">
                  <span className="text-green-100">Total Area</span>
                  <span className="font-bold text-lg">
                    {dashboardData?.cropAreaData?.reduce(
                      (total, area) => total + area.totalArea,
                      0
                    ) || 0}{' '}
                    acres
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-green-500">
                  <span className="text-green-100">Crop Fields</span>
                  <span className="font-bold text-lg">
                    {dashboardData?.cropStats?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-green-500">
                  <span className="text-green-100">Active Animals</span>
                  <span className="font-bold text-lg">
                    {dashboardData?.livestockStats?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-green-100">Tasks This Week</span>
                  <span className="font-bold text-lg">
                    {dashboardData?.weeklyTaskData?.reduce(
                      (total, day) => total + day.count,
                      0
                    ) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
