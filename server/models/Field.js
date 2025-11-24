const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  boundaries: {
    type: [[Number]], // Array of [lat, lng] arrays
    required: true,
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
  },
  color: {
    type: String,
    default: '#10b981', // Default emerald green
  },
  area: {
    type: Number, // In acres or hectares
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Field', FieldSchema);
