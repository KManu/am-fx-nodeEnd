const mongoose = require('mongoose');
const dayjs = require('dayjs');
const currencySchema = require('./currencies.model').currencySchema;

const orgSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    index: true,
  },
  currencies: {
    type: [currencySchema],
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  phone: {
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
    default: true,
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

const orgModel = mongoose.model('Orgs', orgSchema);

module.exports.orgModel = orgModel;