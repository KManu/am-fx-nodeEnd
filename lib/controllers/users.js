/* User account CRUD */

const request = require('request');
const Promise = require('bluebird');
const mysql = require('mysql2');
const crypt = require('../shared/crypt');


var test = 'this is just a test value';

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS || "",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function verifyPassword(payload) {
	return new Promise((resolve, reject) => {
		const query = 'SELECT `password` FROM `users` WHERE `email` = ?';
		const values = [payload.email];
		pool.query(query, values, (err, rows) => {
			if (err) {
				reject('DB Error: ', err);
			}
			crypt.verifyPassword(payload.password, rows[0].password)
				.then(() => {
					resolve(true);
				})
				.catch(err => {
					reject('Password check error: ', err);
				});
		});
	});
}

function login(payload) {
	return new Promise((resolve, reject) => {
		verifyPassword(payload)
			.then(res => {
				console.log('Password check passed');
				const query = 'SELECT `id`, `first_name`, `last_name`, `email`, `organisation_code`, `role`, `activated`, `created` FROM `users` WHERE `email` = ?';
				const values = [
					payload.email
				];
				pool.query(query, values, (err, rows) => {
					if (err) {
						reject('DB Error: ', err);
					}
					resolve(rows);
				});
			})
			.catch(err => {
				// password check failed
				reject({
					message: 'Password verification failed.'
				});
			});
	})
}

function create(payload) {
	return new Promise((resolve, reject) => {
		crypt.hashPassword(payload.password)
			.then(passwordHash => {
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
				pool.query(query, values, (err, rows, info) => {
					
					if (err) {
						reject('DB Error: ', err);
					}
					console.log('rows: ', rows);
					resolve(rows);
				});
			})
			.catch(err => {
				reject('Password Hash Error: ', err);
			});
	})
}

function edit(payload) {
	return new Promise((resolve, reject) => {

	})
}

function removeUser(userID) {
	return new Promise((resolve, reject) => {

	})
}


function getUserDetailsByEmail(userEmail) {
	return new Promise((resolve, reject) => {
		const query = 'SELECT `id`, `first_name`, `last_name`, `email`, `organisation_code`, `role`, `activated`, `created` FROM `users` WHERE `email` = ?';
		const values = [
			userEmail
		];
		pool.query(query, values, (err, rows) => {
			if (err) {
				reject('DB Error: ', err);
			}
			resolve(rows);
		});
	});
}

function getUserDetailsByID(userID) {
	return new Promise((resolve, reject) => {
		const query = 'SELECT `id`, `first_name`, `last_name`, `email`, `organisation_code`, `role`, `activated`, `created` FROM `users` WHERE `id` = ?';
		const values = [
			userID
		];
		pool.query(query, values, (err, rows) => {
			if (err) {
				reject('DB Error: ', err);
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