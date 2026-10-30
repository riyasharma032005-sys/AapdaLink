const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Water', 'Medicine', 'First Aid', 'Blankets', 'Rescue Kit', 'Hygiene', 'Other']
    },
    itemName: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please enter quantity'],
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true // e.g., 'packets', 'litres', 'kits', 'boxes'
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Depleted'],
      default: 'Available'
    },
    warehouseLocation: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);

