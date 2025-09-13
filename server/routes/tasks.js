const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all tasks (with filtering)
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, category, assignedTo, overdue } = req.query;
    
    // Build filter object
    let filter = {};
    
    // If user is not admin, only show their assigned tasks
    if (req.user.role !== 'admin') {
      filter.assignedTo = req.user._id;
    } else if (assignedTo) {
      filter.assignedTo = assignedTo;
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    
    // Handle overdue filter
    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $ne: 'completed' };
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('relatedCrop', 'name field')
      .populate('relatedLivestock', 'tagNumber name type')
      .sort({ dueDate: 1, priority: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// @desc    Get workers for task assignment (Admin only)
// @route   GET /api/tasks/workers
// @access  Private/Admin
router.get('/workers', protect, adminOnly, async (req, res) => {
  try {
    const workers = await User.find({ 
      role: 'worker', 
      isActive: true 
    }).select('_id name email');
    
    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ message: 'Server error fetching workers' });
  }
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    let filter = {};
    
    // If user is not admin, only show their stats
    if (req.user.role !== 'admin') {
      filter.assignedTo = req.user._id;
    }

    const totalTasks = await Task.countDocuments(filter);
    const pendingTasks = await Task.countDocuments({ ...filter, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ ...filter, status: 'in-progress' });
    const completedTasks = await Task.countDocuments({ ...filter, status: 'completed' });
    
    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    // Task breakdown by category
    const categoryBreakdown = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Task breakdown by priority
    const priorityBreakdown = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      categoryBreakdown,
      priorityBreakdown
    });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Server error fetching task statistics' });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email phone')
      .populate('createdBy', 'name email')
      .populate('relatedCrop', 'name field area')
      .populate('relatedLivestock', 'tagNumber name type breed');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user can access this task
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error fetching task' });
  }
});

// @desc    Create new task (Admin only)
// @route   POST /api/tasks
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      assignedTo,
      dueDate,
      estimatedHours,
      location,
      relatedCrop,
      relatedLivestock,
      notes
    } = req.body;

    // Validation
    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: title, description, assigned user, and due date' 
      });
    }

    // Check if assigned user exists and is active
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !assignedUser.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive user assignment' });
    }

    // Check if due date is in the future
    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({ message: 'Due date must be in the future' });
    }

    const task = await Task.create({
      title,
      description,
      category: category || 'other',
      priority: priority || 'medium',
      assignedTo,
      dueDate,
      estimatedHours,
      location,
      relatedCrop,
      relatedLivestock,
      notes,
      createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('relatedCrop', 'name field')
      .populate('relatedLivestock', 'tagNumber name type');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    const canEdit = req.user.role === 'admin' || 
                   task.assignedTo.toString() === req.user._id.toString();
    
    if (!canEdit) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const {
      title,
      description,
      category,
      priority,
      status,
      assignedTo,
      dueDate,
      estimatedHours,
      actualHours,
      location,
      relatedCrop,
      relatedLivestock,
      notes,
      workerNotes
    } = req.body;

    // Admin can update everything, workers can only update status, actualHours, and workerNotes
    if (req.user.role === 'admin') {
      task.title = title || task.title;
      task.description = description || task.description;
      task.category = category || task.category;
      task.priority = priority || task.priority;
      task.assignedTo = assignedTo || task.assignedTo;
      task.dueDate = dueDate || task.dueDate;
      task.estimatedHours = estimatedHours !== undefined ? estimatedHours : task.estimatedHours;
      task.location = location !== undefined ? location : task.location;
      task.relatedCrop = relatedCrop !== undefined ? relatedCrop : task.relatedCrop;
      task.relatedLivestock = relatedLivestock !== undefined ? relatedLivestock : task.relatedLivestock;
      task.notes = notes !== undefined ? notes : task.notes;
    }
    
    // Both admin and worker can update these
    task.status = status || task.status;
    task.actualHours = actualHours !== undefined ? actualHours : task.actualHours;
    task.workerNotes = workerNotes !== undefined ? workerNotes : task.workerNotes;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('relatedCrop', 'name field')
      .populate('relatedLivestock', 'tagNumber name type');

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// @desc    Delete task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;