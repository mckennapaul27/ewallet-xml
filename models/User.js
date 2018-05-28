const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  neteller_email_address: {
    type: String,
    unique: true,    
    required: true
  },
  neteller_account_id: {
    type: String,
    unique: true,    
    required: true
  },
  neteller_currency: {
    type: String,        
    required: false
  },
  created_at: {
    type: Number,
    default: new Date().getTime()
  }
});

module.exports = mongoose.model('users', UserSchema);
