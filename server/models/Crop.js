const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide crop name'],
    trim: true
  },
  variety: {
    type: String,
    trim: true
  },
  field: {
    type: String,
    required: [true, 'Please provide field location'],
    trim: true
  },
  plantedDate: {
    type: Date,
    required: [true, 'Please provide planting date']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Please provide expected harvest date']
  },
  actualHarvestDate: {
    type: Date
  },
  area: {
    type: Number,
    required: [true, 'Please provide area in acres/hectares'],
    min: [0.1, 'Area must be at least 0.1']
  },
  areaUnit: {
    type: String,
    enum: ['acres', 'hectares'],
    default: 'acres'
  },
  status: {
    type: String,
    enum: ['planted', 'growing', 'ready', 'harvested', 'failed'],
    default: 'planted'
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
cropSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Crop', cropSchema);