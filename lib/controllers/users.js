/* User account CRUD */

const Promise = require('bluebird');
const mysql = require('mysql2');
const crypt = require('../shared/crypt');


require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

function verifyPassword(payload) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT `password` FROM `users` WHERE `email` = ?';
    const values = [payload.email];
    pool.execute(query, values, (err, rows) => {
      if (err) {
        reject(new Error('DB Error: ', err));
      } else if (rows === undefined || rows === null || rows.length === 0) {
        // email doesnt exist
        reject(new Error('Username or password incorrect'));
      } else {
        // console.log('Rows: ', rows);
        crypt.verifyPassword(payload.password, rows[0].password)
            .then(() => {
              resolve(true);
            })
            .catch((err) => {
              reject(new Error('Password check error: ', err));
            });
      }
    });
  });
}

function login(payload) {
  return new Promise((resolve, reject) => {
    verifyPassword(payload)
        .then((res) => {
          console.log('Password check passed');
          const query = 'SELECT `id`, `first_name`, `last_name`, `email`, `organisation_code`, `role`, `activated`, `created` FROM `users` WHERE `email` = ?';
          const values = [
            payload.email,
          ];
          pool.execute(query, values, (err, rows) => {
            if (err) {
              reject( new Error('DB Error: ', err));
            }
            resolve(rows);
          });
        })
        .catch((err) => {
        // password check failed
        console.log(err);
          reject( new Error({
            message: 'Password verification failed.',
          }));
        });
  });
}

function create(payload) {
  return new Promise((resolve, reject) => {
    crypt.hashPassword(payload.password)
        .then((passwordHash) => {
          const query = 'INSERT INTO `users` (`id`,`first_name`,`last_name`,`organisation_code`,`role`,`password`,`activated`,`deleted`,`created`,`email`) VALUES(NULL, ?, ?, ?, ?, ?, 1, 0, CURRENT_TIMESTAMP, ?)';
          const values = [
            payload.first_name,
            payload.last_name,
            payload.code,
            payload.role,
            passwordHash,
            payload.email,
          ];
          console.log('Values: ', values);
          pool.execute(query, values, (err, rows, info) => {
            if (err) {
              reject(new Error('DB Error: ', err));
            }
            console.log('rows: ', rows);
            resolve(rows);
          });
        })
        .catch((err) => {
          reject(new Error('Password Hash Error: ', err));
        });
  });
}

function edit(payload) {
  return new Promise((resolve, reject) => {

  });
}

function removeUser(userID) {
  return new Promise((resolve, reject) => {

  });
}

function getUserDetailsByEmail(userEmail) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT `id`, `first_name`, `last_name`, `email`, `organisation_code`, `role`, `activated`, `created` FROM `users` WHERE `email` = ?';
    const values = [
      userEmail,
    ];
    pool.execute(query, values, (err, rows) => {
      if (err) {
        reject(new Error('DB Error: ', err));
      }
      resolve(rows);
    });
  });
}

/**
 * Returns details for a given user id
 * @param {string} userID
 * @return {Promise<string>} id
 */
function getUserDetailsByID(userID) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT `id`, `first_name`, `last_name`, `email`, `organisation_code`, `role`, `activated`, `created` FROM `users` WHERE `id` = ?';
    const values = [
      userID,
    ];
    pool.execute(query, values, (err, rows) => {
      if (err) {
        reject(new Error('DB Error: ', err));
      }
      resolve(rows);
    });
  });
}

function getUserTransactions(userID) {
  return new Promise((resolve, reject) => {

  });
}


module.exports.login = login;
module.exports.create = create;
module.exports.edit = edit;
module.exports.removeUser = removeUser;
module.exports.getUserDetailsByEmail = getUserDetailsByEmail;
module.exports.getUserDetailsByID = getUserDetailsByID;
module.exports.getUserTransactions = getUserTransactions;