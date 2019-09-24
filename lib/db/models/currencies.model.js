const mongoose = require('mongoose');


/**
 * Currencies are to be used as embedded documents, and that's why they won't have an org ID field
 */
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
    type: currencySchema,
    required: true
  },
  counter: {
    type: currencySchema,
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
  }
});

const currencyModel = mongoose.model('Currency', currencySchema);
const currencyPairModel = mongoose.model('CurrencyPair', currencyPairSchema);

module.exports.currencyModel = currencyModel;
module.exports.currencySchema = currencySchema;
module.exports.currencyPairModel = currencyPairModel;
module.exports.currencyPairSchema = currencyPairSchema;