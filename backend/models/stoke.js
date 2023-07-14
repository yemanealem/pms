const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  balanceIn: {
    type: Number,
    default: 0
  },
  balanceOut: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;