const mongoose = require('mongoose');
const { DB_URL } = require('../../env.config');

const currencyModel = require('./models/currencies.model').currencyModel;
const userModel = require('./models/users.model').userModel;
const orgModel = require('./models/orgs.model').orgModel;
const transactionsModel = require('./models/transactions.model').transactionModel;
const customerModel = require('./models/customers.model').customerModel;

mongoose.Promise = require('bluebird');
const Promise = require('bluebird');

const connectDb = () => {
  return mongoose.connect(DB_URL, {
    useMongoClient: true,
  });
};

const models = {
  currencyModel,
  userModel,
  orgModel,
  transactionsModel,
  customerModel,
};

function seedDB () {
  return new Promise((resolve, reject)=>{
    const defaultOrg = models.orgModel({
      name: 'Default Organisation',
      password: 'AAAAEAAHoSDzAqilaoCI113asBnH/Zzl264hOoY7o0kpzWe3F3C7HpOACYK+utM5Yaaxl5Pgx6bvfzYqe6VV7c8BqFj/retz++NDebRHwc7+bRQ876TDTw==',
      location: 'Unseen U, Discworld.',
      licenseNumber: 'testnumber',
      email: 'default@orgs.com',
      phone: '+233123456789',
      activated: true,
      active: true,
    });
    const defaultRoot = models.userModel({
      firstName: 'Default',
      otherNames: 'Admin',
      email: 'default@admin.com',
      organisation: defaultOrg._id,
      role: 'admin',
      password: 'AAAAEAAHoSDzAqilaoCI113asBnH/Zzl264hOoY7o0kpzWe3F3C7HpOACYK+utM5Yaaxl5Pgx6bvfzYqe6VV7c8BqFj/retz++NDebRHwc7+bRQ876TDTw==',
      activated: true,
      active: true,
    });

    defaultOrg.save()
      .then((next)=>{
        return defaultRoot.save();
      })
      .then((next)=>{
        console.log('Default config stored.');
      })
      .catch((error)=>{
        console.log('Error saving default user config: ', error);
      });
  });
}

module.exports.connectDb = connectDb;
module.exports.models = models;
module.exports.seedDB = seedDB;