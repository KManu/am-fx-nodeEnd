const mongoose = require('mongoose');
const dayjs = require('dayjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  organisation: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  activated: {
    type: Boolean,
    required: true,
    default: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  created: {
    type: Date,
    required: true,
    default: () => {
      return dayjs().toDate();
    },
  },
},
{
  timestamps: {
    createdAt: 'created_at',
  },
});

const userModel = mongoose.model('User', userSchema);

module.exports.userModel = userModel;
