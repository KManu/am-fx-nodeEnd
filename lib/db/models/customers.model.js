const mongoose = require('mongoose');
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
      updatedAt: 'updated:at',
    },
  });

const customerModel = mongoose.model('Customer', customerSchema);

module.exports.customerModel = customerModel;