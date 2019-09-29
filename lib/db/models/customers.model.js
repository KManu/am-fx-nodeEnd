const mongoose = require('mongoose');
const nanoid = require('nanoid');

const customerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    default: () => nanoid(10),
    index: true
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String, // org or individual
    required: true
  },
  name: {
    type: String,
    required: true
  },
  idType: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  residentialAddress: {
    type: String,
    required: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated:at'
  }
});

const customerModel = mongoose.model('Customer', customerSchema);

module.exports.customerModel = customerModel;