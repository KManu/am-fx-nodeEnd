/**
 * @module shared/auth
 */

const Promise = require('bluebird');
const userCtrl = require('../controllers/users.ctrl');


/**
 * Returns a Promise based boolean depending on whether the user is an admin of an Organisation
 * @param {Object} userID
 * @param {Object} orgID
 * @param {string} user.organisation_code
 * @return {Promise<boolean>}
 */
function isOrgAdmin(userID, orgID) {
    return new Promise((resolve, reject) => {
        userCtrl.getById(userID)
            .then((res) => {
                if (res.status === false) {
                    resolve(false);
                } else {
                    if (res.data.role.toLowerCase() === 'org-admin' && res.data.organisation.id === orgID) {
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
 * @param {Object} orgID
 * @param {string} user.organisation_code
 * @return {Promise<boolean>}
 */
function isOrgUser(userID, orgID) {
    return new Promise((resolve, reject) => {
        userCtrl.getById(userID)
            .then((res) => {
                if (res.status === false) {
                    resolve(false);
                } else if (res.data.organisation.id === orgID) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};


module.exports.isOrgUser = isOrgUser;
module.exports.isOrgAdmin = isOrgAdmin;