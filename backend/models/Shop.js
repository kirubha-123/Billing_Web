const mongoose = require('mongoose');

// Shop Schema
const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shop name is required'],
  },
  address: String,
  phone: String,
  email: String,
  gstNumber: String,
  logoUrl: String,
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  taxPercentage: {
    type: Number,
    default: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Shop', shopSchema);
