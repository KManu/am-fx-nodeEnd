/* Currencies CRUD */
const CurrencyModel = require('../db/db.index').models.currencyModel;

const errorHandler = error => {
  console.log('Caught: ', error);
  return {
    status: false,
    data: error
  };
};

/**
 * Creates a currency for an organisation
 * @param {Object} currencyObject
 * @return {Promise<any>} result of creation
 */
function create(currencyObject) {
  return CurrencyModel.create(currencyObject)
    .then(next => {
      console.log('Currency ' + next.code + ' created.');
      return true;
    })
    .catch(errorHandler);
}

/**
 * Updates a given currency object or creates it if it doesnt exist
 * @param {Object} currencyObject
 * @return {Promise<any>}
 */
function upsert(currencyObject) {
  return CurrencyModel.findByIdAndUpdate(currencyObject._id, currencyObject, {
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
  return CurrencyModel.find()
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