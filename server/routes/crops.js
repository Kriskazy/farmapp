const express = require('express');
const Crop = require('../models/Crop');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all crops
// @route   GET /api/crops
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const crops = await Crop.find({})
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ message: 'Server error fetching crops' });
  }
});

// @desc    Get single crop
// @route   GET /api/crops/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    
    res.json(crop);
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({ message: 'Server error fetching crop' });
  }
});

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      variety,
      field,
      plantedDate,
      expectedHarvestDate,
      area,
      areaUnit,
      notes
    } = req.body;

    // Validation
    if (!name || !field || !plantedDate || !expectedHarvestDate || !area) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, field, planted date, expected harvest date, and area' 
      });
    }

    if (area < 0.1) {
      return res.status(400).json({ message: 'Area must be at least 0.1' });
    }

    // Check if harvest date is after planted date
    if (new Date(expectedHarvestDate) <= new Date(plantedDate)) {
      return res.status(400).json({ 
        message: 'Expected harvest date must be after planted date' 
      });
    }

    const crop = await Crop.create({
      name,
      variety,
      field,
      plantedDate,
      expectedHarvestDate,
      area,
      areaUnit: areaUnit || 'acres',
      notes,
      createdBy: req.user._id
    });

    const populatedCrop = await Crop.findById(crop._id)
      .populate('createdBy', 'name email');

    res.status(201).json(populatedCrop);
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({ message: 'Server error creating crop' });
  }
});

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    const {
      name,
      variety,
      field,
      plantedDate,
      expectedHarvestDate,
      actualHarvestDate,
      area,
      areaUnit,
      status,
      notes
    } = req.body;

    // Validation
    if (area && area < 0.1) {
      return res.status(400).json({ message: 'Area must be at least 0.1' });
    }

    // Check date logic
    if (plantedDate && expectedHarvestDate && 
        new Date(expectedHarvestDate) <= new Date(plantedDate)) {
      return res.status(400).json({ 
        message: 'Expected harvest date must be after planted date' 
      });
    }

    // Update fields
    crop.name = name || crop.name;
    crop.variety = variety || crop.variety;
    crop.field = field || crop.field;
    crop.plantedDate = plantedDate || crop.plantedDate;
    crop.expectedHarvestDate = expectedHarvestDate || crop.expectedHarvestDate;
    crop.actualHarvestDate = actualHarvestDate || crop.actualHarvestDate;
    crop.area = area || crop.area;
    crop.areaUnit = areaUnit || crop.areaUnit;
    crop.status = status || crop.status;
    crop.notes = notes !== undefined ? notes : crop.notes;

    await crop.save();

    const updatedCrop = await Crop.findById(crop._id)
      .populate('createdBy', 'name email');

    res.json(updatedCrop);
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({ message: 'Server error updating crop' });
  }
});

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    await Crop.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ message: 'Server error deleting crop' });
  }
});

// @desc    Get crop statistics
// @route   GET /api/crops/stats/overview
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const totalCrops = await Crop.countDocuments();
    const plantedCrops = await Crop.countDocuments({ status: 'planted' });
    const growingCrops = await Crop.countDocuments({ status: 'growing' });
    const readyCrops = await Crop.countDocuments({ status: 'ready' });
    const harvestedCrops = await Crop.countDocuments({ status: 'harvested' });
    
    // Calculate total area
    const areaAggregation = await Crop.aggregate([
      {
        $group: {
          _id: '$areaUnit',
          totalArea: { $sum: '$area' }
        }
      }
    ]);

    res.json({
      totalCrops,
      plantedCrops,
      growingCrops,
      readyCrops,
      harvestedCrops,
      areaBreakdown: areaAggregation
    });
  } catch (error) {
    console.error('Error fetching crop stats:', error);
    res.status(500).json({ message: 'Server error fetching crop statistics' });
  }
});

module.exports = router;