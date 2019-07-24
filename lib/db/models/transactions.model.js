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
    index: true,
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
  teller: {
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

transactionSchema.statics.findByReceiptID = async function (id) {
  return this.findOne({
    receiptID: id,
  });
};

transactionSchema.statics.findByTeller = async function (tellerID) {
  return this.find({
    teller: tellerID,
  });
};

transactionSchema.statics.findByCustomerCode = async function (customerCode) {
  return this.find({
    'customer._id': customerCode,
  });
};

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.export.transactionModel = transactionModel;