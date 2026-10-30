const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide shelter name'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
      trim: true
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
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0
    },
    contactPerson: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    amenities: [String], // e.g. ['Drinking Water', 'Medical Camp', 'Food Service', 'Power Generator']
    status: {
      type: String,
      enum: ['Open', 'Near Full', 'Full', 'Closed'],
      default: 'Open'
    }
  },
  { timestamps: true }
);

shelterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shelter', shelterSchema);

