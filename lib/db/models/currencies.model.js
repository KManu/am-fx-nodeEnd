const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  buying: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  selling: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
});
const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  benchmarkRate: {
    type: rateSchema,
    required: true,
  },
  orgRate: {
    type: rateSchema,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
},
{
  timestamps: {
    createdAt: 'created_at',
  },
});

const currencyModel = mongoose.model('Orgs', currencySchema);

module.exports.currencyModel = currencyModel;
module.exports.currencySchema = currencySchema;