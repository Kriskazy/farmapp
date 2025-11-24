const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['seeds', 'fertilizer', 'feed', 'equipment', 'other'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
    default: 10,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Inventory', InventorySchema);
