import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedTo: '',
    overdue: false,
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
    location: '',
    notes: '',
    workerNotes: '',
  });

  const fetchTasks = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.assignedTo)
        queryParams.append('assignedTo', filters.assignedTo);
      if (filters.overdue) queryParams.append('overdue', 'true');

      const response = await axios.get(
        `${API_URL}/api/tasks?${queryParams.toString()}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/stats/overview`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  }, []);

  const fetchWorkers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/workers`);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
    if (user?.role === 'admin') {
      fetchWorkers();
    }
  }, [fetchTasks, fetchStats, fetchWorkers, user?.role]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingTask) {
        await axios.put(`${API_URL}/api/tasks/${editingTask._id}`, formData);
        setMessage('Task updated successfully');
      } else {
        await axios.post(`${API_URL}/api/tasks`, formData);
        setMessage('Task created successfully');
      }

      resetForm();
      fetchTasks();
      fetchStats();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error saving task';
      setMessage(errorMsg);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo?._id || '',
      dueDate: task.dueDate.split('T')[0],
      estimatedHours: task.estimatedHours || '',
      actualHours: task.actualHours || '',
      location: task.location || '',
      notes: task.notes || '',
      workerNotes: task.workerNotes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/tasks/${taskId}`);
        setMessage('Task deleted successfully');
        fetchTasks();
        fetchStats();
      } catch (error) {
        setMessage('Error deleting task');
      }
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${taskId}`, { status: newStatus });
      setMessage(`Task status updated to ${newStatus}`);
      fetchTasks();
      fetchStats();
    } catch (error) {
      setMessage('Error updating task status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
      dueDate: '',
      estimatedHours: '',
      actualHours: '',
      location: '',
      notes: '',
      workerNotes: '',
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      urgent: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
    };
    return colors[priority] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-slate-100 text-slate-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      crop: '🌱',
      livestock: '🐄',
      equipment: '🚜',
      maintenance: '🔧',
      harvest: '🌾',
      planting: '🌿',
      feeding: '🥕',
      other: '📋',
    };
    return icons[category] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-500 mt-1">
            {user?.role === 'admin'
              ? 'Manage and assign tasks to your team'
              : 'View and update your assigned tasks'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'secondary' : 'primary'}
          >
            {showForm ? 'Cancel' : '+ Create Task'}
          </Button>
        )}
      </div>

      {/* Message */}
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

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <p className="text-slate-500 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalTasks}</p>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <p className="text-slate-500 text-sm font-medium">Pending</p>
            <p className="text-3xl font-bold text-slate-900">{stats.pendingTasks}</p>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <p className="text-slate-500 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-slate-900">{stats.completedTasks}</p>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <p className="text-slate-500 text-sm font-medium">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{stats.overdueTasks}</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-slate-50"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-slate-50"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-slate-50"
          >
            <option value="">All Categories</option>
            <option value="crop">🌱 Crop</option>
            <option value="livestock">🐄 Livestock</option>
            <option value="equipment">🚜 Equipment</option>
            <option value="maintenance">🔧 Maintenance</option>
            <option value="harvest">🌾 Harvest</option>
            <option value="planting">🌿 Planting</option>
            <option value="feeding">🥕 Feeding</option>
            <option value="other">📋 Other</option>
          </select>

          {user?.role === 'admin' && (
            <select
              name="assignedTo"
              value={filters.assignedTo}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-slate-50"
            >
              <option value="">All Workers</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name}
                </option>
              ))}
            </select>
          )}

          <label className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              name="overdue"
              checked={filters.overdue}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              Overdue Only
            </span>
          </label>
        </div>
      </Card>

      {/* Create/Edit Form */}
      {showForm && user?.role === 'admin' && (
        <Card className="border-2 border-primary-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {editingTask ? '✏️ Edit Task' : '➕ Create New Task'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Water the tomato field"
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assign To *
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select Worker</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the task..."
                rows="3"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="other">Other</option>
                  <option value="crop">Crop</option>
                  <option value="livestock">Livestock</option>
                  <option value="equipment">Equipment</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="harvest">Harvest</option>
                  <option value="planting">Planting</option>
                  <option value="feeding">Feeding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Estimated Hours"
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleInputChange}
                placeholder="0.0"
                step="0.5"
              />
            </div>

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., North Field, Barn 2"
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional instructions or notes..."
                rows="2"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tasks Grid */}
      {tasks.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-slate-500 text-lg">
            {user?.role === 'admin'
              ? 'No tasks created yet. Click "Create Task" to get started!'
              : 'No tasks assigned to you yet.'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card 
              key={task._id} 
              className={`hover:shadow-xl transition-all duration-300 ${task.isOverdue ? 'ring-2 ring-red-100' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-slate-50 p-2 rounded-lg">
                    {getCategoryIcon(task.category)}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 mb-4 line-clamp-2 text-sm">
                {task.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                <p className={`flex items-center gap-2 ${task.isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                  <span>📅</span> {formatDate(task.dueDate)}
                </p>
                {user?.role === 'admin' && (
                  <p className="flex items-center gap-2">
                    <span>👤</span> {task.assignedTo?.name || 'Unassigned'}
                  </p>
                )}
                {task.location && (
                  <p className="flex items-center gap-2">
                    <span>📍</span> {task.location}
                  </p>
                )}
              </div>

              {task.notes && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4 text-xs text-blue-800">
                  <p className="font-semibold mb-1">Notes:</p>
                  <p>{task.notes}</p>
                </div>
              )}

              <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100">
                {task.assignedTo?._id === user._id && task.status !== 'completed' && (
                  <>
                    {task.status === 'pending' && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant="success"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(task._id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                  </>
                )}

                {user?.role === 'admin' && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex-1"
                      onClick={() => handleDelete(task._id, task.title)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
