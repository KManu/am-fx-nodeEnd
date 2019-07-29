const CustomerModel = require('../db/db.index').models.customerModel;

const errorHandler = (error) => {
  console.log('Caught: ', error);
  return new Error(error);
};

/**
 * Creates a customer
 * @param {Object} customerObject
 * @return {Promise<CustomerModel>} customer created
 */
function create(customerObject) {
  return CustomerModel
    .create(customerObject)
    .catch(errorHandler);
}

/**
 * Updates a given customer object or creates it if it doesnt exist
 * @param {Object} customer
 * @return {Promise<any>} created customer
 */
function upsert(customer) {
  return TransactionModel
      .findByIdAndUpdate(
          customer._id,
          customer,
          {
              upsert: true,
              setDefaultsOnInsert: true,
          }
      )
      .catch(errorHandler);
}


module.exports.create = create;
module.exports.upsert = upsert;