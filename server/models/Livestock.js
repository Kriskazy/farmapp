const mongoose = require('mongoose');

const livestockSchema = new mongoose.Schema({
  tagNumber: {
    type: String,
    required: [true, 'Please provide tag number'],
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please provide animal type'],
    enum: ['cattle', 'sheep', 'goat', 'pig', 'chicken', 'duck', 'horse', 'other']
  },
  breed: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  birthDate: {
    type: Date
  },
  weight: {
    type: Number,
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'lbs'],
    default: 'kg'
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'sick', 'injured', 'quarantine', 'deceased'],
    default: 'healthy'
  },
  location: {
    type: String,
    trim: true
  },
  parentMale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livestock'
  },
  parentFemale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livestock'
  },
  vaccinations: [{
    vaccine: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    nextDue: Date,
    notes: String
  }],
  healthRecords: [{
    date: {
      type: Date,
      required: true
    },
    condition: {
      type: String,
      required: true
    },
    treatment: String,
    veterinarian: String,
    notes: String
  }],
  breeding: [{
    date: Date,
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Livestock'
    },
    expectedDelivery: Date,
    actualDelivery: Date,
    offspring: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Livestock'
    }],
    notes: String
  }],
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
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
livestockSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate age if birthDate is provided
livestockSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  const today = new Date();
  const birth = new Date(this.birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// Ensure virtual fields are serialized
livestockSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Livestock', livestockSchema);