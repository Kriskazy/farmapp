const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/auth');

// @route   GET api/inventory
// @desc    Get all inventory items
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const items = await Inventory.find({ user: req.user.id }).sort({
      name: 1,
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/inventory
// @desc    Add an inventory item
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, category, quantity, unit, threshold } = req.body;

  try {
    const newItem = new Inventory({
      user: req.user.id,
      name,
      category,
      quantity,
      unit,
      threshold,
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/inventory/:id
// @desc    Update an inventory item
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, category, quantity, unit, threshold } = req.body;

  try {
    let item = await Inventory.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Check user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: { name, category, quantity, unit, threshold, lastUpdated: Date.now() } },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/inventory/:id
// @desc    Delete an inventory item
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Check user
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await item.deleteOne();

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
