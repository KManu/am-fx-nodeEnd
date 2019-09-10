/**
 * @module shared/auth
 */

const Promise = require('bluebird');
const userCtrl = require('../controllers/users.ctrl');


require('dotenv').config();


/**
 * Returns a Promise based boolean depending on whether the user is an admin of an Organisation
 * @param {Object} user
 * @param {string} user.id
 * @param {string} user.organisation_code
 * @return {Promise<boolean>}
 */
function isOrgAdmin(user) {
    return new Promise((resolve, reject) => {
        userCtrl.getUserDetailsByID(user.id)
            .then((rows) => {
                if (rows.length === 0) {
                    resolve(false);
                } else {
                    if (rows[0].role.toLowerCase() === 'org-admin') {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

/**
 * Returns a Promise based boolean depending on whether the user is a member of an Organisation
 * @param {Object} user
 * @param {string} user.id
 * @param {string} user.organisation_code
 * @return {Promise<boolean>}
 */
function isOrgUser(user) {
    return new Promise((resolve, reject) => {
        userCtrl.getUserDetailsByID(user.id)
            .then((rows) => {
                if (rows.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};


module.exports.isOrgUser = isOrgUser;
module.exports.isOrgAdmin = isOrgAdmin;