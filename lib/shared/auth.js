/**
 * @module shared/auth
 */

const Promise = require('bluebird')
const mysql = require('mysql2');
const userCtrl = require('../controllers/users');


require('dotenv').config();

var test = 'this is just a test value';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


/**
 * Returns a Promise based boolean depending on whether the user is an admin of an Organisation
 * @param {Object} user 
 * @param {string} user.id
 * @param {string} user.organisation_code
 * @returns {Promise<boolean>}
 */
function isOrgAdmin(user) {

    return new Promise((resolve, reject) => {
        userCtrl.getUserDetailsByID(user.id)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(false)
                } else {
                    if (rows[0].role.toLowerCase() === 'admin') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }


            })
            .catch(error => {
                reject(error);
            });
    });
};

/**
 * Returns a Promise based boolean depending on whether the user is a member of an Organisation
 * @param {Object} user 
 * @param {string} user.id
 * @param {string} user.organisation_code
 * @returns {Promise<boolean>}
 */
function isOrgUser(user) {

    return new Promise((resolve, reject) => {
        userCtrl.getUserDetailsByID(user.id)
            .then(rows => {
                if (rows.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};


module.exports.isOrgUser = isOrgUser;
module.exports.isOrgAdmin = isOrgAdmin;