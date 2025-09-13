const express = require('express');
const Task = require('../models/Task');
const Crop = require('../models/Crop');
const Livestock = require('../models/Livestock');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get comprehensive dashboard data
// @route   GET /api/dashboard/overview
// @access  Private
router.get('/overview', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userId = req.user._id;

    // Base filters for non-admin users
    const taskFilter = isAdmin ? {} : { assignedTo: userId };
    const generalFilter = {}; // Crops and livestock visible to all

    // Task Statistics
    const taskStats = {
      total: await Task.countDocuments(taskFilter),
      pending: await Task.countDocuments({ ...taskFilter, status: 'pending' }),
      inProgress: await Task.countDocuments({ ...taskFilter, status: 'in-progress' }),
      completed: await Task.countDocuments({ ...taskFilter, status: 'completed' }),
      overdue: await Task.countDocuments({
        ...taskFilter,
        dueDate: { $lt: new Date() },
        status: { $ne: 'completed' }
      })
    };

    // Crop Statistics
    const cropStats = {
      total: await Crop.countDocuments(generalFilter),
      planted: await Crop.countDocuments({ ...generalFilter, status: 'planted' }),
      growing: await Crop.countDocuments({ ...generalFilter, status: 'growing' }),
      ready: await Crop.countDocuments({ ...generalFilter, status: 'ready' }),
      harvested: await Crop.countDocuments({ ...generalFilter, status: 'harvested' })
    };

    // Calculate total crop area
    const cropAreaData = await Crop.aggregate([
      { $match: generalFilter },
      {
        $group: {
          _id: '$areaUnit',
          totalArea: { $sum: '$area' }
        }
      }
    ]);

    // Livestock Statistics
    const livestockStats = {
      total: await Livestock.countDocuments({ ...generalFilter, isActive: true }),
      healthy: await Livestock.countDocuments({ 
        ...generalFilter, 
        isActive: true, 
        healthStatus: 'healthy' 
      }),
      needAttention: await Livestock.countDocuments({ 
        ...generalFilter, 
        isActive: true, 
        healthStatus: { $in: ['sick', 'injured', 'quarantine'] }
      })
    };

    // Livestock by type
    const livestockByType = await Livestock.aggregate([
      { $match: { ...generalFilter, isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent Tasks (last 5)
    const recentTasks = await Task.find(taskFilter)
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status priority dueDate createdAt assignedTo createdBy');

    // Upcoming Tasks (next 5 due)
    const upcomingTasks = await Task.find({
      ...taskFilter,
      status: { $in: ['pending', 'in-progress'] },
      dueDate: { $gte: new Date() }
    })
      .populate('assignedTo', 'name')
      .sort({ dueDate: 1 })
      .limit(5)
      .select('title status priority dueDate assignedTo');

    // Recent Crops (if admin, show all; if worker, show recent updates)
    const recentCrops = await Crop.find(generalFilter)
      .populate('createdBy', 'name')
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('name status field plantedDate expectedHarvestDate createdBy updatedAt');

    // Admin-only statistics
    let adminStats = {};
    if (isAdmin) {
      adminStats = {
        totalUsers: await User.countDocuments(),
        activeUsers: await User.countDocuments({ isActive: true }),
        totalWorkers: await User.countDocuments({ role: 'worker', isActive: true })
      };
    }

    // Weekly task completion trend (last 7 days)
    const weeklyTaskData = await Task.aggregate([
      {
        $match: {
          ...taskFilter,
          completedAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$completedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      user: {
        name: req.user.name,
        role: req.user.role
      },
      taskStats,
      cropStats,
      cropAreaData,
      livestockStats,
      livestockByType,
      recentTasks,
      upcomingTasks,
      recentCrops,
      weeklyTaskData,
      ...adminStats
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @desc    Get quick stats for header/navbar
// @route   GET /api/dashboard/quick-stats
// @access  Private
router.get('/quick-stats', protect, async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const taskFilter = isAdmin ? {} : { assignedTo: req.user._id };

    const quickStats = {
      pendingTasks: await Task.countDocuments({ ...taskFilter, status: 'pending' }),
      overdueTasks: await Task.countDocuments({
        ...taskFilter,
        dueDate: { $lt: new Date() },
        status: { $ne: 'completed' }
      }),
      totalCrops: await Crop.countDocuments(),
      totalLivestock: await Livestock.countDocuments({ isActive: true })
    };

    res.json(quickStats);
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ message: 'Server error fetching quick stats' });
  }
});

module.exports = router;