/* Currencies CRUD */
const CurrencyPairModel = require('../db/db.index').models.currencyPairModel;

const errorHandler = error => {
  console.log('Error caught: ', error);
  return new Error(error);
};

/**
 * Creates a currency for an organisation
 * @param {Object} currencyPairObject
 * @return {Promise<any>} result of creation
 */
function create(currencyPairObject) {
  return CurrencyPairModel.create(currencyPairObject)
    .then(next => {
      console.log('Currency ' + next.code + ' created.');
      return true;
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
      console.log('Currency ' + next.code + ' upserted.');
      return true;
    })
    .catch(errorHandler);
}

/**
 * Returns all currencies in DB
 * @return {Promise<any>} currencies
 */
function getAll() {
  return CurrencyPairModel.find()
    .exec()
    .then(next => {
      console.log('Currency ' + next.code + ' upserted.');
      return true;
    })
    .catch(errorHandler);
}

module.exports.upsert = upsert;
module.exports.create = create;
module.exports.getAll = getAll;
