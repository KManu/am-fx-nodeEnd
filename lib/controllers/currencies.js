/* Currencies CRUD */

var Promise = require('bluebird');
const mysql = require('mysql2');

require('dotenv').config();

var test = 'this is just a test value';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Creates a currency for an organisation
 * @param {Object} payload
 */
function create(payload) {
  return new Promise((resolve, reject) => {
    console.log(payload);
    const query = 'INSERT INTO `Currencies` (`id`, `name`, `rate`, `code`, `organisation_code`, `user_id`, `stock`, `buying_rate`, `selling_rate`, `date_set`, `deleted` ) VALUES( NULL, ? ,?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 0 ) ';

    const values = [
      payload.name,
      payload.rate,
      payload.code,
      payload.organisation_code,
      paylaod.user_id,
      payload.stock,
      payload.buying_rate,
      payload.selling_rate,
    ];
    // console.log(values);
    pool.execute(query, values, (err, rows) => {
      if (err) reject('DB Error: ', err);

      resolve(rows);
    });
  });
}

/**
 * Updates a given currency object or creates it if it doesnt exist
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string | number} payload.rate
 * @param {string} payload.code
 * @param {string} payload.organisation_code
 * @param {string} paylaod.user_id
 * @param {string | number} payload.stock
 * @param {string | number} payload.buying_rate
 * @param {string | number} payload.selling_rate
 * @param {string | number} payload.deleted
 */
function upsert(payload) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO `currencies` (`id`, `name`, `rate`, `code`, `organisation_code`, `user_id`, `stock`, `buying_rate`, `selling_rate`, `date_set`, `deleted` ) VALUES( NULL, ? ,?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 0 ) ON DUPLICATE KEY UPDATE `rate`=?,`user_id`=?,`stock`=?,`buying_rate`=?,`selling_rate`=?,`date_set`=CURRENT_TIMESTAMP,`deleted`=? ';

    const values = [
      payload.name,
      payload.rate,
      payload.code,
      payload.organisation_code,
      payload.user_id,
      payload.stock,
      payload.buying_rate,
      payload.selling_rate,


      payload.rate,
      payload.user_id,
      payload.stock,
      payload.buying_rate,
      payload.selling_rate,
      payload.deleted,
    ];

    console.log(mysql.format(query, values));

    pool.execute(query, values, (err, rows) => {
      if (err) reject(err);

      resolve(rows);
    });
  });
}

function remove(organisation_code) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE `currencies` SET `deleted`= 1 WHERE `organisation_code` = ?';
    const values = [
      organisation_code,
    ];
    pool.execute(query, values, (err, rows) => {
      if (err) reject(err);

      resolve(rows);
    });
  });
}


/**
 * Gets Currencies for a user based on their organisation
 * @param {Object} user
 * @param {string} user.id
 * @param {string} user.organisation_code
 */
function getByOrg(user) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM `currencies` WHERE `deleted`=0 AND `organisation_code`=?';
    const values = [
      user.organisation_code,
    ];
    pool.execute(query, values, (err, rows) => {
      if (err) reject('DB Error: ', err);

      resolve(rows);
    });
  });
}


function getAll(user) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM `currencies` WHERE `deleted`=0 AND `organisation_code`=?';
    const values = [
      user.id,
      user.organisation_code,
    ];
    pool.execute(query, values, (err, rows) => {
      if (err) reject('DB Error: ', err);

      resolve(rows);
    });
  });
}


module.exports.getByOrg = getByOrg;
module.exports.upsert = upsert;
module.exports.create = create;
module.exports.remove = remove;