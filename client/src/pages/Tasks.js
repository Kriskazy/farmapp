import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Pages.css';

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
    overdue: false
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
    workerNotes: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
    if (user?.role === 'admin') {
      fetchWorkers();
    }
  }, [filters, user]);

  const fetchTasks = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.assignedTo) queryParams.append('assignedTo', filters.assignedTo);
      if (filters.overdue) queryParams.append('overdue', 'true');
      
      const response = await axios.get(
        `http://localhost:5000/api/tasks?${queryParams.toString()}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setMessage('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/workers');
      console.log('Workers loaded:', response.data);
      setWorkers(response.data);
    
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    console.log('Form data being sent:', formData);

    try {
      if (editingTask) {
        // Update existing task
        await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, formData);
        setMessage('Task updated successfully');
      } else {
        // Create new task (admin only)
        await axios.post('http://localhost:5000/api/tasks', formData);

        setMessage('Task created successfully');
      }
      
      // Reset form and refresh data
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
      assignedTo: task.assignedTo._id,
      dueDate: task.dueDate.split('T')[0],
      estimatedHours: task.estimatedHours || '',
      actualHours: task.actualHours || '',
      location: task.location || '',
      notes: task.notes || '',
      workerNotes: task.workerNotes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
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
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus
      });
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
      workerNotes: ''
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: 'priority-low',
      medium: 'priority-medium',
      high: 'priority-high',
      urgent: 'priority-urgent'
    };
    
    return <span className={`priority-badge ${priorityColors[priority]}`}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'status-pending',
      'in-progress': 'status-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return <span className={`status-badge ${statusColors[status]}`}>{status}</span>;
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
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="tasks-header">
        <h1>📋 Task Management</h1>
        {user?.role === 'admin' && (
          <button 
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Create New Task'}
          </button>
        )}
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      {/* Task Statistics */}
      {stats && (
        <div className="task-stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="stat-number">{stats.totalTasks}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-number">{stats.pendingTasks}</div>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <div className="stat-number">{stats.inProgressTasks}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="stat-number">{stats.completedTasks}</div>
          </div>
          {stats.overdueTasks > 0 && (
            <div className="stat-card overdue">
              <h3>Overdue</h3>
              <div className="stat-number">{stats.overdueTasks}</div>
            </div>
          )}
        </div>
      )}

      {/* Task Filters */}
      <div className="task-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Priority:</label>
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Category:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="crop">Crop</option>
            <option value="livestock">Livestock</option>
            <option value="equipment">Equipment</option>
            <option value="maintenance">Maintenance</option>
            <option value="harvest">Harvest</option>
            <option value="planting">Planting</option>
            <option value="feeding">Feeding</option>
            <option value="other">Other</option>
          </select>
        </div>
        {user?.role === 'admin' && (
          <div className="filter-group">
            <label>Assigned To:</label>
            <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
              <option value="">All Workers</option>
              {workers.map(worker => (
                <option key={worker._id} value={worker._id}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="filter-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="overdue"
              checked={filters.overdue}
              onChange={handleFilterChange}
            />
            Show Overdue Only
          </label>
        </div>
      </div>

 {/* Create/Edit Task Form */}
{showForm && user?.role === 'admin' && (
  <div className="task-form-container">
    <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-row">
        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Water the tomato field"
            required
          />
        </div>
        <div className="form-group">
          <label>Assign To *</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Worker</option>
            {workers.map(worker => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Detailed description of the task..."
          rows="3"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
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
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date *</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Estimated Hours</label>
          <input
            type="number"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleInputChange}
            placeholder="0.0"
            step="0.5"
            min="0.1"
            max="24"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="e.g., North Field, Barn 2"
        />
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Any additional instructions or notes..."
          rows="2"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
        <button type="button" onClick={resetForm} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="content-placeholder">
            <p>
              {user?.role === 'admin' 
                ? 'No tasks created yet. Click "Create New Task" to get started!' 
                : 'No tasks assigned to you yet.'}
            </p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.isOverdue ? 'overdue' : ''}`}>
                <div className="task-header">
                  <div className="task-title-section">
                    <span className="task-icon">{getCategoryIcon(task.category)}</span>
                    <h3>{task.title}</h3>
                  </div>
                  <div className="task-badges">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </div>

                <div className="task-description">
                  <p>{task.description}</p>
                </div>

                <div className="task-details">
                  <p><strong>Due:</strong> <span className={task.isOverdue ? 'overdue-text' : ''}>{formatDate(task.dueDate)}</span></p>
                  {user?.role === 'admin' && (
                    <p><strong>Assigned to:</strong> {task.assignedTo.name}</p>
                  )}
                  <p><strong>Category:</strong> {task.category}</p>
                  {task.location && <p><strong>Location:</strong> {task.location}</p>}
                  {task.estimatedHours && (
                    <p><strong>Est. Hours:</strong> {task.estimatedHours}h</p>
                  )}
                  {task.actualHours && (
                    <p><strong>Actual Hours:</strong> {task.actualHours}h</p>
                  )}
                </div>

                {task.notes && (
                  <div className="task-notes">
                    <p><strong>Notes:</strong> {task.notes}</p>
                  </div>
                )}

                {task.workerNotes && (
                  <div className="task-worker-notes">
                    <p><strong>Worker Notes:</strong> {task.workerNotes}</p>
                  </div>
                )}

                <div className="task-meta">
                  <p>Created by: {task.createdBy.name}</p>
                  <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                  {task.completedAt && (
                    <p>Completed: {new Date(task.completedAt).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="task-actions">
                  {/* Status update buttons for workers */}
                  {task.assignedTo._id === user._id && task.status !== 'completed' && (
                    <div className="status-buttons">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, 'in-progress')}
                          className="btn-small btn-primary"
                        >
                          Start Task
                        </button>
                      )}
                      {task.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(task._id, 'completed')}
                          className="btn-small btn-success"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  )}

                  {/* Admin actions */}
                  {user?.role === 'admin' && (
                    <div className="admin-actions">
                      <button 
                        onClick={() => handleEdit(task)}
                        className="btn-small btn-secondary"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(task._id, task.title)}
                        className="btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Worker edit for status/notes */}
                  {task.assignedTo._id === user._id && (
                    <button 
                      onClick={() => handleEdit(task)}
                      className="btn-small btn-secondary"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;