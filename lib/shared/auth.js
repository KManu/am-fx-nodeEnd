/**
 * @module shared/auth
 */

const Promise = require('bluebird');
const userCtrl = require('../controllers/users.ctrl');


/**
 * Returns a Promise based boolean depending on whether the user is an admin of an Organisation
 * @param {Object} userID
 * @param {string} user.organisation_code
 * @return {Promise<boolean>}
 */
function isOrgAdmin(userID) {
    return new Promise((resolve, reject) => {
        userCtrl.getById(userID)
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
 * @param {Object} userID
 * @param {string} user.organisation_code
 * @return {Promise<boolean>}
 */
function isOrgUser(userID) {
    return new Promise((resolve, reject) => {
        userCtrl.getById(userID)
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