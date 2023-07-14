const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const job_titleSchema = new Schema({
  code: { type: String, required: true , unique: true},
  name: { type: String, required: true },
  description: { type: String, required: true }
});


const Job_title = mongoose.model('Job_title', job_titleSchema);


module.exports = Job_title;