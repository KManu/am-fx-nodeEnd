const CustomerModel = require('../db/db.index').models.customerModel;

const errorHandler = error => {
  console.log('Caught: ', error);
  return {
    status: false,
    data: error
  };
};

/**
 * Creates a customer
 * @param {Object} customerObject
 * @return {Promise<CustomerModel>} customer created
 */
function create(customerObject) {
  return CustomerModel.create(customerObject).catch(errorHandler);
}

/**
 * Updates a given customer object or creates it if it doesnt exist
 * @param {Object} customer
 * @return {Promise<any>} created customer
 */
function upsert(customer) {
  return TransactionModel.findByIdAndUpdate(customer._id, customer, {
    upsert: true,
    setDefaultsOnInsert: true
  }).catch(errorHandler);
}

function getByOrg(orgID) {
  return TransactionModel.find({
      org: orgID
    })
    .exec()
    .then(next => {
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

module.exports.create = create;
module.exports.upsert = upsert;
module.exports.getByOrg = getByOrg;