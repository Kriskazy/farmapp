const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide task title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide task description'],
    trim: true
  },
  category: {
    type: String,
    enum: ['crop', 'livestock', 'equipment', 'maintenance', 'harvest', 'planting', 'feeding', 'other'],
    required: true,
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide due date']
  },
  estimatedHours: {
    type: Number,
    min: 0.1,
    max: 24
  },
  actualHours: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  relatedCrop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  },
  relatedLivestock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livestock'
  },
  completedAt: {
    type: Date
  },
  startedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  workerNotes: {
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
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completion date when status changes to completed
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
  }
  
  // Set started date when status changes to in-progress
  if (this.status === 'in-progress' && !this.startedAt) {
    this.startedAt = Date.now();
  }
  
  next();
});

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate < new Date() && this.status !== 'completed';
});

// Ensure virtual fields are serialized
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);