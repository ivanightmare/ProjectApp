const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('forms', FormSchema);