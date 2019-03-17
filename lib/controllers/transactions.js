/* Transactions CRUD */

const request = require('request');
const fs = require('fs');
var Promise = require('bluebird')
const lodash = require('lodash')
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
    queueLimit: 0
});

function create(payload){
	return new Promise((resolve, reject)=>{

	})
}

function login(payload){
	return new Promise((resolve, reject) =>{
		const query = 'SELECT `code`, `name`, `location`, `license_number`, `email`, `phone` WHERE `email` = ? AND `deleted = 0` ';
	});
}

function edit(payload){
	return new Promise((resolve, reject)=>{

	})
} 

function removeTransactions(transID){
	return new Promise((resolve, reject)=>{

	})
}

function getTransactions(){
    return new Promise((resolve,reject)=>{

    });
}




module.exports.create = create;
module.exports.edit = edit;
module.exports.removeTransactions = removeTransactions;