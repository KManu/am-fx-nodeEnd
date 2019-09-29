const mongoose = require('mongoose');


const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    required: true,
    min: 0
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const currencyPairSchema = new mongoose.Schema({
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true
  },
  counter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true
  },
  rate: {
    type: Number,
    default: 0,
    min: 0,
    required: true
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
});

const currencyModel = mongoose.model('Currency', currencySchema);
const currencyPairModel = mongoose.model('CurrencyPair', currencyPairSchema);

module.exports.currencyModel = currencyModel;
module.exports.currencySchema = currencySchema;
module.exports.currencyPairModel = currencyPairModel;
module.exports.currencyPairSchema = currencyPairSchema;