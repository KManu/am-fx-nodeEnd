const mongoose = require('mongoose');
const nanoid = require('nanoid/async');

const customerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      default: () => {
        return nanoid(10).then(id => {
          return id;
        });
      },
      index: true
    },
    org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    },
    category: {
      type: String,
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
    homeCountry: {
      type: String,
      required: true
    },
    postAddress: {
      type: String,
      required: false
    },
    residentialAddress: {
      type: String,
      required: false
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated:at'
    }
  }
);

const customerModel = mongoose.model('Customer', customerSchema);

module.exports.customerModel = customerModel;
