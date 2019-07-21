const mongoose = require('mongoose');
const currencySchema = require('./currencies.model').currencySchema;
const intformat = require('biguint-format');
const FlakeId = require('flake-idgen');

const customerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    default: () => {
      const id = new FlakeId();
      return intformat(id.next(), 'dec');
    },
  },
  name: {
    type: String,
    required: true,
  },
  idType: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  homeCountry: {
    type: String,
    required: true,
  },
  postAddress: {
    type: String,
    required: false,
  },
  residentialAddress: {
    type: String,
    required: false,
  },
},
{
  timestamps: {
    createdAt: 'created_at',
  },
});

const transactionSchema = new mongoose.Schema({
  receiptID: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  currency: {
    type: currencySchema,
    required: true,
  },
  amount: {
    type: String,
    required: true,
    min: 0,
  },
  tellerID: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  customer: {
    type: customerSchema,
    required: true,
  },
},
{
  timestamps: {
    createdAt: 'created_at',
  },
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.export.transactionModel = transactionModel;