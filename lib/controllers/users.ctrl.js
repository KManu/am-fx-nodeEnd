/* User account CRUD */

const UserModel = require('../db/db.index').models.userModel;
const OrgModel = require('../db/db.index').models.orgModel;
const crypt = require('../shared/crypt');

const errorHandler = error => {
  console.log('Caught: ', error);
  return {
    status: false,
    data: error
  };
};

/**
 * Checks if a given user email and password are valid
 * @param {Object} payload
 * @return {Promise<UserModel>} User details
 */
function login(payload) {
  return UserModel.findOne({
      email: payload.email
    }, 'password')
    .exec()
    .then(next => {
      if (next === null || next === undefined) {
        return false;
      } else {
        userId = next._id;
        return crypt.verifyPassword(payload.password, next.password);
      }
    })
    .then(next => {
      if (next !== true) {
        return false;
      } else {
        return UserModel.findOne({
            email: payload.email
          },
          ' firstName otherNames email organisation role created active activated'
        ).populate(
          'organisation',
          'name currencies location licenseNumber email phone code active'
        );
      }
    })
    .then(next => {
      if (next === false) {
        return {
          status: false,
          data: []
        };
      } else {
        return {
          status: true,
          data: next
        };
      }
    })
    .catch(errorHandler);
}

/**
 * Creates a user if the email doesnt exist
 * @param {Object} userObject
 * @return {Promise} result
 */
function create(userObject) {
  return UserModel.exists({
      email: userObject.email
    })
    .then(res => {
      if (res === false) {
        return UserModel.create(userObject).then(next => {
          return {
            status: true,
            data: next
          };
        });
      } else {
        return {
          status: false,
          message: 'User Already Exists'
        };
      }
    })
    .catch(errorHandler);

  /* return UserModel
    .create(userObject)
    .catch(errorHandler); */
}

/**
 * Updates a given user object or creates it if it doesnt exist
 * @param {Object} user
 * @return {Promise<any>}
 */
function update(user) {
  return UserModel.findByIdAndUpdate(user.id, user, {
      upsert: false,
      setDefaultsOnInsert: true
    })
    .then(next => {
      console.log('user ' + next.email + ' updated.');
      return {
        status: true
      };
    })
    .catch(errorHandler);
}

/**
 * Returns all users for a given Organisation code
 * @param {Object} orgCode
 * @return {Promise} result
 */
function getByOrgCode(orgCode) {
  return OrgModel.findOne({
      code: orgCode
    })
    .select({
      _id: 1
    })
    .exec()
    .then(next => {
      if (next !== null) {
        return UserModel.find({
          organisation: next._id
        }).select({
          password: 0
        });
      } else {
        return false;
      }
    })
    .then(next => {
      if (next === false) {
        return {
          status: false
        };
      } else {
        return {
          status: true,
          data: next
        };
      }
    })
    .catch(errorHandler);
}

/**
 * Returns details for a given user id
 * @param {string} userID
 * @return {Promise<string>} id
 */
function getById(userID) {
  return UserModel.findById(userID)
    .exec()
    .catch(errorHandler);
}

/**
 * Returns details for a given user id
 * @param {string} userCode
 * @return {Promise<string>} id
 */
function getByUserCode(userCode) {
  return UserModel.find({
      code: userCode
    })
    .exec()
    .catch(errorHandler);
}

module.exports.login = login;
module.exports.create = create;
module.exports.update = update;
module.exports.getByOrgCode = getByOrgCode;
module.exports.getById = getById;
module.exports.getByUserCode = getByUserCode;