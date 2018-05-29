const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
  name: {
    type: String,
    required: false
  },  
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
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
  },
  linked: {
    type: Boolean,
    required: true,
    default: false
  },
});

module.exports = mongoose.model('users', UserSchema);
