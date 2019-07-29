/* Organisations CRUD */

const OrgModel = require('../db/db.index').models.orgModel;

const errorHandler = (error) => {
    console.log('Caught: ', error);
    return new Error(error);
};


/**
 * Creates a new organisation object
 * @param {Object} orgObject
 * @return {Promise<any>} object created
 */
function create(orgObject) {
    return OrgModel.create({
        name: orgObject.name,
        password: orgObject.password,
        location: orgObject.location,
        licenseNumber: orgObject.licenseNumber,
        email: orgObject.email,
        phone: orgObject.phone,
        activated: orgObject.activated,
        active: true,
    })
        .then((next) => {
            return next;
        })
        .catch(errorHandler);
}

/**
 * Returns an organisation object for a given id
 * @param {String} orgID
 * @return {Promise<any>} Org
 */
function findByID(orgID) {
    return OrgModel.findById(orgID)
        .then((next) => {
            return next;
        })
        .catch(errorHandler);
}

/**
 * Updates a given org object or creates it if it doesnt exist
 * @param {Object} org
 * @return {Promise<any>}
 */
function upsert(org) {
    return OrgModel.findByIdAndUpdate(
        org._id,
        org,
        {
            upsert: true,
            setDefaultsOnInsert: true,
        })
        .exec()
        .then((next) => {
            console.log('Org ' + next.code + ' upserted.');
            return true;
        })
        .catch(errorHandler);
}

function findByCode(orgCode) {
    return OrgModel
        .findOne(
            { code: orgCode }
        )
        .exec()
        .then((next) => {
            return next;
        })
        .catch(errorHandler);
}

function getAll() {
    return OrgModel.find()
        .then((next) => {
            return next;
        })
        .catch(errorHandler);
}


module.exports.upsert = upsert;
module.exports.create = create;
module.exports.getAll = getAll;
module.exports.findByCode = findByCode;
module.exports.findById = findByID;