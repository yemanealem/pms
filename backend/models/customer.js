// Model
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: {type: String},
  tinNum: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  streetAdress: {type: String},
  address: {type: String},
  homeNumber: { type: String },
  username: {type: String, unique: true},
  password: String,
  new_notifications: {
    type: [
      {
      content: {
        type: String,
        default: null
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      createdAt: { 
        type: Date, 
        default: Date.now()
      }
    }
    ]
  },
  old_notifications: {
    type: [
      {
      content: {
        type: String,
        default: null
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },
      createdAt: {
        type: Date
      }
    }
    ]
  },
  activationToken:{type: String, default:null}
});

customerSchema.virtual('fullName').get(function() {
  let fullName = `${this.firstName}`;
  fullName += ` ${this.lastName}`;
  return fullName;
});
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;