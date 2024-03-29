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
  return CustomerModel.findByIdAndUpdate(customer._id, customer, {
    upsert: true,
    setDefaultsOnInsert: true
  }).catch(errorHandler);
}

function getByOrg(orgID) {
  return CustomerModel.find({
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

function getByCode(customerCode) {
  return CustomerModel.find({
      code: customerCode
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

function getByID(custIdType, custIdNumber) {
  return CustomerModel.findOne({
      idType: custIdType,
      idNumber: custIdNumber
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
module.exports.getByCode = getByCode;
module.exports.getByID = getByID;