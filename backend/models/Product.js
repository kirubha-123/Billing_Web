const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
  },
  category: {
    type: String,
    default: 'General',
  },
  stock: {
    type: Number,
    default: 0,
  },
  description: String,
  shopId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
