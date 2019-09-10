/* Transactions CRUD */


const TransactionModel = require('../db/db.index').models.transactionsModel;

const errorHandler = (error) => {
    console.log('Caught: ', error);
    return {
      status: false,
      data: new Error(error),
    };
  };

/**
 * Creates a transaction object and returns it.
 * @param {Object} payload
 * @return {Promise<TransactionModel>} Object Created
 */
function create(payload) {
    return TransactionModel
        .create(payload)
        .then((next) => {
            return {
                status: true,
                data: next,
            };
        })
        .catch(errorHandler);
}

/**
 * Updates a given transaction object or creates it if it doesnt exist
 * @param {Object} transaction
 * @return {Promise<any>} created transaction
 */
function upsert(transaction) {
    return TransactionModel
        .findByIdAndUpdate(
            transaction._id,
            transaction,
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        )
        .exec()
        .catch(errorHandler);
}

/**
 * Finds all transactions for an organisation
 * @param {String} orgId
 * @return {Promise<Array<TransactionModel>>} Organisations
 */
function findByOrgID(orgId) {
    return TransactionModel
        .find({ organisation: orgId })
        .populate('organisation')
        .exec()
        .catch(errorHandler);
}

/**
 * Finds all transactions for an user
 * @param {String} userId
 * @return {Promise<Array<TransactionModel>>} Transactions
 */
function findByUser(userId) {
    return TransactionModel
        .find({ teller: userId })
        .catch(errorHandler);
}

/**
 * Returns the transactions for a given customer
 * @param {String} customerId
 * @return {Promise<TransactionModel>} transactions
 */
function findByCustomerId(customerId) {
    return TransactionModel
    .find({customer: customerId})
    .populate('teller')
    .exec()
    .catch(errorHandler);
}

module.exports.create = create;
module.exports.upsert = upsert;
module.exports.findByUser = findByUser;
module.exports.findByOrgID = findByOrgID;
module.exports.findByCustomerId = findByCustomerId;