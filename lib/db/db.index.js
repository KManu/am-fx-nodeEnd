const mongoose = require('mongoose');
const { DB_URL } = require('../../env.config');

const currencyModel = require('./models/currencies.model').currencyModel;
const userModel = require('./models/users.model').userModel;
const orgModel = require('./models/orgs.model').orgModel;
const transactionsModel = require('./models/transactions.model').transactionsModel;

const connectDb = () => {
  return mongoose.connect(DB_URL);
};

const models = {
  currencyModel,
  userModel,
  orgModel,
  transactionsModel,
};

module.exports.connectDb = connectDb;
module.exports.models = models;
