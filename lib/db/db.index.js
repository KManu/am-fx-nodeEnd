const mongoose = require('mongoose');
const {
  DB_URL
} = require('../../env.config');
const currencyModel = require('./models/currencies.model').currencyModel;
const currencyPairModel = require('./models/currencies.model').currencyPairModel;
const userModel = require('./models/users.model').userModel;
const orgModel = require('./models/orgs.model').orgModel;
const transactionsModel = require('./models/transactions.model').transactionModel;
const customerModel = require('./models/customers.model').customerModel;

mongoose.Promise = require('bluebird');
const Promise = require('bluebird');

const connectDb = () => {
  return mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
};

const models = {
  currencyModel,
  currencyPairModel,
  userModel,
  orgModel,
  transactionsModel,
  customerModel
};

/**
 * Seed DB with default user admin
 * @return {Promise} config install result
 */
function seedDB() {
  return new Promise((resolve, reject) => {
    const defaultOrg = models.orgModel({
      name: 'Default Organisation',
      password: 'AAAAEAAHoSDzAqilaoCI113asBnH/Zzl264hOoY7o0kpzWe3F3C7HpOACYK+utM5Yaaxl5Pgx6bvfzYqe6VV7c8BqFj/retz++NDebRHwc7+bRQ876TDTw==', // 'default'
      location: 'Unseen U, Discworld.',
      licenseNumber: 'testnumber',
      email: 'default@orgs.com',
      phone: '+233123456789',
      activated: true,
      active: true
    });
    const defaultRoot = models.userModel({
      lastName: 'Default',
      otherNames: 'Admin',
      email: 'default@admin.com',
      organisation: defaultOrg._id,
      role: 'app-admin', // app-admin | org-admin | org-teller
      password: 'AAAAEAAHoSDzAqilaoCI113asBnH/Zzl264hOoY7o0kpzWe3F3C7HpOACYK+utM5Yaaxl5Pgx6bvfzYqe6VV7c8BqFj/retz++NDebRHwc7+bRQ876TDTw==', // 'default'
      activated: true,
      active: true
    });
    console.log('Seeding DB');

    return defaultOrg
      .save()
      .then(next => {
        return defaultRoot.save();
      })
      .then(next => {
        console.log('Default config stored.');
        return;
      })
      .catch(error => {
        console.log('Error saving default user config: ', error);
        return;
      });
  });
}

function checkIfExists() {
  return models.userModel
    .find({
      $or: [{
        email: 'default@admin.com'
      }, {
        role: 'app-admin'
      }]
    })
    .exec()
    .then(next => {
      if (next.length > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.log('Error checking for preinstall: ', error);
    });
}

checkIfExists()
  .then(exists => {
    // console.log('Exists: ', exists);
    if (exists === false) return seedDB();
    // exists === false && seedDB();
  })
  .catch(error => {
    console.log();
  });

module.exports.connectDb = connectDb;
module.exports.models = models;
module.exports.seedDB = seedDB;