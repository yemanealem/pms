const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for the second collection
const employeeSchema = new Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  email: { type: String },
  dob: { type: Date },
  phoneNumber: { type: String},
  jobTitleId: { type: String, ref: 'Job_title',require:true},
  address: { type: String },
  remark: { type: String },
  username: {type: String, unique: true},
  password: String,
  profilePicture: {
    type: String,
    default: null
  },
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

employeeSchema.virtual('fullName').get(function() {
  let fullName = `${this.firstName}`;
  if (this.middleName) {
    fullName += ` ${this.middleName}`;
  }
  fullName += ` ${this.lastName}`;
  return fullName;
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;