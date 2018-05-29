const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  member_name: {
    type: String,
    unique: true,
    required: true
  },
  reg_date: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: false,
    required: true
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false
  }  
});

module.exports = mongoose.model('accounts', AccountSchema);