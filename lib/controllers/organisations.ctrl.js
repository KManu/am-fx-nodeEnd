/* Organisations CRUD */

const OrgModel = require('../db/db.index').models.orgModel;

const errorHandler = error => {
  console.log('Caught: ', error);
  return {
    status: false,
    data: error
  };
};

/**
 * Creates a new organisation object
 * @param {Object} orgObject
 * @return {Promise<any>} object created
 */
function create(orgObject) {
  return OrgModel.exists({
      email: orgObject.email
    })
    .then(res => {
      if (res === false) {
        return OrgModel.create(orgObject).then(next => {
          return {
            status: true
          };
        });
      } else {
        return {
          status: false,
          message: 'Organisation Already Exists'
        };
      }
    })
    .catch(errorHandler);
}

/**
 * Updates a given org object
 * @param {Object} org
 * @return {Promise<any>}
 */
function update(org) {
  return OrgModel.findByIdAndUpdate(org._id, org, {
      upsert: false,
      setDefaultsOnInsert: true
    })
    .exec()
    .then(next => {
      console.log('Org ' + next.code + ' updated.');
      return {
        status: true
      };
    })
    .catch(errorHandler);
}

function findByCode(orgCode) {
  return OrgModel.findOne({
      code: orgCode
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

function getAll() {
  return OrgModel.find()
    .then(next => {
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

function getOrgsAndCodes() {
  return OrgModel.find()
    .select('name code')
    .then(next => {
      return {
        status: true,
        data: next
      };
    })
    .catch(errorHandler);
}

module.exports.update = update;
module.exports.create = create;
module.exports.getAll = getAll;
module.exports.findByCode = findByCode;
module.exports.getOrgsAndCodes = getOrgsAndCodes;