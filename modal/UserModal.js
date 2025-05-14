const { required } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 100

    },
    status: {
        type: String,
        enum : ['active','deactive'],
        default: 'deactive'
    },
    otp : {
        type: String,
        required : true
    },
    user_type : {
        type : String,
        default : 'user'
    }

  },
  {
    timestamps: true
  }
);

const UserModal = mongoose.model('User', userSchema);
module.exports = UserModal;