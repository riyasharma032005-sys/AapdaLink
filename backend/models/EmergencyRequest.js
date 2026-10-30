const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide an emergency title'],
      trim: true
    },
    emergencyType: {
      type: String,
      required: true,
      enum: ['Food', 'Water', 'Medicine', 'Shelter', 'Rescue', 'Other']
    },
    description: {
      type: String,
      required: [true, 'Please describe your situation in detail'],
      trim: true
    },
    numberOfPeopleAffected: {
      type: Number,
      default: 1
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'High'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    address: {
      type: String,
      required: [true, 'Please specify an address or landmark'],
      trim: true
    },
    contactPhone: {
      type: String,
      required: [true, 'Please specify a callback contact phone number']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedRole: {
      type: String,
      enum: ['volunteer', 'ngo', null],
      default: null
    },
    statusHistory: [
      {
        status: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        comment: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

emergencyRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);

