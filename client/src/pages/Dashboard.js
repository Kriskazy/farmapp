import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import Card from '../components/common/Card';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-slate-100 text-slate-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      planted: 'bg-blue-100 text-blue-700',
      growing: 'bg-green-100 text-green-700',
      ready: 'bg-yellow-100 text-yellow-700',
      harvested: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
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
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-secondary-500 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isAdmin ? 'Farm Overview' : 'My Dashboard'}
          </h1>
          <p className="text-primary-100 text-lg">
            Welcome back, {dashboardData?.user?.name}! Here's what's happening on your farm today.
          </p>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="mb-8 h-96">
        <WeatherWidget />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Weekly Task Completion
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData?.weeklyTaskData || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="_id" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
            Crop Status Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Planted', value: dashboardData?.cropStats?.planted || 0 },
                    { name: 'Growing', value: dashboardData?.cropStats?.growing || 0 },
                    { name: 'Ready', value: dashboardData?.cropStats?.ready || 0 },
                    { name: 'Harvested', value: dashboardData?.cropStats?.harvested || 0 },
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#64748b" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/tasks">
          <Card hover className="h-full border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 text-2xl">📋</div>
              <div className="text-right">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Tasks</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{dashboardData?.taskStats?.total || 0}</h3>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{dashboardData?.taskStats?.pending || 0} pending</span>
              <span className="text-red-500 font-medium">{dashboardData?.taskStats?.overdue || 0} overdue</span>
            </div>
          </Card>
        </Link>

        <Link to="/crops">
          <Card hover className="h-full border-l-4 border-l-green-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400 text-2xl">🌱</div>
              <div className="text-right">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Crops</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{dashboardData?.cropStats?.total || 0}</h3>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{dashboardData?.cropStats?.growing || 0} growing</span>
              <span className="text-green-600 font-medium">{dashboardData?.cropStats?.ready || 0} ready</span>
            </div>
          </Card>
        </Link>

        <Link to="/livestock">
          <Card hover className="h-full border-l-4 border-l-amber-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 text-2xl">🐄</div>
              <div className="text-right">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Livestock</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{dashboardData?.livestockStats?.total || 0}</h3>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">{dashboardData?.livestockStats?.healthy || 0} healthy</span>
              <span className="text-amber-600 font-medium">{dashboardData?.livestockStats?.needAttention || 0} check</span>
            </div>
          </Card>
        </Link>

        {isAdmin && (
          <Link to="/admin/users">
            <Card hover className="h-full border-l-4 border-l-purple-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 text-2xl">👥</div>
                <div className="text-right">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Team Members</p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{dashboardData?.totalUsers || 0}</h3>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">{dashboardData?.totalWorkers || 0} workers</span>
                <span className="text-purple-600 font-medium">{dashboardData?.activeUsers || 0} active</span>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🎯</span> Upcoming Tasks
              </h3>
              <Link to="/tasks" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.upcomingTasks?.length > 0 ? (
                dashboardData.upcomingTasks.map((task) => (
                  <div key={task._id} className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-500/30 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{task.title}</h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTaskPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            📅 {formatDate(task.dueDate)}
                          </span>
                        </div>
                      </div>
                      {isAdmin && task.assignedTo?.name && (
                        <div className="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                          👤 {task.assignedTo.name}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-4xl mb-2">✨</div>
                  <p>No upcoming tasks. You're all caught up!</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🌾</span> Recent Crop Activity
              </h3>
              <Link to="/crops" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {dashboardData?.recentCrops?.length > 0 ? (
                dashboardData.recentCrops.map((crop) => (
                  <div key={crop._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{crop.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">📍 {crop.field}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${getStatusColor(crop.status)}`}>
                        {crop.status}
                      </span>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p>No recent crop activity recorded.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Quick Actions
            </h3>
            <div className="space-y-3">
              {isAdmin && (
                <>
                  <Link to="/tasks" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <span className="text-xl">📝</span>
                    <span className="font-medium">Create New Task</span>
                  </Link>
                  <Link to="/crops" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <span className="text-xl">🌱</span>
                    <span className="font-medium">Add New Crop</span>
                  </Link>
                </>
              )}
              <Link to="/livestock" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                <span className="text-xl">🐄</span>
                <span className="font-medium">{isAdmin ? 'Add Animal' : 'View Animals'}</span>
              </Link>
            </div>
          </Card>

          {/* Farm Summary */}
          <Card>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Farm Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                <span className="font-medium">Total Area</span>
                <span className="font-bold text-lg">
                  {dashboardData?.cropAreaData?.reduce((acc, curr) => acc + curr.totalArea, 0) || 0} ac
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                <span className="font-medium">Active Fields</span>
                <span className="font-bold text-lg">{dashboardData?.cropStats?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400">
                <span className="font-medium">Livestock</span>
                <span className="font-bold text-lg">{dashboardData?.livestockStats?.total || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
