const mongoose = require('mongoose');
const nanoid = require('nanoid/async');

const transactionSchema = new mongoose.Schema(
  {
    receiptID: {
      type: String,
      required: false,
      default: () => {
        return nanoid(20).then(id => {
          return id;
        });
      }
    },
    type: {
      type: String,
      required: true
    },
    currencyPair: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CurrencyPair',
      required: true
    },
    amount: {
      type: String,
      required: true,
      min: 0
    },
    teller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

transactionSchema.statics.findByReceiptID = async function(id) {
  return this.findOne({
    receiptID: id
  });
};

transactionSchema.statics.findByTeller = async function(tellerID) {
  return this.find({
    teller: tellerID
  });
};

transactionSchema.statics.findByCustomerCode = async function(customerCode) {
  return this.find({
    'customer._id': customerCode
  });
};

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports.transactionModel = transactionModel;
