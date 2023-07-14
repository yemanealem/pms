const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  hasDefinedPrice: { type: Boolean},
  unitPrice: { type: Number },
  description: { type: String },
});

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);

module.exports = ServiceType;