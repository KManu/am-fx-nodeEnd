const mongoose = require('mongoose');
const dayjs = require('dayjs');
const nanoid = require('nanoid');
const crypt = require('../../shared/crypt');

const userSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true
  },
  otherNames: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    default: () => nanoid(8),
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  activated: {
    type: Boolean,
    required: true,
    default: false
  },
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  created: {
    type: Date,
    required: true,
    default: () => {
      return dayjs().toDate();
    }
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

userSchema.pre('save', function (next) {
  // hash user password on save
  return crypt.hashPassword(this.password)
    .then(hash => {
      this.password = hash;
      return;
    });
});

const userModel = mongoose.model('User', userSchema);

module.exports.userModel = userModel;