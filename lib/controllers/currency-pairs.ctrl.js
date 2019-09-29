/* Currencies CRUD */
const CurrencyPairModel = require('../db/db.index').models.currencyPairModel;

const errorHandler = error => {
  console.log('Error caught: ', error);
  return {
    status: false,
    data: error
  };
};

/**
 * Creates a currency pair for an organisation
 * @param {Object} currencyPairObject
 * @return {Promise<any>} result of creation
 */
function create(currencyPairObject) {
  return CurrencyPairModel.create(currencyPairObject)
    .then(next => {
      console.log('Currency pair ' + currencyPairObject + ' created.');
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

/**
 * Updates a given currency object or creates it if it doesnt exist
 * @param {Object} currencyPairObject
 * @return {Promise<any>}
 */
function upsert(currencyPairObject) {
  return CurrencyPairModel.findByIdAndUpdate(currencyPairObject._id, currencyPairObject, {
      upsert: true,
      setDefaultsOnInsert: true
    })
    .exec()
    .then(next => {
      console.log('Currency pair upserted.');
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

/**
 * Returns all currencies in DB
 * @return {Promise<any>} currencies
 */
function getAll() {
  return CurrencyPairModel.find()
    .populate(['base', 'counter', {
      path: 'creator',
      select: 'lastName otherNames email'
    }, {
      path: 'org',
      select: 'name licenseNumber'
    }])
    .exec()
    .then(next => {
      console.log('returning all currency pairs');
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

/**
 * Returns all currency pairs for an organisation
 * @param {string} orgID
 * @return {Promise} Organisation Currency pairs
 */
function getByOrg(orgID) {
  return CurrencyPairModel
    .find({
      org: orgID
    })
    .populate(['base', 'counter', {
      path: 'creator',
      select: 'lastName otherNames email'
    }, {
      path: 'org',
      select: 'name licenseNumber'
    }]).exec()
    .then(next => {
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

module.exports.upsert = upsert;
module.exports.create = create;
module.exports.getAll = getAll;
module.exports.getByOrg = getByOrg;