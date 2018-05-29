const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({ 
    period: {
        type: String,
        required: false
      }, 
    member: {
        member_name: {
            type: String,
            required: true
        },
        member_deposits: {
            type: Number,
            required: true
        },
        member_trans_value: {
            type: Number,
            required: true
        },
        member_commission: {
            type: Number,
            required: true
        },
        member_cashback: {
            type: Number,
            required: true
        }
    }  
});

module.exports = mongoose.model('reports', ReportSchema);
