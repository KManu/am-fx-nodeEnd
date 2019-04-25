/* Transactions CRUD */

const Promise = require('bluebird')
const mysql = require('mysql2');
const Hashids = require('hashids');
const shortid = require('shortid');

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
        console.log(payload);
        const query = 'INSERT INTO `transactions` (`id`, `timestamp`, `receipt_id`, `type`, `currency_code`, `currency_name`, `amount`, `rate`, `full_name`, `id_number`, `id_type`, `home_country`, `residential_address`, `post_address`, `teller_id`, `organisation_code`, `deleted`) VALUES(NULL, CURRENT_TIMESTAMP,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0) ';
        const hashids = new Hashids(shortid.generate(), 8);
        const hash = hashids.encode(1); 
        const receipt_id = hash;
        const values = [
            receipt_id,
            payload.type,
            payload.currency_code,
            payload.currency_name,
            payload.amount,
            payload.rate,
            payload.full_name,
            payload.id_number,
            payload.id_type,
            payload.home_country,
            payload.residential_address,
            payload.post_address,
            payload.teller_id,
            payload.organisation_code
        ];
        console.log(values);
        pool.query(query, values, (err, rows)=>{
            if (err) reject('DB Error: ', err);

            resolve(rows);
        });
	})
}

function removeTransactions(transID){
	return new Promise((resolve, reject)=>{

	})
}

function getTransactionsByUser(userID){
    return new Promise((resolve,reject)=>{
        const query = 'SELECT `timestamp`, `receipt_id`, `type`, `currency_code`,`currency_name`, `amount`, `rate`, `full_name`, `id_number`, `id_type`, `home_country`, `residential_address`, `post_address`, `organisation_code` FROM `transactions` WHERE `deleted` = 0 AND `teller_id` = ?';
        const values = [userID];
        pool.query(query, values, (err, rows) => {
            if(err) reject('DB Error: ', err);

            resolve(rows);
        });
    });
}

function getTransactionsByOrg(orgCode, type){
    return new Promise((resolve,reject)=>{
        const query = 'SELECT `timestamp`, `receipt_id`, `type`, `currency_code`, `currency_name`, `amount`, `rate`, `full_name`, `id_number`, `id_type`, `home_country`, `residential_address`, `post_address`, `teller_id` FROM `transactions` WHERE `deleted` = 0 AND `organisation_code` = ? AND `type` = ?';
        const values = [orgCode, type];
        pool.query(query, values, (err, rows) => {
            if(err) reject('DB Error: ', err);

            resolve(rows);
        });
    });
}




module.exports.create = create;
module.exports.removeTransactions = removeTransactions;
module.exports.getTransactionsByUser = getTransactionsByUser;
module.exports.getTransactionsByOrg = getTransactionsByOrg;