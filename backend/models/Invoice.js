const mongoose = require('mongoose');

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      productName: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  subtotal: Number,
  taxAmount: Number,
  taxPercentage: {
    type: Number,
    default: 10,
  },
  total: Number,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'other'],
    default: 'cash',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
