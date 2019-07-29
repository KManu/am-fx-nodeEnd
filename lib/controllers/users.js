/* User account CRUD */

const UserModel = require('../db/db.index').models.userModel;
const crypt = require('../shared/crypt');


const errorHandler = (error)=>{
  console.log('Caught: ', error);
  return new Error(error);
};

/**
 * Checks if a given user email and password are valid
 * @param {Object} payload
 * @return {Promise<UserModel>} User details
 */
function login(payload) {
  let userId;
  return UserModel
    .findOne({email: payload.email}, 'password')
    .exec()
    .then((next)=>{
      if (next === null || next === undefined) return false;
      userId = next._id;
     return crypt.verifyPassword(payload.password, next.password);
    })
    .then((next)=>{
      if (next === false) return false;
      return UserModel.findByEmail(userId).exec();
    })
    .catch(errorHandler);
}

function create(userObject) {
  return UserModel
    .create(userObject)
    .catch(errorHandler);
}

/**
 * Updates a given user object or creates it if it doesnt exist
 * @param {Object} user
 * @return {Promise<any>}
 */
function upsert(user) {
  return UserModel.findByEmailAndUpdate(
      user._id,
      user,
      {
          upsert: true,
          setDefaultsOnInsert: true,
      })
      .then((next) => {
          console.log('user ' + next.code + ' upserted.');
          return true;
      })
      .catch(errorHandler);
}

function findByEmail(userEmail) {
  return UserModel
    .find({email: userEmail})
    .exec()
    .catch(errorHandler);
}

/**
 * Returns details for a given user id
 * @param {string} userID
 * @return {Promise<string>} id
 */
function findById(userID) {
  return UserModel
    .findById(userID)
    .exec()
    .catch(errorHandler);
}


module.exports.login = login;
module.exports.create = create;
module.exports.upsert = upsert;
module.exports.findByEmail = findByEmail;
module.exports.findById = findById;