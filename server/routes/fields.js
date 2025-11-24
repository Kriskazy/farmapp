const express = require('express');
const router = express.Router();
const Field = require('../models/Field');
const { protect } = require('../middleware/auth');

// @route   GET api/fields
// @desc    Get all fields
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const fields = await Field.find({ user: req.user.id }).populate('crop', 'name variety');
    res.json(fields);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/fields
// @desc    Add a field
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, boundaries, crop, color, area, description } = req.body;

  try {
    const newField = new Field({
      user: req.user.id,
      name,
      boundaries,
      crop,
      color,
      area,
      description,
    });

    const field = await newField.save();
    res.json(field);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/fields/:id
// @desc    Update a field
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { name, boundaries, crop, color, area, description } = req.body;

  try {
    let field = await Field.findById(req.params.id);

    if (!field) return res.status(404).json({ msg: 'Field not found' });

    // Check user
    if (field.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    field = await Field.findByIdAndUpdate(
      req.params.id,
      { $set: { name, boundaries, crop, color, area, description } },
      { new: true }
    );

    res.json(field);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/fields/:id
// @desc    Delete a field
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);

    if (!field) return res.status(404).json({ msg: 'Field not found' });

    // Check user
    if (field.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await field.deleteOne();

    res.json({ msg: 'Field removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
