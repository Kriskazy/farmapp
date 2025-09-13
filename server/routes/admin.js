const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// @desc    Update user status (admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

// @desc    Get dashboard stats (admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // TODO: Add crop, livestock, and task stats when those models are ready
    res.json({
      totalUsers,
      activeUsers,
      totalWorkers,
      totalAdmins,
      totalCrops: 0, // Placeholder
      totalLivestock: 0, // Placeholder
      pendingTasks: 0, // Placeholder
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;