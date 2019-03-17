/* Organisations CRUD */

const request = require('request');
var Promise = require('bluebird')
const lodash = require('lodash')
const mysql = require('mysql2');
const shortid = require('shortid');
const crypt = require('../shared/crypt');

var test = 'this is just a test value';

require('dotenv').config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



function create(payload) {
    return new Promise((resolve, reject) => {
        crypt.hashPassword(payload.password)
            .then(passwordHash => {
                const query = 'INSERT INTO `organisation` (`id`,`code`,`name`,`password`,`location`,`license_number`,`email`,`phone`,`activated`,`deleted`,`created`) VALUES(NULL,?,?,?,?,?,?,?,0,0,CURRENT_TIMESTAMP)';
                const code = shortid.generate();
                const values = [
                    code,
                    payload.name,
                    passwordHash,
                    payload.location,
                    payload.license_number,
                    payload.email,
                    payload.phone
                ];
                
                pool.query(query, values, (err, rows) => {
                    if (err) {
                        reject('DB Error: ', err);
                    }
                    console.log('rows: ', rows);
                    resolve(rows);
                });
            })
            .catch(err => {

            });

    })
}

function edit(payload) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE `organisations` SET `code`=?,`name`=?,`password`=?,`location`=?,`license_number`=?,`email`=?,`phone`=? WHERE `id` = ?';
        const values = [
            payload.code,
            payload.name,
            payload.password,
            payload.location,
            payload.license_number,
            payload.email,
            payload.phone,
            payload.id
        ];
        pool.query(query, values, (err, rows) => {
            if (err) reject('DB Error: ', err);
            resolve(data);
        });
    })
}

function removeOrganisation(orgID) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE `organisations` SET `deleted` = 1 WHERE `id`=?';
        const values = [
            orgID
        ];
        pool.query(query, values, (err, rows) => {
            if (err) reject('DB Error: ', err);
            resolve(data);
        });
    })
}

function getOrganisationByCode(code) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * from `organisations` WHERE `code` = ?';
        const values = [
            code
        ];
        pool.query(query, values, (err, rows) => {
            if (err) reject('DB Error: ', err);
            resolve(rows);
        });
    });
}

function getOrganisationByID(id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * from `organisations` WHERE `id` = ?';
        const values = [
            id
        ];
        pool.query(query, values, (err, rows) => {
            if (err) reject('DB Error: ', err);
            resolve(rows);
        });
    });
}


function getOrganisations() {
    return new Promise((resolve, reject) => {
        const query = '';
        const values = [

        ];
        pool.query(query, values, (err, rows) => {
            if (err) reject('DB Error: ', err);
            resolve(values);
        });
    })
}



module.exports.edit = edit;
module.exports.create = create;
module.exports.getOrganisations = getOrganisations;
module.exports.removeOrganisation = removeOrganisation;
module.exports.getOrganisationByID = getOrganisationByID;
module.exports.getOrganisationByCode = getOrganisationByCode;