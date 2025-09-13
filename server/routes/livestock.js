const express = require('express');
const Livestock = require('../models/Livestock');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all livestock
// @route   GET /api/livestock
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, status, location } = req.query;
    
    // Build filter object
    let filter = {};
    if (type) filter.type = type;
    if (status) filter.healthStatus = status;
    if (location) filter.location = new RegExp(location, 'i');

    const livestock = await Livestock.find(filter)
      .populate('createdBy', 'name email')
      .populate('parentMale', 'tagNumber name type')
      .populate('parentFemale', 'tagNumber name type')
      .sort({ createdAt: -1 });
    
    res.json(livestock);
  } catch (error) {
    console.error('Error fetching livestock:', error);
    res.status(500).json({ message: 'Server error fetching livestock' });
  }
});

// @desc    Get single livestock
// @route   GET /api/livestock/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('parentMale', 'tagNumber name type breed')
      .populate('parentFemale', 'tagNumber name type breed')
      .populate('breeding.partner', 'tagNumber name type')
      .populate('breeding.offspring', 'tagNumber name type birthDate');
    
    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }
    
    res.json(livestock);
  } catch (error) {
    console.error('Error fetching livestock:', error);
    res.status(500).json({ message: 'Server error fetching livestock' });
  }
});

// @desc    Create new livestock
// @route   POST /api/livestock
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      tagNumber,
      name,
      type,
      breed,
      gender,
      birthDate,
      weight,
      weightUnit,
      healthStatus,
      location,
      parentMale,
      parentFemale,
      notes
    } = req.body;

    // Validation
    if (!tagNumber || !type || !gender) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: tag number, type, and gender' 
      });
    }

    // Check if tag number already exists
    const existingLivestock = await Livestock.findOne({ 
      tagNumber: tagNumber.toUpperCase() 
    });
    if (existingLivestock) {
      return res.status(400).json({ 
        message: 'Tag number already exists' 
      });
    }

    const livestock = await Livestock.create({
      tagNumber: tagNumber.toUpperCase(),
      name,
      type,
      breed,
      gender,
      birthDate,
      weight,
      weightUnit: weightUnit || 'kg',
      healthStatus: healthStatus || 'healthy',
      location,
      parentMale,
      parentFemale,
      notes,
      createdBy: req.user._id
    });

    const populatedLivestock = await Livestock.findById(livestock._id)
      .populate('createdBy', 'name email')
      .populate('parentMale', 'tagNumber name type')
      .populate('parentFemale', 'tagNumber name type');

    res.status(201).json(populatedLivestock);
  } catch (error) {
    console.error('Error creating livestock:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Tag number already exists' });
    } else {
      res.status(500).json({ message: 'Server error creating livestock' });
    }
  }
});

// @desc    Update livestock
// @route   PUT /api/livestock/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id);

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    const {
      tagNumber,
      name,
      type,
      breed,
      gender,
      birthDate,
      weight,
      weightUnit,
      healthStatus,
      location,
      parentMale,
      parentFemale,
      notes,
      isActive
    } = req.body;

    // Check if new tag number conflicts with existing ones
    if (tagNumber && tagNumber.toUpperCase() !== livestock.tagNumber) {
      const existingLivestock = await Livestock.findOne({ 
        tagNumber: tagNumber.toUpperCase(),
        _id: { $ne: livestock._id }
      });
      if (existingLivestock) {
        return res.status(400).json({ 
          message: 'Tag number already exists' 
        });
      }
    }

    // Update fields
    livestock.tagNumber = tagNumber ? tagNumber.toUpperCase() : livestock.tagNumber;
    livestock.name = name !== undefined ? name : livestock.name;
    livestock.type = type || livestock.type;
    livestock.breed = breed !== undefined ? breed : livestock.breed;
    livestock.gender = gender || livestock.gender;
    livestock.birthDate = birthDate !== undefined ? birthDate : livestock.birthDate;
    livestock.weight = weight !== undefined ? weight : livestock.weight;
    livestock.weightUnit = weightUnit || livestock.weightUnit;
    livestock.healthStatus = healthStatus || livestock.healthStatus;
    livestock.location = location !== undefined ? location : livestock.location;
    livestock.parentMale = parentMale !== undefined ? parentMale : livestock.parentMale;
    livestock.parentFemale = parentFemale !== undefined ? parentFemale : livestock.parentFemale;
    livestock.notes = notes !== undefined ? notes : livestock.notes;
    livestock.isActive = isActive !== undefined ? isActive : livestock.isActive;

    await livestock.save();

    const updatedLivestock = await Livestock.findById(livestock._id)
      .populate('createdBy', 'name email')
      .populate('parentMale', 'tagNumber name type')
      .populate('parentFemale', 'tagNumber name type');

    res.json(updatedLivestock);
  } catch (error) {
    console.error('Error updating livestock:', error);
    res.status(500).json({ message: 'Server error updating livestock' });
  }
});

// @desc    Delete livestock
// @route   DELETE /api/livestock/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id);

    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    await Livestock.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Livestock deleted successfully' });
  } catch (error) {
    console.error('Error deleting livestock:', error);
    res.status(500).json({ message: 'Server error deleting livestock' });
  }
});

// @desc    Add vaccination record
// @route   POST /api/livestock/:id/vaccination
// @access  Private
router.post('/:id/vaccination', protect, async (req, res) => {
  try {
    const { vaccine, date, nextDue, notes } = req.body;

    if (!vaccine || !date) {
      return res.status(400).json({ 
        message: 'Please provide vaccine name and date' 
      });
    }

    const livestock = await Livestock.findById(req.params.id);
    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }

    livestock.vaccinations.push({
      vaccine,
      date,
      nextDue,
      notes
    });

    await livestock.save();

    const updatedLivestock = await Livestock.findById(livestock._id)
      .populate('createdBy', 'name email');

    res.json(updatedLivestock);
  } catch (error) {
    console.error('Error adding vaccination:', error);
    res.status(500).json({ message: 'Server error adding vaccination' });
  }
});

// @desc    Get livestock statistics
// @route   GET /api/livestock/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalLivestock = await Livestock.countDocuments({ isActive: true });
    const healthyAnimals = await Livestock.countDocuments({ 
      healthStatus: 'healthy', 
      isActive: true 
    });
    const sickAnimals = await Livestock.countDocuments({ 
      healthStatus: { $in: ['sick', 'injured', 'quarantine'] }, 
      isActive: true 
    });

    // Count by type
    const typeBreakdown = await Livestock.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Count by health status
    const healthBreakdown = await Livestock.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$healthStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalLivestock,
      healthyAnimals,
      sickAnimals,
      typeBreakdown,
      healthBreakdown
    });
  } catch (error) {
    console.error('Error fetching livestock stats:', error);
    res.status(500).json({ message: 'Server error fetching livestock statistics' });
  }
});

module.exports = router;