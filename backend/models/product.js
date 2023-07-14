const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  serviceType: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unitPrice: {
    type: Number,
    required: true
  },
  measurement: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;